/**
 * Central OpenRouter AI configuration.
 * Values come from `.env.local` (OPENROUTER_MODEL / OPENROUTER_API_KEY).
 * Defaults stay free-tier only when env vars are unset.
 */

/** Free-only default; override with OPENROUTER_MODEL in .env.local. */
export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL?.trim() || 'openrouter/free';

/**
 * Extra free models tried automatically when the primary model returns empty
 * or unavailable responses. Override with comma-separated OPENROUTER_FALLBACK_MODELS
 * in `.env.local`.
 */
export const OPENROUTER_FALLBACK_MODELS = (
  process.env.OPENROUTER_FALLBACK_MODELS?.trim() ||
  'google/gemma-4-31b-it:free,google/gemma-4-26b-a4b-it:free,openrouter/free'
)
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean);

/** OpenRouter Chat Completions endpoint. */
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/** Default generation temperature for structured triage tasks. */
export const OPENROUTER_TEMPERATURE = 0.2;

/** Slightly higher temperature for natural reply drafting. */
export const OPENROUTER_DRAFT_TEMPERATURE = 0.5;

/** Max tokens for classification / escalation / summary responses. */
export const OPENROUTER_MAX_TOKENS = 1600;

/** Max tokens for multi-tone reply drafts. */
export const OPENROUTER_DRAFT_MAX_TOKENS = 2000;

/**
 * Resolve the server-side API key from `.env.local`.
 * Prefer OPENROUTER_API_KEY; AI_KEY is accepted as a local fallback.
 */
export function getOpenRouterApiKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY || process.env.AI_KEY || undefined;
}
