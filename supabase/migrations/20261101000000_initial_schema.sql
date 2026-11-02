-- ==============================================================================
-- EDUCATION ERP — FOUNDATIONAL SCHEMA MIGRATION
-- Multi-Tenant Architecture: Schools, Profiles, School Memberships & RLS
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enumerations
CREATE TYPE user_role AS ENUM (
  'PRINCIPAL',
  'ADMIN',
  'TEACHER',
  'STUDENT',
  'PARENT'
);

CREATE TYPE membership_status AS ENUM (
  'active',
  'inactive',
  'pending',
  'suspended'
);

CREATE TYPE school_status AS ENUM (
  'active',
  'inactive',
  'suspended'
);

-- 3. Utility Function: Updated At Timestamp Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 4. Table: schools
-- Root tenant entity. Every school has dedicated settings, code, and affiliation.
-- ------------------------------------------------------------------------------
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  affiliation_number TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  status school_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_code ON schools(code);
CREATE INDEX idx_schools_status ON schools(status);

CREATE TRIGGER trg_schools_updated_at
BEFORE UPDATE ON schools
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 5. Table: profiles
-- User profile linked 1:1 with Supabase Auth users.
-- Stores user identity independent of any single school.
-- ------------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_profiles_email ON profiles(email);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 6. Table: school_memberships
-- Connects a user profile to a school with an assigned role.
-- A user may hold memberships across multiple schools or different roles.
-- ------------------------------------------------------------------------------
CREATE TABLE school_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  status membership_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_school_user_role UNIQUE (school_id, user_id, role)
);

CREATE INDEX idx_memberships_school_id ON school_memberships(school_id);
CREATE INDEX idx_memberships_user_id ON school_memberships(user_id);
CREATE INDEX idx_memberships_lookup ON school_memberships(school_id, user_id, status);

CREATE TRIGGER trg_school_memberships_updated_at
BEFORE UPDATE ON school_memberships
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 7. Automated Profile Provisioning on User Signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 8. Security Definer Helper Functions for RLS
-- ------------------------------------------------------------------------------

-- Check if current authenticated user has an active membership in a school
CREATE OR REPLACE FUNCTION public.is_school_member(
  lookup_school_id UUID,
  required_roles user_role[] DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  IF required_roles IS NULL THEN
    RETURN EXISTS (
      SELECT 1
      FROM public.school_memberships
      WHERE school_id = lookup_school_id
        AND user_id = auth.uid()
        AND status = 'active'
    );
  ELSE
    RETURN EXISTS (
      SELECT 1
      FROM public.school_memberships
      WHERE school_id = lookup_school_id
        AND user_id = auth.uid()
        AND role = ANY(required_roles)
        AND status = 'active'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Fetch all schools affiliated with current authenticated user
CREATE OR REPLACE FUNCTION public.get_current_user_schools()
RETURNS TABLE (
  school_id UUID,
  school_name TEXT,
  school_slug TEXT,
  school_code TEXT,
  role user_role,
  status membership_status
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS school_id,
    s.name AS school_name,
    s.slug AS school_slug,
    s.code AS school_code,
    m.role,
    m.status
  FROM public.school_memberships m
  INNER JOIN public.schools s ON s.id = m.school_id
  WHERE m.user_id = auth.uid()
    AND m.status = 'active'
    AND s.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- ------------------------------------------------------------------------------
-- 9. Row Level Security (RLS) Configuration
-- ------------------------------------------------------------------------------

-- Enable RLS on all foundational tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_memberships ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 9a. Policies for `profiles`
-- ------------------------------------------------------------------------------
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Members of the same school can view other profiles (e.g. teachers viewing students)
CREATE POLICY "School members can view peers in same school"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM school_memberships m1
    JOIN school_memberships m2 ON m1.school_id = m2.school_id
    WHERE m1.user_id = auth.uid()
      AND m2.user_id = profiles.id
      AND m1.status = 'active'
      AND m2.status = 'active'
  )
);

-- ------------------------------------------------------------------------------
-- 9b. Policies for `schools`
-- ------------------------------------------------------------------------------
-- Users can view schools where they hold an active membership
CREATE POLICY "Users can view affiliated schools"
ON schools FOR SELECT
TO authenticated
USING (
  public.is_school_member(id)
);

-- Principals and Admins can update school details
CREATE POLICY "School leadership can update school details"
ON schools FOR UPDATE
TO authenticated
USING (
  public.is_school_member(id, ARRAY['PRINCIPAL'::user_role, 'ADMIN'::user_role])
)
WITH CHECK (
  public.is_school_member(id, ARRAY['PRINCIPAL'::user_role, 'ADMIN'::user_role])
);

-- ------------------------------------------------------------------------------
-- 9c. Policies for `school_memberships`
-- ------------------------------------------------------------------------------
-- Users can view their own memberships across all schools
CREATE POLICY "Users can view their own memberships"
ON school_memberships FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- School Principals and Admins can view all memberships within their school
CREATE POLICY "Leadership can view school memberships"
ON school_memberships FOR SELECT
TO authenticated
USING (
  public.is_school_member(school_id, ARRAY['PRINCIPAL'::user_role, 'ADMIN'::user_role])
);

-- Principals and Admins can insert/update memberships in their school
CREATE POLICY "Leadership can create memberships"
ON school_memberships FOR INSERT
TO authenticated
WITH CHECK (
  public.is_school_member(school_id, ARRAY['PRINCIPAL'::user_role, 'ADMIN'::user_role])
);

CREATE POLICY "Leadership can update memberships"
ON school_memberships FOR UPDATE
TO authenticated
USING (
  public.is_school_member(school_id, ARRAY['PRINCIPAL'::user_role, 'ADMIN'::user_role])
)
WITH CHECK (
  public.is_school_member(school_id, ARRAY['PRINCIPAL'::user_role, 'ADMIN'::user_role])
);

CREATE POLICY "Leadership can delete memberships"
ON school_memberships FOR DELETE
TO authenticated
USING (
  public.is_school_member(school_id, ARRAY['PRINCIPAL'::user_role, 'ADMIN'::user_role])
);

