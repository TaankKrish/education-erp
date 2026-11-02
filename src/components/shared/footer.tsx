import * as React from 'react';
import { APP_CONFIG } from '@/config/app';

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 py-8 text-sm text-muted-foreground">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <p className="font-medium text-foreground">
            {APP_CONFIG.name} — {APP_CONFIG.description}
          </p>
          <p className="text-xs">
            Architected for Indian Private CBSE Schools (500–2,000 students) • Next.js App Router • Supabase RLS
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <span>{APP_CONFIG.phase}</span>
          <span className="text-border">•</span>
          <span>v{APP_CONFIG.version}</span>
        </div>
      </div>
    </footer>
  );
}

