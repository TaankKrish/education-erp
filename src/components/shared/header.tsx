import * as React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/config/app';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-none">{APP_CONFIG.name}</span>
              <span className="text-xs text-muted-foreground font-normal">CBSE School SaaS</span>
            </div>
          </Link>
          <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1.5 py-1 text-xs font-medium text-emerald-700 border-emerald-300 bg-emerald-50/70 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Phase 0 Foundation Active
          </Badge>
        </div>

        <nav className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono bg-muted/60 px-3 py-1.5 rounded-md border border-border">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Multi-Tenant RLS Ready</span>
          </div>
        </nav>
      </div>
    </header>
  );
}

