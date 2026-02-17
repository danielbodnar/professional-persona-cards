import { useState, useRef, useEffect } from "react";

const COLORS = {
  systems: "#4A90D9",
  platform: "#7C4DFF",
  software: "#00E676",
  cloud: "#40C4FF",
  linux: "#FFEB3B",
  solutions: "#FF9800",
  sre: "#FF5252",
  dad: "#F48FB1",
  tinkerer: "#FFD54F",
  hacker: "#00FF41",
};

const radarAxes = [
  { label: "Rust/Systems", value: 92, color: COLORS.systems },
  { label: "Platform/IaC", value: 96, color: COLORS.platform },
  { label: "TypeScript/JS", value: 95, color: COLORS.software },
  { label: "Cloud/Infra", value: 94, color: COLORS.cloud },
  { label: "Linux/Desktop", value: 99, color: COLORS.linux },
  { label: "Security", value: 85, color: COLORS.sre },
  { label: "AI/LLM", value: 88, color: COLORS.tinkerer },
  { label: "Neovim/Editor", value: 90, color: COLORS.hacker },
];

const starInterests = [
  { label: "Nushell Ecosystem", count: "15+ repos", examples: "reedline, nu-plugins, sessions.nu, topiary-nushell" },
  { label: "Neovim & Editor", count: "12+ repos", examples: "mini.nvim, lspsaga, neo-tree, dashboard-nvim, helix-themes" },
  { label: "Hyprland / Wayland", count: "10+ repos", examples: "hyprNStack, hyprpanel, ironbar, SwayNotificationCenter" },
  { label: "Rust CLI Tools", count: "20+ repos", examples: "ecdysis, zerobrew, envelope, keyless, resvg, monty" },
  { label: "Security & Hacking", count: "10+ repos", examples: "CVE-2024-1086, shannon, medusa, llm-security, purpleteam" },
  { label: "AI Agent Coding", count: "15+ repos", examples: "Claude Code, OpenCode, agent-skills, clother, beads" },
  { label: "Tauri Desktop Apps", count: "8+ repos", examples: "Takma, journalv, parchment, shuku, czkawka-tauri" },
  { label: "Zola & Static Sites", count: "6+ repos", examples: "tabi, goyo, isite, neovim-theme, readme-in-static-site" },
  { label: "Cloudflare Edge", count: "8+ repos", examples: "ecdysis, cloudflare-speed-cli, tauri-update-cloudflare" },
  { label: "RSS / Knowledge Mgmt", count: "6+ repos", examples: "gorss, feedpushr, awesome-rss-feeds, feedscout, bkmr" },
];

