import type { Category } from "./category-seeds";
import { CATEGORY_SEEDS } from "./category-seeds";
import type { RepoData } from "./scoring";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProjectCard {
  name: string;
  description: string;
  url: string;
  tech: string[];
  persona_map: string[];
  language: string;
  stars: number;
  forks: number;
}

// ---------------------------------------------------------------------------
// Map a single repo to its matching category IDs
// ---------------------------------------------------------------------------

/**
 * Score a repo against all categories.
 *   - Language match: +2
 *   - Topic match: +3 per matching topic
 *   - Description keyword match: +1.5 per keyword
 *
 * Include categories with score >= 2. Return sorted by score descending.
 */
export function mapRepoToPersonas(
  repo: RepoData,
  categories: Category[] = CATEGORY_SEEDS,
): string[] {
  const lang = (repo.language || "").toLowerCase();
  const topics = (repo.topics || []).map((t) => t.toLowerCase());
  const desc = (repo.description || "").toLowerCase();

  const mapped: { id: string; score: number }[] = [];

  for (const cat of categories) {
    let score = 0;

    if (cat.languages.some((l) => l.toLowerCase() === lang)) {
      score += 2;
    }

    const topicHits = topics.filter((t) =>
      cat.topics.some((st) => t.includes(st) || st.includes(t)),
    ).length;
    score += topicHits * 3;

    const descHits = cat.keywords.filter((kw) => desc.includes(kw)).length;
    score += descHits * 1.5;

    if (score >= 2) {
      mapped.push({ id: cat.id, score });
    }
  }

  return mapped.sort((a, b) => b.score - a.score).map((m) => m.id);
}

// ---------------------------------------------------------------------------
// Generate project cards from owned repos
// ---------------------------------------------------------------------------

/**
 * For each owned repo with at least one category mapping:
 *   - Extract name, description, url, language
 *   - Determine tech stack from language + topics
 *   - Map to categories using mapRepoToPersonas
 *   - Include stars and forks count
 *
 * Sort by stars descending (most popular first).
 */
export function generateProjectCards(
  ownedRepos: RepoData[],
  categories: Category[] = CATEGORY_SEEDS,
): ProjectCard[] {
  const cards: ProjectCard[] = [];

  for (const repo of ownedRepos) {
    const personaMap = mapRepoToPersonas(repo, categories);
    if (personaMap.length === 0) continue;

    const tech: string[] = [];
    if (repo.language) {
      tech.push(repo.language);
    }
    for (const topic of repo.topics || []) {
      const display = topic
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      if (!tech.includes(display) && display.toLowerCase() !== (repo.language || "").toLowerCase()) {
        tech.push(display);
      }
      if (tech.length >= 8) break;
    }

    const name = repo.full_name.split("/")[1] || repo.full_name;

    cards.push({
      name,
      description: repo.description || "",
      url: repo.html_url || `https://github.com/${repo.full_name}`,
      tech,
      persona_map: personaMap,
      language: repo.language || "",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
    });
  }

  cards.sort((a, b) => b.stars - a.stars);
  return cards;
}
