/**
 * Environment-based configuration with sensible defaults.
 *
 * All values are resolved from Cloudflare env vars (wrangler.jsonc vars section)
 * with fallbacks. This keeps magic numbers out of business logic.
 */

export interface AppConfig {
  /** Items per GitHub API page (default: 100) */
  githubPerPage: number;
  /** Max star pages to fetch — 50 × 100 = 5000 stars (default: 50) */
  maxStarPages: number;
  /** Max repo pages to fetch — 5 × 100 = 500 repos (default: 5) */
  maxRepoPages: number;
  /** KV cache TTL in seconds (default: 86400 = 24h) */
  cacheTtl: number;
  /** Rate limit window in seconds (default: 3600 = 1h) */
  rateLimitWindow: number;
  /** Min normalized score for category activation (default: 45) */
  personaThreshold: number;
  /** HTTP Cache-Control max-age seconds (default: 300 = 5m) */
  apiCacheMaxAge: number;
  /** Years without push to consider repo inactive (default: 3) */
  inactiveYears: number;
}

/** Parse an env value as an integer, returning the default on failure. */
function intOr(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Resolve configuration from Cloudflare env vars.
 *
 * Env var names match the plan:
 *   GITHUB_PER_PAGE, MAX_STAR_PAGES, MAX_REPO_PAGES, CACHE_TTL,
 *   RATE_LIMIT_WINDOW, PERSONA_THRESHOLD, API_CACHE_MAX_AGE, INACTIVE_YEARS
 */
export function resolveConfig(env: Record<string, string | undefined>): AppConfig {
  return {
    githubPerPage: intOr(env.GITHUB_PER_PAGE, 100),
    maxStarPages: intOr(env.MAX_STAR_PAGES, 50),
    maxRepoPages: intOr(env.MAX_REPO_PAGES, 5),
    cacheTtl: intOr(env.CACHE_TTL, 86400),
    rateLimitWindow: intOr(env.RATE_LIMIT_WINDOW, 3600),
    personaThreshold: intOr(env.PERSONA_THRESHOLD, 45),
    apiCacheMaxAge: intOr(env.API_CACHE_MAX_AGE, 300),
    inactiveYears: intOr(env.INACTIVE_YEARS, 3),
  };
}
