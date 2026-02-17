/**
 * GitHub API fetcher with KV caching and pagination.
 *
 * All requests use:
 *   - Authorization via GITHUB_TOKEN secret (5000 req/hour) when available
 *   - Falls back to unauthenticated requests (60 req/hour) if token is missing/invalid
 *   - User-Agent: ProfilesSh/1.0
 *   - Accept: application/vnd.github.v3+json
 *   - per_page configurable (default 100)
 */

import type { GitHubProfile, GitHubRepo, StarsMeta } from "./types";
import { getCached, putCached } from "./cache";
import type { AppConfig } from "../config";

const GITHUB_API = "https://api.github.com";
const USER_AGENT = "ProfilesSh/1.0";

/** Track whether the token is known to be invalid (avoids repeated 401s). */
let tokenInvalid = false;

/** Build auth + accept headers for every GitHub request. */
function githubHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": USER_AGENT,
  };
  if (token && !tokenInvalid) {
    headers.Authorization = `token ${token}`;
  }
  return headers;
}

/** Make a GitHub API request, retrying without auth on 401. */
async function githubFetch(
  url: string,
  token?: string,
): Promise<Response> {
  const res = await fetch(url, { headers: githubHeaders(token) });

  if (res.status === 401 && token && !tokenInvalid) {
    // Token is invalid — mark it and retry without auth
    tokenInvalid = true;
    console.warn("[github/client] GITHUB_TOKEN returned 401, falling back to unauthenticated requests");
    return fetch(url, { headers: githubHeaders() });
  }

  return res;
}

/**
 * Fetch a GitHub user profile, with KV caching.
 * KV key: github:profile:{username}
 */
export async function fetchProfile(
  username: string,
  env: { KV?: KVNamespace; GITHUB_TOKEN?: string },
  config?: Pick<AppConfig, "cacheTtl">,
): Promise<GitHubProfile> {
  const ttl = config?.cacheTtl ?? 86400;
  const cacheKey = `github:profile:${username}`;

  const cached = await getCached<GitHubProfile>(env.KV, cacheKey);
  if (cached) return cached;

  const res = await githubFetch(
    `${GITHUB_API}/users/${username}`,
    env.GITHUB_TOKEN,
  );

  if (res.status === 404) {
    throw new Error(`GitHub user not found: ${username}`);
  }
  if (res.status === 403) {
    throw new Error("GitHub API rate limit exceeded");
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data: GitHubProfile = await res.json();
  await putCached(env.KV, cacheKey, data, ttl);

  return data;
}

/**
 * Fetch all owned (non-fork) repos for a user, paginated, with KV caching.
 * KV key: github:repos:{username}
 *
 * Caps at `config.maxRepoPages` pages (default 5 = 500 repos).
 */
export async function fetchRepos(
  username: string,
  env: { KV?: KVNamespace; GITHUB_TOKEN?: string },
  config?: Pick<AppConfig, "githubPerPage" | "maxRepoPages" | "cacheTtl">,
): Promise<GitHubRepo[]> {
  const perPage = config?.githubPerPage ?? 100;
  const maxPages = config?.maxRepoPages ?? 5;
  const ttl = config?.cacheTtl ?? 86400;
  const cacheKey = `github:repos:${username}`;

  const cached = await getCached<GitHubRepo[]>(env.KV, cacheKey);
  if (cached) return cached;

  const repos: GitHubRepo[] = [];
  let page = 1;

  while (page <= maxPages) {
    const res = await githubFetch(
      `${GITHUB_API}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=pushed`,
      env.GITHUB_TOKEN,
    );

    if (res.status === 404) break;
    if (res.status === 403) throw new Error("GitHub API rate limit exceeded");
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);

    const data: GitHubRepo[] = await res.json();
    if (data.length === 0) break;

    repos.push(...data.filter(r => !r.fork));
    if (data.length < perPage) break;
    page++;
  }

  await putCached(env.KV, cacheKey, repos, ttl);
  return repos;
}

/**
 * Fetch all starred repos for a user with per-page KV caching.
 *
 * Each page is individually cached under github:stars:{username}:{page}.
 * A metadata entry at github:stars:{username}:meta tracks overall state.
 *
 * Caps at `config.maxStarPages` pages (default 50 = 5000 stars).
 */
export async function fetchAllStars(
  username: string,
  env: { KV?: KVNamespace; GITHUB_TOKEN?: string },
  config?: Pick<AppConfig, "githubPerPage" | "maxStarPages" | "cacheTtl">,
): Promise<GitHubRepo[]> {
  const perPage = config?.githubPerPage ?? 100;
  const maxPages = config?.maxStarPages ?? 50;
  const ttl = config?.cacheTtl ?? 86400;

  const stars: GitHubRepo[] = [];
  let page = 1;
  let fetchedPages = 0;

  while (page <= maxPages) {
    const cacheKey = `github:stars:${username}:${page}`;
    let data = await getCached<GitHubRepo[]>(env.KV, cacheKey);

    if (!data) {
      const res = await githubFetch(
        `${GITHUB_API}/users/${username}/starred?per_page=${perPage}&page=${page}`,
        env.GITHUB_TOKEN,
      );

      if (res.status === 404) break;
      if (res.status === 403) throw new Error("GitHub API rate limit exceeded");
      if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);

      data = await res.json();
      if (!data || data.length === 0) break;

      await putCached(env.KV, cacheKey, data, ttl);
    }

    fetchedPages++;
    stars.push(...data);
    if (data.length < perPage) break;
    page++;
  }

  // Store pagination metadata
  const meta: StarsMeta = {
    totalPages: fetchedPages,
    fetchedAt: new Date().toISOString(),
    complete: page <= maxPages,
  };
  await putCached(env.KV, `github:stars:${username}:meta`, meta, ttl);

  return stars;
}

// ---------------------------------------------------------------------------
// Repo filtering
// ---------------------------------------------------------------------------

/**
 * Filter out archived, disabled, and inactive repos.
 *
 * A repo is considered inactive if its last push was more than
 * `inactiveYears` years ago (default 3).
 */
export function filterActiveRepos(
  repos: GitHubRepo[],
  inactiveYears = 3,
): GitHubRepo[] {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - inactiveYears);

  return repos.filter((r) =>
    !r.archived &&
    !r.disabled &&
    (!r.pushed_at || new Date(r.pushed_at) >= cutoff)
  );
}
