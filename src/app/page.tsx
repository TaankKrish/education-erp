import * as React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Shield,
  Layers,
  Database,
  Building2,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { AppShell } from '@/components/layouts/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { APP_CONFIG } from '@/config/app';
import { ROLE_METADATA } from '@/config/roles';

export default function HomePage() {
  const rolesList = Object.values(ROLE_METADATA);

  return (
    <AppShell>
      {/* Hero Section */}
      <section className="relative border-b border-border/80 bg-gradient-to-b from-slate-50/50 to-background py-16 dark:from-slate-950/20">
        <div className="container flex flex-col items-start gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" className="font-mono text-xs">
              {APP_CONFIG.phase}
            </Badge>
            <Badge variant="outline" className="text-xs">
              CBSE Private Schools Target (500–2000 Students)
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-slate-50">
            {APP_CONFIG.name}
            <span className="block text-primary text-2xl sm:text-3xl md:text-4xl font-semibold mt-2">
              Multi-Tenant Education ERP Architecture
            </span>
          </h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            A production-ready SaaS foundation built with Next.js 15 App Router, Supabase,
            PostgreSQL Row Level Security, and feature-first modular engineering.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button size="lg" className="gap-2 shadow-sm" asChild>
              <Link href="#architecture">
                Explore Architecture <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link href="#roles">Review 5 Roles & Permissions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Foundation Highlights */}
      <section className="container py-12" id="architecture">
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Layers className="h-4 w-4" /> System Architecture
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Four Foundational Architectural Pillars
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Established during Phase 0 to ensure high maintainability, strict school-level data
            isolation, and zero hardcoded permissions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Pillar 1 */}
          <Card className="border-border/80 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Building2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Multi-Tenant Isolation</CardTitle>
              <CardDescription className="text-xs">
                Row-Level Security & Membership Model
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Each school data domain is isolated at the database level via PostgreSQL RLS. Users
                can hold memberships in multiple schools without data contamination.
              </p>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                <li>schools (Tenant root)</li>
                <li>profiles (Global Identity)</li>
                <li>school_memberships (Role binding)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 2 */}
          <Card className="border-border/80 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Central RBAC</CardTitle>
              <CardDescription className="text-xs">
                5 Primary Roles & Contextual Rules
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Centralized permission evaluation matrix. Rules account for user role, school
                membership, class-section assignments, and parent-child linkages.
              </p>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                <li>Principal & Admin</li>
                <li>Teacher (Assigned classes)</li>
                <li>Student & Parent (Scoped)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 3 */}
          <Card className="border-border/80 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Database className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Supabase & PostgreSQL</CardTitle>
              <CardDescription className="text-xs">
                Client & Server SSR Architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Fully typed TypeScript client with @supabase/ssr. Supports Next.js App Router Server
                Components, Actions, and secure cookies.
              </p>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                <li>createBrowserClient()</li>
                <li>createServerClient(cookies)</li>
                <li>createAdminClient() (Server-only)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 4 */}
          <Card className="border-border/80 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">CBSE-First Design</CardTitle>
              <CardDescription className="text-xs">
                Indian Private School Structure
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Engineered for CBSE terminology, academic years, sections, subject streams, and
                grading norms (CCE / Annual Examination patterns).
              </p>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                <li>Affiliation & School Codes</li>
                <li>Academic Year Tracking</li>
                <li>Section-Teacher Mapping</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Central Role and Permission Architecture Matrix */}
      <section className="border-t border-border/80 bg-muted/20 py-12" id="roles">
        <div className="container">
          <div className="mb-8 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Users className="h-4 w-4" /> Role Architecture
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Centrally Governed User Roles
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Strictly declared in <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">src/config/roles.ts</code>.
              Guarantees that permissions are verified consistently in Server Actions and database RLS.
            </p>
          </div>

          <Card className="overflow-hidden border-border/80 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Role</TableHead>
                  <TableHead className="w-[160px]">Enum Constant</TableHead>
                  <TableHead>Scope of Access</TableHead>
                  <TableHead className="w-[220px]">Target Dashboard</TableHead>
                  <TableHead className="w-[120px] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolesList.map((item) => (
                  <TableRow key={item.key}>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                      {item.label}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.badgeVariant} className="font-mono text-[11px]">
                        {item.key}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.description}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                      {item.dashboardPath}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> Defined
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* Foundational Database Schema */}
      <section className="container py-12" id="database">
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Database className="h-4 w-4" /> Database Foundation
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Initial Schema Entities & RLS Policies
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Migration file <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">supabase/migrations/20261101000000_initial_schema.sql</code> provides
            the core data layer with strict foreign key constraints and automated timestamp triggers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold font-mono">public.schools</CardTitle>
                <Badge variant="outline" className="text-[10px]">Tenant Root</Badge>
              </div>
              <CardDescription className="text-xs">
                Stores CBSE school registration, affiliation number, and address
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs space-y-1.5 font-mono text-muted-foreground">
              <div>• id: UUID (PK)</div>
              <div>• name: TEXT NOT NULL</div>
              <div>• slug: TEXT UNIQUE</div>
              <div>• code: TEXT UNIQUE (CBSE)</div>
              <div>• affiliation_number: TEXT</div>
              <div>• status: school_status</div>
              <div className="pt-2 text-emerald-600 dark:text-emerald-400 font-sans text-xs font-medium flex items-center gap-1">
                <Lock className="h-3 w-3" /> RLS: Read by members only
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold font-mono">public.profiles</CardTitle>
                <Badge variant="outline" className="text-[10px]">Global Identity</Badge>
              </div>
              <CardDescription className="text-xs">
                1:1 with auth.users, synchronized via Postgres trigger
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs space-y-1.5 font-mono text-muted-foreground">
              <div>• id: UUID (PK &rarr; auth.users)</div>
              <div>• email: TEXT UNIQUE</div>
              <div>• full_name: TEXT NOT NULL</div>
              <div>• phone: TEXT</div>
              <div>• avatar_url: TEXT</div>
              <div>• updated_at: TIMESTAMPTZ</div>
              <div className="pt-2 text-emerald-600 dark:text-emerald-400 font-sans text-xs font-medium flex items-center gap-1">
                <Lock className="h-3 w-3" /> RLS: Read self &amp; school peers
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold font-mono">public.school_memberships</CardTitle>
                <Badge variant="outline" className="text-[10px]">Tenancy Link</Badge>
              </div>
              <CardDescription className="text-xs">
                Associates a profile with a school under a designated role
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs space-y-1.5 font-mono text-muted-foreground">
              <div>• id: UUID (PK)</div>
              <div>• school_id: UUID (FK &rarr; schools)</div>
              <div>• user_id: UUID (FK &rarr; profiles)</div>
              <div>• role: user_role ENUM</div>
              <div>• status: membership_status</div>
              <div>• UNIQUE (school_id, user_id, role)</div>
              <div className="pt-2 text-emerald-600 dark:text-emerald-400 font-sans text-xs font-medium flex items-center gap-1">
                <Lock className="h-3 w-3" /> RLS: Read self &amp; leadership
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Development Roadmap Preview */}
      <section className="border-t border-border/80 bg-slate-50/50 dark:bg-slate-950/20 py-12" id="roadmap">
        <div className="container">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Next Development Milestone
            </h2>
            <p className="text-sm text-muted-foreground">
              Phase 0 establishes the engineering bedrock. Development will proceed into Phase 1.
            </p>
          </div>

          <Card className="border-primary/30 bg-primary/5 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Upcoming: Phase 1</Badge>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Authentication & Role-Based Access Control
                  </span>
                </div>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  Implementation of Supabase Auth email/password login, password resets, active school
                  context switcher, session middleware redirects, and protected dashboard layouts for
                  all 5 user roles.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground bg-background px-3 py-2 rounded-lg border border-border">
                <Terminal className="h-4 w-4 text-primary" />
                <span>Ready for Phase 1</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
