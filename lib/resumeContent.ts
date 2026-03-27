/**
 * Rich resume content — fill in your own data here.
 * Use **text** for bold phrases.
 */

export interface BulletPair {
  zh: [string, string];
  en: [string, string];
}

// Keyed by exp.company (Chinese name)
export const EXP_CONTENT: Record<string, BulletPair> = {};

// Keyed by proj.title (Chinese title)
export const PROJ_CONTENT: Record<string, BulletPair> = {};
