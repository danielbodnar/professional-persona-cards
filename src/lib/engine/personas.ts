import type { Category } from "./category-seeds";
import { getCategoryById } from "./category-seeds";
import { estimateExperience } from "./experience";
import type { RepoData } from "./scoring";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActivePersona {
  persona_id: string;
  confidence: number;
  sort_order: number;
}

export interface PersonaTemplate {
  title: string;
  titlePrefixes: string[];
  taglines: string[];
  icon: string;
  accentColor: string;
  bgGradient: string;
  statLabels: string[];
  stackPool: string[];
}

export interface PersonaCard {
  persona_id: string;
  title: string;
  tagline: string;
  icon: string;
  accent_color: string;
  bg_gradient: string;
  experience_label: string;
  years_active: string;
  confidence: number;
  sort_order: number;
  stats: [string, number][];
  stack: string[];
  details: string[];
  starred_repos: string[];
}

// ---------------------------------------------------------------------------
// Threshold
// ---------------------------------------------------------------------------

export const PERSONA_THRESHOLD = 45;

// ---------------------------------------------------------------------------
// Determine active personas from normalized scores
// ---------------------------------------------------------------------------

/**
 * Filter categories whose normalized score >= PERSONA_THRESHOLD,
 * sort descending, and map to ActivePersona objects.
 */
export function determinePersonas(
  normalizedScores: Record<string, number>,
): ActivePersona[] {
  return Object.entries(normalizedScores)
    .filter(([_, score]) => score >= PERSONA_THRESHOLD)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score], index) => ({
      persona_id: id,
      confidence: score / 100,
      sort_order: index,
    }));
}

// ---------------------------------------------------------------------------
// Legacy PERSONA_TEMPLATES — kept for backward compatibility
// ---------------------------------------------------------------------------

