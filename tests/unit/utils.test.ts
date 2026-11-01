import { describe, it, expect } from 'vitest';
import { cn, formatDate, getInitials } from '@/lib/utils';

describe('Core Utilities', () => {
  it('combines class names and resolves Tailwind conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-red-500', false && 'text-blue-500', 'font-bold')).toBe(
      'text-red-500 font-bold',
    );
  });

  it('formats dates consistently', () => {
    const testDate = new Date('2026-04-15T10:00:00Z');
    const formatted = formatDate(testDate);
    expect(formatted).toMatch(/15\s+[A-Za-z]+\s+2026/);
    expect(formatDate(null)).toBe('—');
  });

  it('extracts initials reliably', () => {
    expect(getInitials('Aarav Sharma')).toBe('AS');
    expect(getInitials('Dr. Rajesh Kumar Gupta')).toBe('DG');
    expect(getInitials('Priya')).toBe('PR');
    expect(getInitials('')).toBe('??');
    expect(getInitials(null)).toBe('??');
  });
});
