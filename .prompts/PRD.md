# Identity Deck — Professional Persona Profile Cards

## Project Overview

Build a multi-tenant SaaS platform called **Identity Deck** that generates beautiful, interactive professional persona profile cards for any GitHub user. The system analyzes a user's GitHub starred repos, owned repos, and profile data to automatically generate a set of "career persona" trading cards — each representing a facet of their professional identity.

**Live reference implementation (React prototype):** The original prototype was built as a single-user React artifact. This prompt contains the complete data model, design system, algorithms, and architecture to rebuild it as a multi-tenant SaaS deployed entirely on Cloudflare's developer platform.

**Critical constraint: NO AI/LLM agents.** All persona detection, skill scoring, and categorization must be done through deterministic algorithms — topic matching, language analysis, repo metadata parsing, and star pattern clustering. No API calls to OpenAI, Anthropic, or any LLM service.

---

## Architecture Overview

### Cloudflare Products to Use

| Product | Purpose |
|---------|---------|
| **Workers** | API endpoints, GitHub data fetching, persona computation engine, SSR |
| **KV** | Cache GitHub API responses (stars, repos, profile) with TTL |
| **D1** | Persistent storage for generated user profiles, persona data, customizations |
| **R2** | Store generated OG images, exported card images (PNG/SVG) |
| **Workers Static Assets** | Serve the frontend (Astro/Svelte/Solid static build) |
| **Durable Objects** | Rate limiting per GitHub user, job deduplication for concurrent requests |
| **Queues** | Background processing for users with 1000+ stars (paginated fetching) |
| **Pages Functions** (optional) | If using Astro adapter for Cloudflare |

### System Flow

```
User visits /:username
  → Worker checks D1 for cached profile
  → If stale/missing:
    → Enqueue background job (Queue)
    → Worker fetches GitHub API (paginated):
      - GET /users/:username (profile)
      - GET /users/:username/repos?per_page=100 (owned repos, paginate)
      - GET /users/:username/starred?per_page=100 (stars, paginate up to 30 pages)
    → Cache raw responses in KV (TTL: 24h)
    → Run Persona Engine (deterministic algorithms)
    → Store computed profile in D1
    → Generate OG image → R2
  → Return rendered page with persona cards
```

---

## Data Model

### GitHub Raw Data (cached in KV)

```
KV key: github:profile:{username}     → GitHub user profile JSON
KV key: github:repos:{username}       → Array of owned repos
KV key: github:stars:{username}:{page} → Paginated star pages
KV key: github:stars:{username}:meta   → { totalPages, fetchedAt, complete }
```

### Computed Profile (stored in D1)

```sql
CREATE TABLE profiles (
  username TEXT PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  location TEXT,
  email TEXT,
  blog TEXT,
  company TEXT,
  avatar_url TEXT,
  followers INTEGER,
  following INTEGER,
  public_repos INTEGER,
  created_at TEXT,           -- GitHub account creation
  computed_at TEXT,           -- When we last ran the persona engine
  github_data_hash TEXT,     -- Hash of raw data to detect changes
  raw_profile JSON,          -- Full GitHub profile response
  UNIQUE(username)
);

CREATE TABLE personas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  persona_id TEXT NOT NULL,      -- e.g. "systems", "platform", "cloud"
  title TEXT NOT NULL,
  tagline TEXT,
  accent_color TEXT,
  icon TEXT,
  experience_label TEXT,         -- e.g. "25+ years", "Lifetime"
  years_active TEXT,             -- e.g. "2005 - Present"
  confidence REAL,               -- 0.0-1.0 how strong this persona is
  stats JSON,                    -- [[label, value], ...]
  stack JSON,                    -- [tech1, tech2, ...]
  details JSON,                  -- [detail1, detail2, ...]
  starred_repos JSON,            -- [repo1, repo2, ...] relevant stars
  employers JSON,                -- [employer1, ...] if provided
  links JSON,                    -- [{label, url}, ...]
  sort_order INTEGER,
  FOREIGN KEY (username) REFERENCES profiles(username),
  UNIQUE(username, persona_id)
);

CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  tech JSON,                     -- [tech1, tech2, ...]
  persona_map JSON,              -- [persona_id1, persona_id2, ...]
  language TEXT,
  stars INTEGER,
  forks INTEGER,
  sort_order INTEGER,
  FOREIGN KEY (username) REFERENCES profiles(username)
);

CREATE TABLE radar_axes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  label TEXT NOT NULL,
  value INTEGER NOT NULL,        -- 0-100
  color TEXT,
  sort_order INTEGER,
  FOREIGN KEY (username) REFERENCES profiles(username)
);

CREATE TABLE star_interests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  label TEXT NOT NULL,
  count TEXT,                    -- "15+ repos"
  examples TEXT,                 -- comma-separated repo names
  sort_order INTEGER,
  FOREIGN KEY (username) REFERENCES profiles(username)
);

CREATE TABLE customizations (
  username TEXT PRIMARY KEY,
  custom_taglines JSON,          -- {persona_id: "custom tagline"}
  custom_details JSON,           -- {persona_id: ["detail1", ...]}
  custom_employers JSON,         -- {persona_id: ["employer1", ...]}
  hidden_personas JSON,          -- ["persona_id1", ...]
  theme_overrides JSON,          -- {darkMode: true, ...}
  FOREIGN KEY (username) REFERENCES profiles(username)
);
```