export const PERSONA_TEMPLATES: Record<string, PersonaTemplate> = {
  systems: {
    title: "Systems Engineer",
    titlePrefixes: ["Principal", "Senior", "Staff", "Lead"],
    taglines: ["I speak fluent syscall.", "Closer to the metal than your bootloader.", "The kernel whisperer."],
    icon: "\u2699\uFE0F",
    accentColor: "#4A90D9",
    bgGradient: "linear-gradient(135deg, #0a1628 0%, #132744 100%)",
    statLabels: ["Architecture", "Debugging", "Scale", "Uptime"],
    stackPool: ["Linux", "systemd", "PostgreSQL", "ZFS", "Bare Metal", "Kernel Tuning", "Proxmox", "QEMU", "KVM", "InfiniBand", "NVMe", "io_uring", "eBPF", "Zig", "C"],
  },
  platform: {
    title: "Platform Engineer",
    titlePrefixes: ["Staff", "Senior", "Principal", "Lead"],
    taglines: ["Your deploy pipeline is my canvas.", "Infrastructure as Code, chaos as a service.", "I automate the automators."],
    icon: "\uD83D\uDD17",
    accentColor: "#7C4DFF",
    bgGradient: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)",
    statLabels: ["Pipelines", "Automation", "Tooling", "DX"],
    stackPool: ["Kubernetes", "Helm", "Terraform", "Ansible", "Docker", "GitLab CI/CD", "GitHub Actions", "AWS CDK", "Pulumi", "ArgoCD", "Nix", "Buildroot"],
  },
  software: {
    title: "Software Engineer",
    titlePrefixes: ["Staff", "Senior", "Principal", "Full Stack"],
    taglines: ["Types are a love language.", "I write code that writes code.", "Compilers fear me, runtimes love me."],
    icon: "\u03BB",
    accentColor: "#00E676",
    bgGradient: "linear-gradient(135deg, #0a1a0f 0%, #132e1a 100%)",
    statLabels: ["Backend", "Frontend", "Systems", "Unix Phil."],
    stackPool: [],
  },
  cloud: {
    title: "Cloud Architect",
    titlePrefixes: ["Principal", "Senior", "Lead", "Staff"],
    taglines: ["The cloud is just someone else's bare metal.", "Distributed by design, resilient by nature.", "Multi-cloud native, single-cloud fluent."],
    icon: "\u2601\uFE0F",
    accentColor: "#40C4FF",
    bgGradient: "linear-gradient(135deg, #071825 0%, #0d2b45 100%)",
    statLabels: ["Design", "Security", "Scale", "Vision"],
    stackPool: ["AWS", "Cloudflare", "GCP", "Azure", "EKS", "Lambda", "Workers", "Multi-cloud", "VPN", "WireGuard", "E2E Encryption", "Serverless", "CDN", "Edge"],
  },
  linux: {
    title: "Linux Enthusiast",
    titlePrefixes: ["Crazy", "Passionate", "Devoted", "Obsessive"],
    taglines: ["btw, I use Linux.", "I don't use Linux. Linux uses me.", "Have you heard about our lord and savior, Tux?"],
    icon: "\uD83D\uDC27",
    accentColor: "#FFEB3B",
    bgGradient: "linear-gradient(135deg, #1a1800 0%, #2e2a05 100%)",
    statLabels: ["Passion", "Shell", "systemd", "Evangelism"],
    stackPool: [],
  },
  solutions: {
    title: "Solutions Engineer",
    titlePrefixes: ["Principal", "Senior", "Lead"],
    taglines: ["I translate between humans and machines.", "The bridge between what you want and what's possible.", "Architecture is a conversation."],
    icon: "\uD83C\uDF09",
    accentColor: "#FF9800",
    bgGradient: "linear-gradient(135deg, #1a1005 0%, #2e1f0a 100%)",
    statLabels: ["Communication", "Problem Solving", "Empathy", "Breadth"],
    stackPool: ["OpenAPI", "JSON Schema", "REST", "GraphQL", "gRPC", "CQRS", "Event-Driven", "Microservices", "Service Mesh"],
  },
  sre: {
    title: "SRE",
    titlePrefixes: ["Principal", "Senior", "Staff", "Lead"],
    taglines: ["Sleep is for the well-monitored.", "Uptime is a lifestyle, not a metric.", "I break things professionally, so production doesn't."],
    icon: "\uD83D\uDCDF",
    accentColor: "#FF5252",
    bgGradient: "linear-gradient(135deg, #1a0505 0%, #2e0f0f 100%)",
    statLabels: ["Reliability", "Incident Mgmt", "Observability", "Automation"],
    stackPool: ["Grafana", "Prometheus", "VictoriaMetrics", "Jaeger", "ELK", "Datadog", "PagerDuty", "Chaos Engineering"],
  },
  tinkerer: {
    title: "Chronic Tinkerer",
    titlePrefixes: [""],
    taglines: ["What if I just tried one more thing...", "My side projects have side projects.", "Focus score: 42."],
    icon: "\uD83D\uDD27",
    accentColor: "#FFD54F",
    bgGradient: "linear-gradient(135deg, #1a1508 0%, #2e2510 100%)",
    statLabels: ["Curiosity", "Side Projects", "Focus", "Ambition"],
    stackPool: [],
  },
  hacker: {
    title: "Old School Hacker",
    titlePrefixes: [""],
    taglines: ["The terminal is home.", "Learned by breaking things. Still does.", "Pre-cloud, pre-container, pre-everything."],
    icon: ">_",
    accentColor: "#00FF41",
    bgGradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)",
    statLabels: ["Grit", "Nostalgia", "Root Access", "Lore"],
    stackPool: ["Bare Metal", "The Terminal", "Shell", "Neovim", "vim", "Helix", "tmux", "Zellij", "Ghostty"],
  },
  dad: {
    title: "Dad",
    titlePrefixes: [""],
    taglines: ["My greatest production deployment.", "Works on weekends, deploys on weeknights.", "sudo parent --patience=infinite"],
    icon: "\uD83D\uDC68\u200D\uD83D\uDC67",
    accentColor: "#F48FB1",
    bgGradient: "linear-gradient(135deg, #1a0f15 0%, #2e1a28 100%)",
    statLabels: ["Patience", "Dad Jokes", "Snack Logistics", "Bedtime Stories"],
    stackPool: ["Diaper Deployment", "Lullaby API", "Snack Queue", "Timeout Orchestrator", "Nap Scheduler"],
  },
};

// ---------------------------------------------------------------------------
// Helper: generate a bgGradient from an accent color
// ---------------------------------------------------------------------------

function accentToGradient(hex: string): string {
  // Darken the accent to create a subtle gradient background
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dark1 = `#${Math.floor(r * 0.06).toString(16).padStart(2, "0")}${Math.floor(g * 0.06).toString(16).padStart(2, "0")}${Math.floor(b * 0.06).toString(16).padStart(2, "0")}`;
  const dark2 = `#${Math.floor(r * 0.12).toString(16).padStart(2, "0")}${Math.floor(g * 0.12).toString(16).padStart(2, "0")}${Math.floor(b * 0.12).toString(16).padStart(2, "0")}`;
  return `linear-gradient(135deg, ${dark1} 0%, ${dark2} 100%)`;
}

// ---------------------------------------------------------------------------
// Helper: derive stack from user repos/stars for categories with empty stackPool
// ---------------------------------------------------------------------------