const personas = [
  {
    id: "systems", title: "Principal Systems Engineer",
    tagline: "I speak fluent syscall.",
    accent: COLORS.systems,
    bg: "linear-gradient(135deg, #0a1628 0%, #132744 100%)",
    icon: "\u2699\uFE0F", yearsActive: "1999 - Present", experience: "25+ years",
    stats: [["Architecture", 98], ["Debugging", 95], ["Scale", 92], ["Uptime", 97]],
    stack: ["Linux", "systemd", "PostgreSQL", "ZFS", "InfiniBand", "Kernel Tuning", "Bare Metal", "Proxmox"],
    details: [
      "3.5TB+ PostgreSQL cluster management & perf tuning",
      "Consolidated 30+ bare-metal servers onto ESXi at DIAB Inc.",
      "56G InfiniBand FC SAN on Proxmox/ZFS",
      "Kernel-level optimizations & embedded systems interest",
    ],
    employers: ["Fidelity", "Animal Care Tech", "DIAB Inc.", "TACC Support", "BitBuilder"],
    starred: ["Nushell reedline", "cloud-hypervisor", "ecdysis (graceful restarts)", "WireGuard-ESP32"],
    links: [{ label: "resume.bodnar.sh", url: "https://resume.bodnar.sh" }],
  },
  {
    id: "platform", title: "Staff Platform Engineer",
    tagline: "Your deploy pipeline is my canvas.",
    accent: COLORS.platform,
    bg: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)",
    icon: "\uD83D\uDD17", yearsActive: "2005 - Present", experience: "20+ years",
    stats: [["Pipelines", 96], ["Automation", 98], ["Tooling", 94], ["DX", 93]],
    stack: ["Kubernetes", "Helm", "Terraform", "Ansible", "GitLab CI/CD", "GitHub Actions", "AWS CDK", "Docker"],
    details: [
      "Built full AWS CDK platform at Fidelity Investments",
      "Rebuilt Jenkins Core - faster builds, reduced execution time",
      "GitOps blue-green deployments with self-hosted GitLab",
      "Multi-account AWS strategies for financial industry compliance",
    ],
    employers: ["Fidelity", "Animal Care Tech", "BitBuilder"],
    starred: ["anthropics/claude-plugins", "agent-skills", "opencode ecosystem", "compound-product"],
    links: [{ label: "cloudx.sh", url: "https://cloudx.sh" }],
  },
  {
    id: "software", title: "Staff Software Engineer",
    tagline: "Types are a love language.",
    accent: COLORS.software,
    bg: "linear-gradient(135deg, #0a1a0f 0%, #132e1a 100%)",
    icon: "\u03BB", yearsActive: "2000 - Present", experience: "25+ years",
    stats: [["Rust", 90], ["TypeScript", 95], ["Systems", 93], ["Unix Phil.", 99]],
    stack: ["Rust", "TypeScript", "Bun", "Node.js", "Vue/Nuxt", "Svelte", "SolidJS", "Go", "Nushell"],
    details: [
      "First website: February 2000, age 14",
      "bkmr: semantic search bookmark manager (Rust fork)",
      "AnthropicFS: FUSE filesystem for Claude API",
      "AT&T: migrated Rails/MySQL to Node.js/Angular/MongoDB",
    ],
    employers: ["AT&T", "Fidelity", "Perspectives.org", "BitBuilder"],
    starred: ["pydantic/monty (Rust)", "rue-language", "zerobrew", "envelope (Rust CLI)"],
    links: [{ label: "github.com/danielbodnar", url: "https://github.com/danielbodnar" }],
  },
  {
    id: "cloud", title: "Principal Cloud Architect",
    tagline: "The cloud is just someone else's bare metal.",
    accent: COLORS.cloud,
    bg: "linear-gradient(135deg, #071825 0%, #0d2b45 100%)",
    icon: "\u2601\uFE0F", yearsActive: "2008 - Present", experience: "17+ years",
    stats: [["Design", 97], ["Security", 94], ["Scale", 96], ["Vision", 95]],
    stack: ["AWS", "Cloudflare Workers", "EKS", "Multi-cloud", "VyOS", "cloud-hypervisor", "E2E Encryption"],
    details: [
      "Founded BitBuilder Cloud - vendor-agnostic hyper-converged SaaS",
      "Multi-cloud hybrid overlay on custom K8s + immutable Linux",
      "Containerized orgs with 1M+ global visitors/day",
      "AWS CDK + multi-account strategies at Fidelity",
    ],
    employers: ["BitBuilder Cloud LLC", "Fidelity"],
    starred: ["TrustTunnel (VPN)", "ecdysis", "cloudflare-speed-cli", "vultr-cli"],
    links: [{ label: "bitbuilder.cloud", url: "https://bitbuilder.cloud" }],
  },
  {
    id: "linux", title: "Crazy Linux Evangelist",
    tagline: "btw, I use Linux.",
    accent: COLORS.linux,
    bg: "linear-gradient(135deg, #1a1800 0%, #2e2a05 100%)",
    icon: "\uD83D\uDC27", yearsActive: "Forever", experience: "Lifetime",
    stats: [["Passion", 100], ["Nushell", 97], ["systemd", 99], ["Evangelism", 100]],
    stack: ["Nushell", "systemd", "Alpine", "Debian", "Arch", "WolfiOS", "Hyprland", "Zellij", "Helix"],
    details: [
      "Nushell devotee - sessions.nu, nu-lint, LSP work",
      "Hyprland + Wayland desktop: hyprNStack, ironbar, hyprpanel",
      "systemd generators, portable services, sysext, confext",
      "Stars: 15+ Nushell repos, 10+ Hyprland/Wayland repos",
    ],
    employers: ["Every employer, whether they knew it or not"],
    starred: ["nushell/reedline", "hyprNStack", "ironbar", "SwayNotificationCenter", "AeroSpace"],
    links: [{ label: "bodnar.sh", url: "https://bodnar.sh" }],
  },
  {
    id: "solutions", title: "Principal Solutions Engineer",
    tagline: "I translate between humans and machines.",
    accent: COLORS.solutions,
    bg: "linear-gradient(135deg, #1a1005 0%, #2e1f0a 100%)",
    icon: "\uD83C\uDF09", yearsActive: "2002 - Present", experience: "22+ years",
    stats: [["Communication", 96], ["Problem Solving", 98], ["Empathy", 94], ["Breadth", 97]],
    stack: ["OpenAPI", "JSON Schema", "REST", "CQRS", "Event-Driven", "Service Mesh", "Microservices"],
    details: [
      "Founded TACC Support - 5 employees, physical storefront, 7+ years",
      "AT&T: aggregated 12+ legacy sources into unified Order Status app",
      "Consulting: Neal & Neal Insurance, Maybach Systems, DIAB Inc.",
      "BitBuilder Cloud LLC - Founder & CIO",
    ],
    employers: ["TACC Support", "AT&T", "BitBuilder Cloud LLC"],
    starred: ["awesome-technical-writing", "alex (inclusive writing)", "json-resume", "git-quick-stats"],
    links: [{ label: "daniel.bodnar.sh", url: "https://daniel.bodnar.sh" }],
  },
  {
    id: "sre", title: "Principal SRE",
    tagline: "Sleep is for the well-monitored.",
    accent: COLORS.sre,
    bg: "linear-gradient(135deg, #1a0505 0%, #2e0f0f 100%)",
    icon: "\uD83D\uDCDF", yearsActive: "2006 - Present", experience: "19+ years",
    stats: [["Reliability", 97], ["Incident Mgmt", 96], ["Observability", 95], ["Automation", 98]],
    stack: ["Grafana", "Prometheus", "VictoriaMetrics", "Jaeger", "ELK", "Zabbix", "NetData", "WireGuard"],
    details: [
      "Mitigated 2 ransomware attacks in first month at ACT",
      "Org-wide zero-trust + WireGuard VPN + VLAN isolation",
      "Reduced page load 5s to 0.8s at Perspectives.org",
      "10x hosting capacity while cutting budget 50%",
    ],
    employers: ["Animal Care Tech", "Perspectives.org", "BitBuilder"],
    starred: ["CVE-2024-1086", "medusa (AI security)", "shannon (AI hacker)", "authentik"],
    links: [{ label: "resume.bodnar.sh", url: "https://resume.bodnar.sh" }],
  },
  {
    id: "dad", title: "Dad",
    tagline: "My most important production system.",
    accent: COLORS.dad,
    bg: "linear-gradient(135deg, #1a0f15 0%, #2e1a28 100%)",
    icon: "\uD83C\uDFE1", yearsActive: "Always", experience: "Priceless",
    stats: [["Love", 100], ["Patience", 88], ["Dad Jokes", 91], ["Pride", 100]],
    stack: ["Presence", "Patience", "Charlotte Mason", "Theater", "Cairn + Kindling"],
    details: [
      "Selah's biggest fan - front row at every show",
      "Married to Lauren (Cairn + Kindling, HelpMate.sh)",
      "Charlotte Mason homeschool household",
      "The one role with no rollback strategy",
    ],
    employers: ["Home"],
    starred: [],
    links: [],
  },
  {
    id: "tinkerer", title: "Chronic Tinkerer",
    tagline: "What if I just tried one more thing...",
    accent: COLORS.tinkerer,
    bg: "linear-gradient(135deg, #1a1508 0%, #2e2510 100%)",
    icon: "\uD83D\uDD27", yearsActive: "Since birth", experience: "Infinite",
    stats: [["Curiosity", 100], ["Side Projects", 99], ["Focus", 42], ["Ambition", 100]],
    stack: ["E-ink", "Semantic Search", "AI Workflows", "Embeddings", "FPGA", "Tauri", "Zola"],
    details: [
      "E-ink desk pad: app-aware cheat sheets via Linux focus events",
      "AI capability cataloging & composed workflows",
      "Stars: 8+ Tauri apps, 6+ Zola themes, RSS tooling",
      "Ti-Ne cognitive stack - insatiable curiosity engine",
    ],
    employers: ["Self-employed since always"],
    starred: ["stable-diffusion-webui", "auto-wallpaper", "KaTeX", "speedtyper.dev", "fluster"],
    links: [{ label: "github.com/danielbodnar", url: "https://github.com/danielbodnar" }],
  },
  {
    id: "hacker", title: "Old School Hacker",
    tagline: "First website: February 2000. Age 14.",
    accent: COLORS.hacker,
    bg: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)",
    icon: ">_", yearsActive: "2000 - \u221E", experience: "25+ years",
    stats: [["Grit", 99], ["Nostalgia", 88], ["Root Access", 100], ["Lore", 97]],
    stack: ["Bare Metal", "The Terminal", "Shell", "Neovim", "Ghostty", "Zellij", "Helix", "vim"],
    details: [
      "Pre-cloud, pre-container, pre-everything survivor",
      "YOLO + Arctic Code Vault Contributor on GitHub",
      "89 repos, 131 followers, 5k+ starred repos",
      "ghostty-web fork, neovim-theme, yazelix-sandbox",
    ],
    employers: ["The Internet (since dial-up)"],
    starred: ["ghostty-web", "mini.nvim", "helix-themes", "browserpod-meta", "helium browser"],
    links: [{ label: "github.com/danielbodnar", url: "https://github.com/danielbodnar" }],
  },
];