---

## Persona Engine — The Core Algorithm

This is the heart of the system. It takes raw GitHub data and produces persona assignments with confidence scores. **No AI involved** — purely deterministic topic/language/metadata matching.

### Step 1: Build a Topic Vector from Stars

Each starred repo contributes signals via its `language`, `topics[]`, `description`, and repo name. Map these to a set of **domain buckets**.

#### Domain Bucket Definitions

```javascript
const DOMAIN_SIGNALS = {
  systems: {
    languages: ["C", "C++", "Rust", "Assembly", "Zig"],
    topics: ["kernel", "systems-programming", "embedded", "bare-metal", "systemd",
             "operating-system", "os", "hypervisor", "virtualization", "qemu",
             "kvm", "proxmox", "esxi", "zfs", "filesystem", "database",
             "postgresql", "performance", "profiling", "ebpf", "io-uring",
             "memory-management", "real-time", "driver", "firmware"],
    descriptionKeywords: ["kernel", "syscall", "bare metal", "hypervisor",
                          "low-level", "systems", "performance", "database",
                          "postgresql", "embedded", "firmware"],
  },
  platform: {
    languages: ["HCL", "Jsonnet", "Starlark", "Dhall"],
    topics: ["kubernetes", "k8s", "helm", "terraform", "ansible", "pulumi",
             "docker", "container", "ci-cd", "github-actions", "gitlab-ci",
             "jenkins", "argocd", "gitops", "infrastructure-as-code", "iac",
             "devops", "cdk", "cloudformation", "deployment", "pipeline",
             "buildpack", "nix", "nixos", "guix", "buildroot"],
    descriptionKeywords: ["deploy", "pipeline", "infrastructure", "orchestrat",
                          "ci/cd", "gitops", "provisioning", "automation",
                          "kubernetes", "helm", "terraform"],
  },
  software: {
    languages: ["TypeScript", "JavaScript", "Rust", "Go", "Python", "Ruby",
                "Java", "Kotlin", "Swift", "Scala", "Elixir", "Haskell",
                "OCaml", "F#", "Clojure"],
    topics: ["framework", "library", "sdk", "api", "web-framework", "orm",
             "testing", "compiler", "language", "parser", "ast", "wasm",
             "webassembly", "full-stack", "backend", "frontend", "react",
             "vue", "svelte", "solid", "angular", "nextjs", "nuxt", "astro",
             "bun", "deno", "node", "runtime"],
    descriptionKeywords: ["framework", "library", "compiler", "runtime",
                          "programming language", "web app", "full-stack",
                          "frontend", "backend", "api"],
  },
  cloud: {
    languages: [],
    topics: ["aws", "gcp", "azure", "cloudflare", "cloud", "serverless",
             "lambda", "edge", "cdn", "load-balancer", "vpn", "wireguard",
             "networking", "multi-cloud", "hybrid-cloud", "cloud-native",
             "saas", "paas", "iaas", "s3", "r2", "workers"],
    descriptionKeywords: ["cloud", "aws", "serverless", "edge", "cdn",
                          "distributed", "multi-cloud", "cloudflare",
                          "scalable", "load balanc", "vpn", "tunnel"],
  },
  linux: {
    languages: ["Shell", "Bash", "Nushell", "Fish", "Zsh", "Nix"],
    topics: ["linux", "unix", "shell", "bash", "zsh", "fish", "nushell",
             "terminal", "cli", "tui", "dotfiles", "rice", "ricing",
             "hyprland", "wayland", "sway", "i3", "window-manager", "wm",
             "desktop-environment", "gtk", "systemd", "arch", "debian",
             "ubuntu", "alpine", "nixos", "gentoo", "freebsd"],
    descriptionKeywords: ["linux", "terminal", "shell", "command-line", "cli",
                          "tui", "dotfiles", "window manager", "wayland",
                          "hyprland", "nushell", "systemd", "desktop"],
  },
  solutions: {
    languages: [],
    topics: ["documentation", "technical-writing", "api-design", "openapi",
             "json-schema", "graphql", "rest", "grpc", "protobuf",
             "architecture", "design-patterns", "microservices", "ddd",
             "event-driven", "cqrs", "consulting"],
    descriptionKeywords: ["documentation", "api design", "architecture",
                          "pattern", "microservice", "schema", "openapi",
                          "specification", "integration", "workflow"],
  },
  sre: {
    languages: [],
    topics: ["monitoring", "observability", "grafana", "prometheus", "alerting",
             "incident", "sre", "reliability", "uptime", "chaos-engineering",
             "load-testing", "benchmark", "tracing", "logging", "elk",
             "datadog", "newrelic", "pagerduty", "on-call", "runbook",
             "security", "vulnerability", "cve", "penetration-testing",
             "zero-trust", "authentication", "oauth", "sso"],
    descriptionKeywords: ["monitoring", "observability", "reliability",
                          "incident", "alert", "uptime", "chaos", "security",
                          "vulnerability", "penetration", "zero-trust",
                          "authentication"],
  },
  tinkerer: {
    languages: [],
    topics: ["side-project", "experiment", "prototype", "hack", "maker",
             "iot", "raspberry-pi", "arduino", "fpga", "3d-printing",
             "e-ink", "eink", "hardware", "robotics", "generative-art",
             "creative-coding", "procedural", "hobby", "weekend-project",
             "ai", "machine-learning", "llm", "gpt", "embeddings",
             "vector-database", "semantic-search", "ai-agent", "ai-coding",
             "stable-diffusion", "image-generation"],
    descriptionKeywords: ["experiment", "prototype", "toy", "hobby",
                          "weekend", "fun", "hack", "tinkering", "ai",
                          "llm", "embedding", "semantic", "machine learning",
                          "agent", "generative"],
  },
  hacker: {
    languages: ["Vim Script", "Lua", "Vimscript"],
    topics: ["neovim", "vim", "nvim", "editor", "ide", "terminal-emulator",
             "tmux", "zellij", "screen", "ghostty", "alacritty", "kitty",
             "wezterm", "helix", "kakoune", "emacs", "dotfiles",
             "command-line", "old-school", "retro", "vintage", "browser",
             "web-browser", "rss", "feed-reader", "bookmarks"],
    descriptionKeywords: ["neovim", "vim", "editor", "terminal", "browser",
                          "old school", "retro", "hacker", "rss", "feed",
                          "bookmark", "knowledge"],
  },
};
```

