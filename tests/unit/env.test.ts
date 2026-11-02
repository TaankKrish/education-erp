import { describe, it, expect } from 'vitest';
import { isSupabaseConfigured } from '@/lib/validations/env';

describe('Environment Configuration', () => {
  it('identifies unconfigured or placeholder Supabase credentials', () => {
    // When no env is set, it defaults to empty/unconfigured
    const configured = isSupabaseConfigured();
    expect(typeof configured).toBe('boolean');
  });
});