const projects = [
  {
    name: "ngfw.sh",
    desc: "Cloud-managed next-gen firewall & router admin on Cloudflare's Edge",
    url: "https://github.com/danielbodnar/ngfw.sh",
    tech: ["Rust", "TypeScript", "Astro", "systemd", "Cloudflare Workers", "OpenAPI/RPC"],
    personaMap: ["cloud", "systems", "platform", "software", "linux"],
  },
  {
    name: "BitBuilder Hypervisor",
    desc: "Git-based multi-tenant hypervisor via systemd generators, sysext, vmspawn, nspawn",
    url: "https://github.com/bitbuilder-io/bitbuilder-hypervisor",
    tech: ["systemd", "Shell", "Linux", "cloud-hypervisor", "VyOS", "nspawn/vmspawn"],
    personaMap: ["systems", "cloud", "linux", "sre"],
  },
  {
    name: "bbctl",
    desc: "BitBuilder Cloud CLI - infrastructure management in Rust",
    url: "https://github.com/bitbuilder-io/bbctl",
    tech: ["Rust", "CLI", "API"],
    personaMap: ["software", "cloud", "systems"],
  },
  {
    name: "cloudx.sh",
    desc: "Cloudflare developer platform scaffolding and tooling",
    url: "https://github.com/bitbuilder-io/cloudx.sh",
    tech: ["TypeScript", "Cloudflare Workers", "Bun"],
    personaMap: ["platform", "software", "cloud"],
  },
  {
    name: "bbos",
    desc: "BitBuilder OS - immutable Linux system template",
    url: "https://github.com/bitbuilder-io/bbos",
    tech: ["Shell", "Linux", "Buildroot", "systemd"],
    personaMap: ["systems", "linux", "hacker"],
  },
  {
    name: "bkmr",
    desc: "Unified CLI for bookmark, snippet & knowledge management with semantic search",
    url: "https://github.com/danielbodnar/bkmr",
    tech: ["Rust", "SQLite", "Embeddings", "CLI"],
    personaMap: ["software", "tinkerer", "hacker"],
  },
  {
    name: "AnthropicFS",
    desc: "FUSE filesystem interface for Anthropic AI SDK - interact with Claude via fs ops",
    url: "https://github.com/danielbodnar/AnthropicFS",
    tech: ["FUSE", "Linux", "Anthropic API"],
    personaMap: ["software", "linux", "tinkerer", "hacker"],
  },
  {
    name: "sessions.nu",
    desc: "Time tracking from shell history - Nushell module analyzing atuin/history",
    url: "https://github.com/danielbodnar/sessions.nu",
    tech: ["Nushell", "Shell", "atuin"],
    personaMap: ["linux", "software", "tinkerer"],
  },
  {
    name: "TrustTunnel",
    desc: "Modern, fast and obfuscated VPN protocol",
    url: "https://github.com/TrustTunnel/TrustTunnel",
    tech: ["Rust", "Networking", "VPN", "Encryption"],
    personaMap: ["systems", "sre", "hacker", "software"],
  },
  {
    name: "knowledge",
    desc: "Personal knowledge garden - auto-syncing and organizing chat-derived insights",
    url: "https://github.com/danielbodnar/knowledge",
    tech: ["Markdown", "Sync", "PKM"],
    personaMap: ["tinkerer", "solutions"],
  },
];

