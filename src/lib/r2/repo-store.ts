/**
 * R2-backed repo object store.
 *
 * Each repo is stored at `github.com/{owner}/{repo}/index.md` as YAML
 * frontmatter + optional README body. Custom metadata on the R2 object
 * enables quick lookups without parsing YAML.
 *
 * R2 key pattern: github.com/{owner}/{repo}/index.md
 */

import type { GitHubRepo } from "../github/types";

/** Parsed repo object from R2 (frontmatter fields + readme body). */
export interface RepoObject {
  full_name: string;
  owner: string;
  name: string;
  language: string | null;
  description: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  license: string | null;
  html_url: string;
  created_at: string;
  pushed_at: string | null;
  fetched_at: string;
  readme: string | null;
}

/** Build the R2 key for a repo object. */
export function repoKey(fullName: string): string {
  return `github.com/${fullName}/index.md`;
}

/** Serialize a GitHubRepo (+ optional README) into YAML-frontmatter markdown. */
function serialize(repo: GitHubRepo, readme?: string | null): string {
  const fm = [
    "---",
    `full_name: "${repo.full_name}"`,
    `owner: "${repo.owner.login}"`,
    `name: "${repo.name}"`,
    `language: ${repo.language ? `"${repo.language}"` : "null"}`,
    `description: ${repo.description ? JSON.stringify(repo.description) : "null"}`,
    `topics: ${JSON.stringify(repo.topics ?? [])}`,
    `stargazers_count: ${repo.stargazers_count}`,
    `forks_count: ${repo.forks_count}`,
    `archived: ${repo.archived}`,
    `license: ${repo.license ? `"${repo.license.spdx_id}"` : "null"}`,
    `html_url: "${repo.html_url}"`,
    `created_at: "${repo.created_at}"`,
    `pushed_at: ${repo.pushed_at ? `"${repo.pushed_at}"` : "null"}`,
    `fetched_at: "${new Date().toISOString()}"`,
    "---",
  ].join("\n");

  return readme ? `${fm}\n\n${readme}` : fm;
}

/** Parse a YAML-frontmatter markdown string back into a RepoObject. */
function deserialize(content: string): RepoObject {
  const endIdx = content.indexOf("\n---", 4);
  const fmBlock = endIdx > 0 ? content.slice(4, endIdx) : content.slice(4);
  const body = endIdx > 0 ? content.slice(endIdx + 4).trim() : null;

  const get = (key: string): string | null => {
    const re = new RegExp(`^${key}:\\s*(.+)$`, "m");
    const m = fmBlock.match(re);
    if (!m) return null;
    const v = m[1].trim();
    if (v === "null") return null;
    // Strip surrounding quotes
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      return v.slice(1, -1);
    }
    return v;
  };

  const getJson = <T>(key: string, fallback: T): T => {
    const raw = get(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  return {
    full_name: get("full_name") ?? "",
    owner: get("owner") ?? "",
    name: get("name") ?? "",
    language: get("language"),
    description: getJson<string | null>("description", null),
    topics: getJson<string[]>("topics", []),
    stargazers_count: Number(get("stargazers_count")) || 0,
    forks_count: Number(get("forks_count")) || 0,
    archived: get("archived") === "true",
    license: get("license"),
    html_url: get("html_url") ?? "",
    created_at: get("created_at") ?? "",
    pushed_at: get("pushed_at"),
    fetched_at: get("fetched_at") ?? "",
    readme: body || null,
  };
}

/** Write a repo object to R2 with custom metadata for quick lookups. */
export async function putRepoObject(
  r2: R2Bucket,
  repo: GitHubRepo,
  readme?: string | null,
): Promise<void> {
  const key = repoKey(repo.full_name);
  const body = serialize(repo, readme);

  await r2.put(key, body, {
    httpMetadata: { contentType: "text/markdown" },
    customMetadata: {
      full_name: repo.full_name,
      language: repo.language ?? "",
      stargazers_count: String(repo.stargazers_count),
      fetched_at: new Date().toISOString(),
    },
  });
}

/** Read a repo object from R2. Returns null if not found. */
export async function getRepoObject(
  r2: R2Bucket,
  fullName: string,
): Promise<RepoObject | null> {
  const obj = await r2.get(repoKey(fullName));
  if (!obj) return null;

  const text = await obj.text();
  return deserialize(text);
}

/** Check if a repo object exists in R2 (HEAD-only, no body download). */
export async function repoExists(
  r2: R2Bucket,
  fullName: string,
): Promise<boolean> {
  const head = await r2.head(repoKey(fullName));
  return head !== null;
}