#### Scoring Algorithm

```javascript
function computeDomainScores(stars, ownedRepos) {
  const scores = {};
  for (const domain of Object.keys(DOMAIN_SIGNALS)) {
    scores[domain] = 0;
  }

  for (const repo of stars) {
    const lang = (repo.language || "").toLowerCase();
    const topics = (repo.topics || []).map(t => t.toLowerCase());
    const desc = (repo.description || "").toLowerCase();
    const name = (repo.full_name || "").toLowerCase();

    for (const [domain, signals] of Object.entries(DOMAIN_SIGNALS)) {
      let repoScore = 0;

      // Language match: +2 points
      if (signals.languages.some(l => l.toLowerCase() === lang)) {
        repoScore += 2;
      }

      // Topic match: +3 points per matching topic
      const topicMatches = topics.filter(t =>
        signals.topics.some(st => t.includes(st) || st.includes(t))
      ).length;
      repoScore += topicMatches * 3;

      // Description keyword match: +1.5 per keyword
      const descMatches = signals.descriptionKeywords.filter(kw =>
        desc.includes(kw)
      ).length;
      repoScore += descMatches * 1.5;

      // Repo name match: +1 per keyword
      const nameMatches = signals.descriptionKeywords.filter(kw =>
        name.includes(kw)
      ).length;
      repoScore += nameMatches * 1;

      scores[domain] += repoScore;
    }
  }

  // Owned repos get 3x weight
  for (const repo of ownedRepos) {
    const lang = (repo.language || "").toLowerCase();
    const topics = (repo.topics || []).map(t => t.toLowerCase());
    const desc = (repo.description || "").toLowerCase();

    for (const [domain, signals] of Object.entries(DOMAIN_SIGNALS)) {
      let repoScore = 0;
      if (signals.languages.some(l => l.toLowerCase() === lang)) repoScore += 2;
      const topicMatches = topics.filter(t =>
        signals.topics.some(st => t.includes(st) || st.includes(t))
      ).length;
      repoScore += topicMatches * 3;
      const descMatches = signals.descriptionKeywords.filter(kw =>
        desc.includes(kw)
      ).length;
      repoScore += descMatches * 1.5;

      scores[domain] += repoScore * 3; // 3x multiplier for owned repos
    }
  }

  return scores;
}
```