function RadarChart({ size }) {
  var cx = size / 2, cy = size / 2, r = size * 0.38;
  var n = radarAxes.length;
  var angleStep = (2 * Math.PI) / n;
  var offset = -Math.PI / 2;

  function point(i, val) {
    var a = offset + i * angleStep;
    var dist = (val / 100) * r;
    return [cx + dist * Math.cos(a), cy + dist * Math.sin(a)];
  }

  var gridLines = [25, 50, 75, 100].map(function(pct) {
    var pts = [];
    for (var i = 0; i < n; i++) { pts.push(point(i, pct)); }
    return pts.map(function(p) { return p[0] + "," + p[1]; }).join(" ");
  });

  var dataPoints = radarAxes.map(function(a, i) { return point(i, a.value); });
  var dataPath = dataPoints.map(function(p) { return p[0] + "," + p[1]; }).join(" ");

  return (
    <svg width={size} height={size} viewBox={"0 0 " + size + " " + size}>
      {gridLines.map(function(pts, gi) {
        return <polygon key={gi} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      {radarAxes.map(function(a, i) {
        var ep = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={ep[0]} y2={ep[1]} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
      })}
      <polygon points={dataPath} fill="rgba(100,200,255,0.12)" stroke="rgba(100,200,255,0.6)" strokeWidth="1.5" />
      {radarAxes.map(function(a, i) {
        var dp = dataPoints[i];
        var lp = point(i, 112);
        var anchor = "middle";
        if (lp[0] < cx - 10) anchor = "end";
        if (lp[0] > cx + 10) anchor = "start";
        return (
          <g key={i}>
            <circle cx={dp[0]} cy={dp[1]} r={3} fill={a.color} />
            <text x={lp[0]} y={lp[1]} textAnchor={anchor} dominantBaseline="middle"
              style={{ fontSize: 9, fill: a.color, fontFamily: "monospace" }}>
              {a.label}
            </text>
            <text x={dp[0]} y={dp[1] - 8} textAnchor="middle"
              style={{ fontSize: 8, fill: "#888", fontFamily: "monospace" }}>
              {a.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StatBar({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
      <span style={{ fontSize: 9, color: "#888", width: 72, textAlign: "right", fontFamily: "monospace", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: value + "%", height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 8, color: "#555", fontFamily: "monospace", width: 20 }}>{value}</span>
    </div>
  );
}

function PersonaCard({ p, index }) {
  var _s = useState(false), flipped = _s[0], setFlipped = _s[1];
  var isMonoIcon = p.icon === "\u03BB" || p.icon === ">_";
  return (
    <div style={{ perspective: 900, width: 340, height: 540, cursor: "pointer" }}
      onClick={function() { setFlipped(!flipped); }}>
      <div style={{
        width: "100%", height: "100%",
        transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Front */}
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          backfaceVisibility: "hidden", background: p.bg,
          borderRadius: 16, border: "1px solid " + p.accent + "33",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)", overflow: "hidden",
        }}>
          <div style={{ position: "relative", padding: "18px 20px", height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: p.accent + "15", border: "1px solid " + p.accent + "33",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isMonoIcon ? 15 : 20, fontFamily: isMonoIcon ? "monospace" : "inherit", color: p.accent,
              }}>{p.icon}</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 8, fontFamily: "monospace", color: p.accent, opacity: 0.5 }}>{"#" + String(index + 1).padStart(2, "0") + "/10"}</div>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: "#666", marginTop: 2 }}>{p.experience}</div>
              </div>
            </div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 3 }}>{p.title}</h2>
            <p style={{ margin: 0, fontSize: 10, color: p.accent, fontStyle: "italic", marginBottom: 10, opacity: 0.8, fontFamily: "monospace" }}>
              {'"' + p.tagline + '"'}
            </p>
            <div style={{ marginBottom: 8 }}>
              {p.stats.map(function(s) { return <StatBar key={s[0]} label={s[0]} value={s[1]} color={p.accent} />; })}
            </div>
            <div style={{ marginBottom: 8, lineHeight: 1.7 }}>
              {p.stack.map(function(t) {
                return <span key={t} style={{
                  display: "inline-block", fontSize: 8, fontFamily: "monospace",
                  padding: "1px 5px", borderRadius: 3, marginRight: 3, marginBottom: 2,
                  background: p.accent + "12", color: p.accent, border: "1px solid " + p.accent + "25",
                }}>{t}</span>;
              })}
            </div>
            {p.starred.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 8, color: "#555", fontFamily: "monospace", marginBottom: 3 }}>STARRED REPOS</div>
                <div style={{ fontSize: 9, color: "#777", lineHeight: 1.5 }}>
                  {p.starred.join(" \u2022 ")}
                </div>
              </div>
            )}
            <div style={{ flex: 1 }} />
            <div style={{ borderTop: "1px solid " + p.accent + "15", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 9, color: "#888", fontFamily: "monospace" }}>DANIEL BODNAR</div>
                <div style={{ fontSize: 7, color: "#555", fontFamily: "monospace" }}>daniel@bodnar.sh \u2022 Denton, TX</div>
              </div>
              <span style={{ fontSize: 7, color: p.accent, opacity: 0.5, fontFamily: "monospace" }}>{p.yearsActive}</span>
            </div>
          </div>
        </div>
        {/* Back */}
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          backfaceVisibility: "hidden", transform: "rotateY(180deg)",
          background: p.bg, borderRadius: 16, border: "1px solid " + p.accent + "33",
          boxShadow: "0 8px 32px " + p.accent + "22", overflow: "hidden",
        }}>
          <div style={{ position: "relative", padding: "22px 20px", height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
            <div style={{ fontSize: 10, color: p.accent, fontFamily: "monospace", marginBottom: 12, textTransform: "uppercase", letterSpacing: 2 }}>Field Notes</div>
            {p.details.map(function(d, i) {
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8,
                  padding: "7px 10px", background: p.accent + "08", borderRadius: 6, border: "1px solid " + p.accent + "12",
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: p.accent, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 11, color: "#ccc", lineHeight: 1.4 }}>{d}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 8, color: "#555", fontFamily: "monospace", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Employers</div>
              <div style={{ fontSize: 10, color: "#999", lineHeight: 1.5 }}>{p.employers.join(" \u2022 ")}</div>
            </div>
            {p.links.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {p.links.map(function(l) {
                  return <span key={l.label} style={{
                    display: "inline-block", fontSize: 9, fontFamily: "monospace",
                    color: p.accent, padding: "3px 8px", borderRadius: 4,
                    background: p.accent + "12", border: "1px solid " + p.accent + "25",
                  }}>{l.label} \u2192</span>;
                })}
              </div>
            )}
            <div style={{ marginTop: "auto", textAlign: "center" }}>
              <span style={{ fontSize: 9, color: "#444", fontFamily: "monospace" }}>tap to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ proj }) {
  var stripeColors = proj.personaMap.map(function(pid) { return COLORS[pid]; });
  var stripeH = 100 / stripeColors.length;
  var stripeGrad = stripeColors.map(function(c, i) {
    return c + " " + (i * stripeH) + "%, " + c + " " + ((i + 1) * stripeH) + "%";
  }).join(", ");

  return (
    <div style={{
      width: 340, borderRadius: 14, overflow: "hidden",
      background: "linear-gradient(135deg, #0d0d14 0%, #14141e 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)", display: "flex",
    }}>
      <div style={{ width: 6, flexShrink: 0, background: "linear-gradient(180deg, " + stripeGrad + ")" }} />
      <div style={{ flex: 1, padding: "16px 18px" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3, fontFamily: "monospace" }}>{proj.name}</h3>
        <p style={{ margin: 0, fontSize: 10, color: "#888", lineHeight: 1.4, marginBottom: 10 }}>{proj.desc}</p>
        <div style={{ marginBottom: 10, lineHeight: 1.7 }}>
          {proj.tech.map(function(t) {
            return <span key={t} style={{
              display: "inline-block", fontSize: 8, fontFamily: "monospace",
              padding: "1px 5px", borderRadius: 3, marginRight: 3, marginBottom: 2,
              background: "rgba(255,255,255,0.06)", color: "#aaa", border: "1px solid rgba(255,255,255,0.08)",
            }}>{t}</span>;
          })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {proj.personaMap.map(function(pid) {
            var p = personas.find(function(x) { return x.id === pid; });
            if (!p) return null;
            return (
              <div key={pid} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: COLORS[pid] }} />
                <span style={{ fontSize: 7, color: "#666", fontFamily: "monospace" }}>
                  {p.title.replace("Principal ", "").replace("Staff ", "").replace("Crazy ", "")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #08080c 0%, #0e0e14 50%, #08080c 100%)",
      padding: "48px 24px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#444", letterSpacing: 4, textTransform: "uppercase" }}>Identity Deck</div>
        <h1 style={{ margin: "8px 0 0", fontSize: 36, fontWeight: 200, color: "#fff", letterSpacing: "-0.03em" }}>Daniel Bodnar</h1>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#555", fontFamily: "monospace" }}>
          Platform Engineer &middot; Systems Architect &middot; SRE &middot; Linux Evangelist
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 10, color: "#444", fontFamily: "monospace" }}>
          daniel@bodnar.sh &middot; Denton, TX &middot; github.com/danielbodnar &middot; 89 repos &middot; 5k+ stars
        </p>
      </div>

      {/* Skill Radar */}
      <div style={{ display: "flex", justifyContent: "center", margin: "24px auto 8px" }}>
        <RadarChart size={320} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace" }}>SKILL RADAR &middot; derived from 5k+ starred repos</div>
      </div>

      {/* Star-derived Interests */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center",
        maxWidth: 760, margin: "0 auto 40px",
      }}>
        {starInterests.map(function(si) {
          return (
            <div key={si.label} style={{
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              width: 230,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: "#ccc", fontWeight: 600 }}>{si.label}</span>
                <span style={{ fontSize: 8, color: "#555", fontFamily: "monospace" }}>{si.count}</span>
              </div>
              <div style={{ fontSize: 8, color: "#666", fontFamily: "monospace", lineHeight: 1.4 }}>{si.examples}</div>
            </div>
          );
        })}
      </div>

      {/* Persona color legend */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5px 12px", maxWidth: 800, margin: "0 auto 32px" }}>
        {personas.map(function(p) {
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: p.accent }} />
              <span style={{ fontSize: 8, color: "#666", fontFamily: "monospace" }}>{p.title.replace("Principal ", "").replace("Staff ", "").replace("Crazy ", "")}</span>
            </div>
          );
        })}
      </div>

      {/* Persona Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center", maxWidth: 1120, margin: "0 auto 60px" }}>
        {personas.map(function(p, i) { return <PersonaCard key={p.id} p={p} index={i} />; })}
      </div>

      {/* Projects Section */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#444", letterSpacing: 4, textTransform: "uppercase" }}>Featured Projects</div>
        <h2 style={{ margin: "8px 0 0", fontSize: 24, fontWeight: 200, color: "#fff" }}>The Work</h2>
        <p style={{ margin: "4px 0 0", fontSize: 10, color: "#555", fontFamily: "monospace" }}>color-coded by persona affinity</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center", maxWidth: 1120, margin: "0 auto" }}>
        {projects.map(function(proj) { return <ProjectCard key={proj.name} proj={proj} />; })}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <span style={{ fontSize: 9, color: "#333", fontFamily: "monospace" }}>
          click cards to flip &middot; Arctic Code Vault Contributor &middot; YOLO badge holder &middot; Pair Extraordinaire x3
        </span>
      </div>
    </div>
  );
}
