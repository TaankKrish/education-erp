/**
 * Application metadata and global constants for Education ERP.
 */
export const APP_CONFIG = {
  name: 'EduNexa ERP',
  shortName: 'EduNexa',
  description: 'Enterprise Multi-Tenant School Management Platform for CBSE Schools',
  version: '0.1.0',
  phase: 'Phase 0 — Project Foundation',
  targetCurriculum: 'CBSE (Central Board of Secondary Education)',
  supportedLocales: ['en-IN', 'hi-IN'],
  currency: 'INR',
  currencySymbol: '₹',
  contact: {
    supportEmail: 'support@edunexa-erp.local',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;

