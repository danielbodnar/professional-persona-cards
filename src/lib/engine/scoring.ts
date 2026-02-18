import type { Category } from "./category-seeds";
import { CATEGORY_SEEDS } from "./category-seeds";

export interface RepoData {
  full_name: string;
  language: string | null;
  topics: string[];
  description: string | null;
  stargazers_count?: number;
  forks_count?: number;
  html_url?: string;
}

/**
 * Check if two topic strings are a meaningful match.
 * Short tokens (< 3 chars) require exact match to avoid false positives
 * like category topic "r" matching any repo topic containing the letter "r".
 * Longer tokens use bidirectional substring matching.
 */
function topicsMatch(repoTopic: string, catTopic: string): boolean {
  if (repoTopic === catTopic) return true;
  if (repoTopic.length < 3 || catTopic.length < 3) return false;
  return repoTopic.includes(catTopic) || catTopic.includes(repoTopic);
}

/**
 * Check if a keyword appears in text as a whole word (not as a substring of
 * a larger word). For keywords < 6 chars, requires word boundaries on both
 * sides to prevent matches like "edge" in "knowledge". Longer keywords are
 * distinctive enough that simple includes suffices.
 */
function matchesKeyword(text: string, keyword: string): boolean {
  if (keyword.length < 4) return false;
  const idx = text.indexOf(keyword);
  if (idx === -1) return false;
  if (keyword.length >= 6) return true;
  // Short keyword (4-5 chars): require word boundaries
  const before = idx > 0 ? text[idx - 1] : " ";
  const after = idx + keyword.length < text.length ? text[idx + keyword.length] : " ";
  return !/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after);
}

/** Score a single repo against a single category's signals. */
function scoreRepo(
  lang: string,
  topics: string[],
  desc: string,
  name: string,
  cat: Category,
): number {
  let score = 0;

  // Language match: +2 points
  if (cat.languages.some((l) => l.toLowerCase() === lang)) {
    score += 2;
  }

  // Topic match: +3 points per matching topic
  const topicMatches = topics.filter((t) =>
    cat.topics.some((st) => topicsMatch(t, st)),
  ).length;
  score += topicMatches * 3;

  // Description keyword match: +1.5 per keyword
  const descMatches = cat.keywords.filter((kw) => matchesKeyword(desc, kw)).length;
  score += descMatches * 1.5;

  // Repo name match: +1 per keyword (use repo name, not full_name with owner prefix)
  const repoName = name.includes("/") ? name.split("/").pop()! : name;
  const nameMatches = cat.keywords.filter((kw) => matchesKeyword(repoName, kw)).length;
  score += nameMatches * 1;

  return score;
}

/**
 * Compute raw category scores from starred and owned repos.
 *
 * Accepts an optional categories array; defaults to CATEGORY_SEEDS.
 * Same scoring formula as the original domain system:
 *   - Language match: +2 points
 *   - Topic match: +3 points per matching topic
 *   - Description keyword match: +1.5 per keyword
 *   - Repo name keyword match: +1 per keyword
 *   - Owned repos receive a 3x multiplier
 */
export function computeCategoryScores(
  stars: RepoData[],
  ownedRepos: RepoData[],
  categories: Category[] = CATEGORY_SEEDS,
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const cat of categories) {
    scores[cat.id] = 0;
  }

  for (const repo of stars) {
    const lang = (repo.language || "").toLowerCase();
    const topics = (repo.topics || []).map((t) => t.toLowerCase());
    const desc = (repo.description || "").toLowerCase();
    const name = (repo.full_name || "").toLowerCase();

    for (const cat of categories) {
      scores[cat.id] += scoreRepo(lang, topics, desc, name, cat);
    }
  }

  // Owned repos get 3x weight
  for (const repo of ownedRepos) {
    const lang = (repo.language || "").toLowerCase();
    const topics = (repo.topics || []).map((t) => t.toLowerCase());
    const desc = (repo.description || "").toLowerCase();
    const name = (repo.full_name || "").toLowerCase();

    for (const cat of categories) {
      scores[cat.id] += scoreRepo(lang, topics, desc, name, cat) * 3;
    }
  }

  return scores;
}

/**
 * Normalize raw scores to a 40-100 radar range.
 *
 * - If all scores are 0, return unchanged.
 * - If score > 0: Math.round(40 + (score / max) * 60)
 * - If score === 0: stays 0
 */
export function normalizeToRadar(
  scores: Record<string, number>,
): Record<string, number> {
  const values = Object.values(scores);
  const max = Math.max(...values);
  if (max === 0) return scores;

  const normalized: Record<string, number> = {};
  for (const [id, score] of Object.entries(scores)) {
    if (score > 0) {
      normalized[id] = Math.round(40 + (score / max) * 60);
    } else {
      normalized[id] = 0;
    }
  }
  return normalized;
}

/**
 * Compute category scores from owned repos only (no star influence).
 *
 * Used for persona determination — personas represent what you BUILD,
 * not what you star. Stars drive interests separately.
 */
export function computeOwnedRepoScores(
  ownedRepos: RepoData[],
  categories: Category[] = CATEGORY_SEEDS,
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const cat of categories) {
    scores[cat.id] = 0;
  }

  for (const repo of ownedRepos) {
    const lang = (repo.language || "").toLowerCase();
    const topics = (repo.topics || []).map((t) => t.toLowerCase());
    const desc = (repo.description || "").toLowerCase();
    const name = (repo.full_name || "").toLowerCase();

    for (const cat of categories) {
      scores[cat.id] += scoreRepo(lang, topics, desc, name, cat);
    }
  }

  return scores;
}

/**
 * @deprecated Use computeCategoryScores instead.
 * Kept for backward compatibility during transition.
 */
export const computeDomainScores = computeCategoryScores;
