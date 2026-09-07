/**
 * Central data-source switch for the SupportFlow frontend.
 *
 * USE_MOCK_DATA = true  → use existing mock data (default, preserves current UX)
 * USE_MOCK_DATA = false → fetch/mutate via the FastAPI backend
 *
 * Change only this boolean to switch modes across the entire app.
 *
 * Note: Mock mode does NOT disable OpenRouter AI. AI calls go through
 * Next.js `/api/ai/*` routes regardless of this flag.
 */
export const USE_MOCK_DATA = true;

/** Base URL for the SupportFlow FastAPI backend (no trailing slash). */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

/** API version prefix used by all resource endpoints. */
export const API_V1_PREFIX = "/api/v1";