### Step 2: Normalize Scores to 0-100 Radar Values

```javascript
function normalizeToRadar(scores) {
  const values = Object.values(scores);
  const max = Math.max(...values);
  if (max === 0) return scores;

  const normalized = {};
  for (const [domain, score] of Object.entries(scores)) {
    // Scale to 40-100 range (minimum 40 if any signal detected)
    if (score > 0) {
      normalized[domain] = Math.round(40 + (score / max) * 60);
    } else {
      normalized[domain] = 0;
    }
  }
  return normalized;
}
```

### Step 3: Determine Active Personas

A persona is "active" if its normalized score exceeds a threshold (default: 45). Personas are ranked by confidence score.

```javascript
const PERSONA_THRESHOLD = 45;

function determinePersonas(normalizedScores) {
  return Object.entries(normalizedScores)
    .filter(([_, score]) => score >= PERSONA_THRESHOLD)
    .sort((a, b) => b[1] - a[1])
    .map(([domain, score], index) => ({
      persona_id: domain,
      confidence: score / 100,
      sort_order: index,
    }));
}
```

### Step 4: Cluster Stars into Interest Groups

Group starred repos by detected themes to create the "Star Interests" tiles.

```javascript
const INTEREST_CLUSTERS = {
  "Nushell Ecosystem": {
    match: (repo) => {
      const name = (repo.full_name || "").toLowerCase();
      const topics = (repo.topics || []).map(t => t.toLowerCase());
      const lang = (repo.language || "").toLowerCase();
      return name.includes("nushell") || name.includes(".nu") ||
             topics.includes("nushell") || lang === "nushell";
    }
  },
  "Neovim & Editor": {
    match: (repo) => {
      const n = (repo.full_name || "").toLowerCase();
      const t = (repo.topics || []).map(x => x.toLowerCase());
      return t.some(x => ["neovim", "nvim", "vim", "helix", "editor", "kakoune"].includes(x)) ||
             n.includes("nvim") || n.includes("neovim") || n.includes("helix");
    }
  },
  "React / Frontend": {
    match: (repo) => {
      const t = (repo.topics || []).map(x => x.toLowerCase());
      return t.some(x => ["react", "vue", "svelte", "solid", "frontend", "nextjs", "nuxt", "astro"].includes(x));
    }
  },
  "Rust Ecosystem": {
    match: (repo) => (repo.language || "").toLowerCase() === "rust"
  },
  "Security & Hacking": {
    match: (repo) => {
      const t = (repo.topics || []).map(x => x.toLowerCase());
      const d = (repo.description || "").toLowerCase();
      return t.some(x => ["security", "cve", "vulnerability", "penetration-testing",
                           "hacking", "exploit", "ctf", "cybersecurity"].includes(x)) ||
             d.includes("security") || d.includes("vulnerability") || d.includes("exploit");
    }
  },
  "AI & LLM": {
    match: (repo) => {
      const t = (repo.topics || []).map(x => x.toLowerCase());
      const d = (repo.description || "").toLowerCase();
      return t.some(x => ["ai", "llm", "machine-learning", "gpt", "embeddings",
                           "ai-agent", "openai", "anthropic"].includes(x)) ||
             d.includes("ai ") || d.includes("llm") || d.includes("machine learning");
    }
  },
  "DevOps & Infrastructure": {
    match: (repo) => {
      const t = (repo.topics || []).map(x => x.toLowerCase());
      return t.some(x => ["kubernetes", "docker", "terraform", "ansible", "devops",
                           "ci-cd", "infrastructure", "helm", "gitops"].includes(x));
    }
  },
  "CLI Tools": {
    match: (repo) => {
      const t = (repo.topics || []).map(x => x.toLowerCase());
      const d = (repo.description || "").toLowerCase();
      return t.some(x => ["cli", "command-line", "terminal", "tui"].includes(x)) ||
             d.includes("cli") || d.includes("command-line") || d.includes("terminal tool");
    }
  },
  "Desktop Apps": {
    match: (repo) => {
      const t = (repo.topics || []).map(x => x.toLowerCase());
      return t.some(x => ["tauri", "electron", "desktop", "gtk", "qt",
                           "cross-platform", "native-app"].includes(x));
    }
  },
  "Cloud & Edge": {
    match: (repo) => {
      const t = (repo.topics || []).map(x => x.toLowerCase());
      const d = (repo.description || "").toLowerCase();
      return t.some(x => ["cloudflare", "aws", "serverless", "edge", "workers",
                           "lambda", "vercel", "cloud"].includes(x)) ||
             d.includes("cloudflare") || d.includes("serverless") || d.includes("edge function");
    }
  },
  "Linux / Desktop": {
    match: (repo) => {
      const t = (repo.topics || []).map(x => x.toLowerCase());
      return t.some(x => ["linux", "wayland", "hyprland", "sway", "i3",
                           "window-manager", "desktop-environment", "systemd",
                           "dotfiles", "rice"].includes(x));
    }
  },
  "Static Sites & Blogs": {
    match: (repo) => {
      const t = (repo.topics || []).map(x => x.toLowerCase());
      const d = (repo.description || "").toLowerCase();
      return t.some(x => ["zola", "hugo", "jekyll", "static-site", "blog",
                           "astro", "ssg", "11ty"].includes(x)) ||
             d.includes("static site") || d.includes("blog theme");
    }
  },
};

function clusterStarInterests(stars) {
  const clusters = {};
  for (const [label, config] of Object.entries(INTEREST_CLUSTERS)) {
    const matching = stars.filter(config.match);
    if (matching.length >= 2) { // Only show clusters with 2+ repos
      clusters[label] = {
        count: matching.length >= 15 ? "15+ repos" :
               matching.length >= 10 ? "10+ repos" :
               matching.length >= 5 ? "5+ repos" :
               matching.length + " repos",
        examples: matching.slice(0, 5).map(r =>
          r.full_name.split("/")[1]
        ).join(", "),
        repos
