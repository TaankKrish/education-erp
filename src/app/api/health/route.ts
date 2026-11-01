import { NextResponse } from 'next/server';
import { APP_CONFIG } from '@/config/app';
import { isSupabaseConfigured } from '@/lib/validations/env';

export async function GET() {
  const timestamp = new Date().toISOString();

  return NextResponse.json(
    {
      status: 'healthy',
      app: APP_CONFIG.name,
      version: APP_CONFIG.version,
      phase: APP_CONFIG.phase,
      timestamp,
      supabaseConfigured: isSupabaseConfigured(),
      uptime: process.uptime(),
    },
    { status: 200 },
  );
}
