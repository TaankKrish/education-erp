-- ==============================================================================
-- EDUCATION ERP — DEVELOPMENT SEED DATA
-- Sample data for local development and verification
-- ==============================================================================

-- 1. Insert Sample Schools
INSERT INTO public.schools (id, name, slug, code, affiliation_number, contact_email, contact_phone, address, status)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Greenfield Model Senior Secondary School',
    'greenfield-delhi',
    'CBSE-DEL-0142',
    'CBSE/AFF/2130894',
    'principal@greenfield-delhi.edu.in',
    '+91-11-26549870',
    '{"street": "Sector 14, Rohini", "city": "New Delhi", "state": "Delhi", "pincode": "110085", "country": "India"}'::jsonb,
    'active'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'St. Xavier International Academy',
    'st-xavier-noida',
    'CBSE-NOI-0219',
    'CBSE/AFF/2131542',
    'admin@stxavier-noida.edu.in',
    '+91-120-4567890',
    '{"street": "Plot 4, Sector 62", "city": "Noida", "state": "Uttar Pradesh", "pincode": "201309", "country": "India"}'::jsonb,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- Note: In production Supabase environments, user profiles are automatically populated
-- via the auth.users trigger (handle_new_user). For manual local testing seeds, sample
-- records can be inserted directly after users are registered via Supabase Auth CLI/Studio.

