/**
 * Query-string personalization parser.
 *
 * Supports shields.io-style query params for highlighting content:
 *   ?featured-repos=repo1,repo2
 *   ?featured-topics=rust,nushell
 *   ?featured-orgs=cloudflare
 *   ?featured-stars=owner/repo
 *   ?refresh=true
 */

export interface ProfileQueryParams {
  /** Owned repo names to feature at top of projects section */
  featuredRepos: string[];
  /** Topics to highlight across all sections */
  featuredTopics: string[];
  /** Org names to highlight */
  featuredOrgs: string[];
  /** Starred repos (owner/repo format) to highlight */
  featuredStars: string[];
  /** Force re-fetch from GitHub (rate-limited) */
  refresh: boolean;
}

/** Parse comma-separated query param into a trimmed string array. */
function splitParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Extract personalization params from a URL.
 */
export function parseProfileParams(url: URL): ProfileQueryParams {
  return {
    featuredRepos: splitParam(url.searchParams.get("featured-repos")),
    featuredTopics: splitParam(url.searchParams.get("featured-topics")),
    featuredOrgs: splitParam(url.searchParams.get("featured-orgs")),
    featuredStars: splitParam(url.searchParams.get("featured-stars")),
    refresh: url.searchParams.get("refresh") === "true",
  };
}