function deriveStackFromRepos(
  cat: Category,
  stars: RepoData[],
  ownedRepos: RepoData[],
): string[] {
  const allRepos = [...ownedRepos, ...stars];
  const langCounts: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};

  for (const repo of allRepos) {
    const lang = (repo.language || "").toLowerCase();
    const topics = (repo.topics || []).map((t) => t.toLowerCase());

    let matches = false;
    if (cat.languages.some((l) => l.toLowerCase() === lang)) {
      matches = true;
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    }

    for (const t of topics) {
      if (cat.topics.some((st) => t.includes(st) || st.includes(t))) {
        matches = true;
        topicCounts[t] = (topicCounts[t] || 0) + 1;
      }
    }

    if (matches && repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  }

  const combined = [
    ...Object.entries(langCounts).map(([name, count]) => ({ name, count })),
    ...Object.entries(topicCounts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
    })),
  ];
  combined.sort((a, b) => b.count - a.count);

  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of combined) {
    const key = item.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item.name);
    }
    if (result.length >= 12) break;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Helper: find starred repos relevant to a category
// ---------------------------------------------------------------------------

function findRelevantStars(
  cat: Category,
  stars: RepoData[],
  maxCount: number = 8,
): string[] {
  const scored: { name: string; score: number }[] = [];

  for (const repo of stars) {
    const lang = (repo.language || "").toLowerCase();
    const topics = (repo.topics || []).map((t) => t.toLowerCase());
    const desc = (repo.description || "").toLowerCase();

    let score = 0;
    if (cat.languages.some((l) => l.toLowerCase() === lang)) score += 2;
    score += topics.filter((t) =>
      cat.topics.some((st) => t.includes(st) || st.includes(t)),
    ).length * 3;
    score += cat.keywords.filter((kw) => desc.includes(kw)).length * 1.5;

    if (score >= 2) {
      const repoName = repo.full_name.split("/")[1] || repo.full_name;
      scored.push({ name: repoName, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxCount).map((s) => s.name);
}

// ---------------------------------------------------------------------------
// Helper: generate detail bullet points from repos
// ---------------------------------------------------------------------------

function generateDetails(
  cat: Category,
  stars: RepoData[],
  ownedRepos: RepoData[],
): string[] {
  const details: string[] = [];

  let ownedCount = 0;
  for (const repo of ownedRepos) {
    const lang = (repo.language || "").toLowerCase();
    const topics = (repo.topics || []).map((t) => t.toLowerCase());
    const desc = (repo.description || "").toLowerCase();

    let score = 0;
    if (cat.languages.some((l) => l.toLowerCase() === lang)) score += 2;
    score += topics.filter((t) =>
      cat.topics.some((st) => t.includes(st) || st.includes(t)),
    ).length * 3;
    score += cat.keywords.filter((kw) => desc.includes(kw)).length * 1.5;

    if (score >= 2) ownedCount++;
  }

  if (ownedCount > 0) {
    details.push(`${ownedCount} owned ${ownedCount === 1 ? "repo" : "repos"} in this domain`);
  }

  let starCount = 0;
  for (const repo of stars) {
    const lang = (repo.language || "").toLowerCase();
    const topics = (repo.topics || []).map((t) => t.toLowerCase());
    const desc = (repo.description || "").toLowerCase();

    let score = 0;
    if (cat.languages.some((l) => l.toLowerCase() === lang)) score += 2;
    score += topics.filter((t) =>
      cat.topics.some((st) => t.includes(st) || st.includes(t)),
    ).length * 3;
    score += cat.keywords.filter((kw) => desc.includes(kw)).length * 1.5;

    if (score >= 2) starCount++;
  }

  if (starCount > 0) {
    details.push(`${starCount} starred ${starCount === 1 ? "repo" : "repos"} tracked in this area`);
  }

  const domainLangs: Record<string, number> = {};
  for (const repo of [...ownedRepos, ...stars]) {
    if (!repo.language) continue;
    const lang = repo.language.toLowerCase();
    if (cat.languages.some((l) => l.toLowerCase() === lang)) {
      domainLangs[repo.language] = (domainLangs[repo.language] || 0) + 1;
    }
  }
  const topLangs = Object.entries(domainLangs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([l]) => l);
  if (topLangs.length > 0) {
    details.push(`Primary languages: ${topLangs.join(", ")}`);
  }

  return details;
}

// ---------------------------------------------------------------------------
// Generate stat values for a persona card
// ---------------------------------------------------------------------------

function generateStats(
  statLabels: string[],
  normalizedScore: number,
): [string, number][] {
  return statLabels.map((label, i) => {
    const offsets = [-5, 3, -8, 5];
    const offset = offsets[i % offsets.length];
    const value = Math.max(30, Math.min(100, Math.round(normalizedScore + offset)));
    return [label, value];
  });
}

// ---------------------------------------------------------------------------
// GithubProfile type for experience estimation
// ---------------------------------------------------------------------------

export interface GithubProfile {
  login: string;
  name: string | null;
  email: string | null;
  location: string | null;
  bio: string | null;
  blog: string | null;
  company: string | null;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Main: generate full persona card details
// ---------------------------------------------------------------------------

/**
 * For each active persona, produce a fully populated PersonaCard.
 * Works with both legacy PERSONA_TEMPLATES and new Category definitions.
 */
export function generatePersonaDetails(
  activePersonas: ActivePersona[],
  normalizedScores: Record<string, number>,
  stars: RepoData[],
  ownedRepos: RepoData[],
  profile: GithubProfile,
  maxScore: number,
): PersonaCard[] {
  return activePersonas.map((ap) => {
    // Try legacy template first, then category seed
    const legacyTemplate = PERSONA_TEMPLATES[ap.persona_id];
    const cat = getCategoryById(ap.persona_id);

    if (legacyTemplate) {
      // Use legacy template (backward compat for the 9 original domains + dad)
      const experience = estimateExperience(
        profile,
        normalizedScores[ap.persona_id] || 0,
        maxScore,
      );
      const prefix = experience.prefix ||
        (legacyTemplate.titlePrefixes[0] !== "" ? legacyTemplate.titlePrefixes[0] : "");
      const fullTitle = prefix ? `${prefix} ${legacyTemplate.title}` : legacyTemplate.title;
      const tagline = legacyTemplate.taglines[ap.sort_order % legacyTemplate.taglines.length] || legacyTemplate.taglines[0];
      const stats = generateStats(legacyTemplate.statLabels, normalizedScores[ap.persona_id] || 0);

      let stack: string[];
      if (legacyTemplate.stackPool.length > 0) {
        stack = legacyTemplate.stackPool.slice(0, 10);
      } else {
        // For legacy templates without stackPool, try finding a matching category
        const fallbackCat = cat;
        if (fallbackCat) {
          stack = fallbackCat.stackPool.length > 0
            ? fallbackCat.stackPool.slice(0, 10)
            : deriveStackFromRepos(fallbackCat, stars, ownedRepos);
        } else {
          stack = [];
        }
      }

      const createdYear = new Date(profile.created_at).getFullYear();
      return {
        persona_id: ap.persona_id,
        title: fullTitle,
        tagline,
        icon: legacyTemplate.icon,
        accent_color: legacyTemplate.accentColor,
        bg_gradient: legacyTemplate.bgGradient,
        experience_label: experience.years,
        years_active: `${createdYear} - Present`,
        confidence: ap.confidence,
        sort_order: ap.sort_order,
        stats,
        stack,
        details: cat ? generateDetails(cat, stars, ownedRepos) : [],
        starred_repos: cat ? findRelevantStars(cat, stars) : [],
      };
    }

    if (cat) {
      // Use category-based template
      const experience = estimateExperience(
        profile,
        normalizedScores[ap.persona_id] || 0,
        maxScore,
      );
      const prefix = experience.prefix ||
        (cat.titlePrefixes[0] !== "" ? cat.titlePrefixes[0] : "");
      const fullTitle = prefix ? `${prefix} ${cat.title}` : cat.title;
      const tagline = cat.taglines[ap.sort_order % cat.taglines.length] || cat.taglines[0];
      const stats = generateStats(cat.statLabels, normalizedScores[ap.persona_id] || 0);
      const stack = cat.stackPool.length > 0
        ? cat.stackPool.slice(0, 10)
        : deriveStackFromRepos(cat, stars, ownedRepos);
      const details = generateDetails(cat, stars, ownedRepos);
      const starredRepos = findRelevantStars(cat, stars);
      const createdYear = new Date(profile.created_at).getFullYear();

      return {
        persona_id: ap.persona_id,
        title: fullTitle,
        tagline,
        icon: cat.icon,
        accent_color: cat.accentColor,
        bg_gradient: accentToGradient(cat.accentColor),
        experience_label: experience.years,
        years_active: `${createdYear} - Present`,
        confidence: ap.confidence,
        sort_order: ap.sort_order,
        stats,
        stack,
        details,
        starred_repos: starredRepos,
      };
    }

    // Fallback for unknown persona ids
    return {
      persona_id: ap.persona_id,
      title: ap.persona_id,
      tagline: "",
      icon: "?",
      accent_color: "#888888",
      bg_gradient: "linear-gradient(135deg, #111 0%, #222 100%)",
      experience_label: "",
      years_active: "",
      confidence: ap.confidence,
      sort_order: ap.sort_order,
      stats: [],
      stack: [],
      details: [],
      starred_repos: [],
    };
  });
}
