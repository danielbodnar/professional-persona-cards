import { useState } from "react";

const C = {
  systems:"#4A90D9", platform:"#7C4DFF", software:"#00E676", cloud:"#40C4FF",
  linux:"#FFEB3B", solutions:"#FF9800", sre:"#FF5252", dad:"#F48FB1",
  tinkerer:"#FFD54F", hacker:"#00FF41",
};

function contrastText(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.45 ? "#0a0a0f" : "#f0f0f5";
}

const radarAxes = [
  { label:"Rust/Systems", value:92 },
  { label:"Platform/IaC", value:96 },
  { label:"TypeScript/JS", value:95 },
  { label:"Cloud/Infra", value:94 },
  { label:"Linux/Desktop", value:99 },
  { label:"Security", value:85 },
  { label:"AI/LLM", value:88 },
  { label:"Neovim/Editor", value:90 },
];

const personas = [
  { id:"systems", title:"Principal Systems Engineer", short:"Systems Engineer", tag:"I speak fluent syscall.", accent:C.systems,
    icon:"\u2699\uFE0F", yrs:"1999–Now", exp:"25+ yrs",
    stats:[["Architecture",98],["Debugging",95],["Scale",92],["Uptime",97]],
    stack:["Linux","systemd","PostgreSQL","ZFS","InfiniBand","Kernel Tuning","Bare Metal"],
    details:["3.5TB+ PostgreSQL cluster management & perf tuning","Consolidated 30+ bare-metal servers onto ESXi","56G InfiniBand FC SAN on Proxmox/ZFS","Kernel-level optimizations & embedded systems"],
    employers:["Fidelity","Animal Care Tech","TACC Support","BitBuilder"],
    links:[{label:"resume",url:"https://resume.bodnar.sh"}] },
  { id:"platform", title:"Staff Platform Engineer", short:"Platform Engineer", tag:"Your deploy pipeline is my canvas.", accent:C.platform,
    icon:"\uD83D\uDD17", yrs:"2005–Now", exp:"20+ yrs",
    stats:[["Pipelines",96],["Automation",98],["Tooling",94],["DX",93]],
    stack:["Kubernetes","Helm","Terraform","Ansible","GitLab CI/CD","GitHub Actions","AWS CDK"],
    details:["Built full AWS CDK platform at Fidelity Investments","Rebuilt Jenkins Core platform for build efficiency","GitOps pipelines with blue-green deployments","CNCF ecosystem native, IaC across multiple orgs"],
    employers:["Fidelity","Animal Care Tech","BitBuilder"],
    links:[{label:"cloudx.sh",url:"https://cloudx.sh"}] },
  { id:"software", title:"Staff Software Engineer", short:"Software Engineer", tag:"Types are a love language.", accent:C.software,
    icon:"\u03BB", yrs:"2000–Now", exp:"25+ yrs",
    stats:[["Rust",90],["TypeScript",95],["Systems",93],["Unix Phil.",99]],
    stack:["Rust","TypeScript","Bun","Node.js","Vue/Nuxt","Svelte","SolidJS","Nushell"],
    details:["First website: February 2000, age 14","bkmr: semantic search bookmark manager (Rust)","bitx: AI-powered CLI with Bun + TypeScript","AnthropicFS: FUSE filesystem for Claude API"],
    employers:["AT&T","Fidelity","Perspectives.org","BitBuilder"],
    links:[{label:"github",url:"https://github.com/danielbodnar"}] },
  { id:"cloud", title:"Principal Cloud Architect", short:"Cloud Architect", tag:"The cloud is just someone else's bare metal.", accent:C.cloud,
    icon:"\u2601\uFE0F", yrs:"2008–Now", exp:"17+ yrs",
    stats:[["Design",97],["Security",94],["Scale",96],["Vision",95]],
    stack:["AWS","Cloudflare","EKS","Multi-cloud","VyOS","cloud-hypervisor","E2E Encryption"],
    details:["Founded BitBuilder Cloud — vendor-agnostic SaaS","Multi-cloud hybrid overlay on custom K8s distro","AWS CDK + multi-account strategies at Fidelity","Containerized orgs with 1M+ global visitors/day"],
    employers:["BitBuilder Cloud LLC","Fidelity"],
    links:[{label:"bitbuilder.cloud",url:"https://bitbuilder.cloud"}] },
  { id:"linux", title:"Crazy Linux Evangelist", short:"Linux Evangelist", tag:"btw, I use Linux.", accent:C.linux,
    icon:"\uD83D\uDC27", yrs:"Forever", exp:"Lifetime",
    stats:[["Passion",100],["Nushell",97],["systemd",99],["Evangelism",100]],
    stack:["Nushell","systemd","Alpine","Debian","Arch","FreeBSD","WolfiOS","Buildroot"],
    details:["Nushell devotee (v0.108+), nu-lint & LSP","systemd generators, portable services, sysext, confext","vmspawn, nspawn, ngfw.sh — all systemd-native","Will convert you. It's not a question of if."],
    employers:["Every employer, whether they knew it or not"],
    links:[{label:"bodnar.sh",url:"https://bodnar.sh"}] },
  { id:"solutions", title:"Principal Solutions Engineer", short:"Solutions Engineer", tag:"I translate between humans and machines.", accent:C.solutions,
    icon:"\uD83C\uDF09", yrs:"2002–Now", exp:"22+ yrs",
    stats:[["Communication",96],["Problem Solving",98],["Empathy",94],["Breadth",97]],
    stack:["OpenAPI","JSON Schema","REST","Architecture Patterns","CQRS","Event-Driven"],
    details:["Founded TACC Support — storefront + 5 employees","Long-term consulting: Neal & Neal, Maybach Systems","AT&T: aggregated 12+ legacy sources into unified app","BitBuilder Cloud LLC — Founder & CIO"],
    employers:["TACC Support","AT&T","BitBuilder Cloud LLC"],
    links:[{label:"daniel.bodnar.sh",url:"https://daniel.bodnar.sh"}] },
  { id:"sre", title:"Principal SRE", short:"SRE", tag:"Sleep is for the well-monitored.", accent:C.sre,
    icon:"\uD83D\uDCDF", yrs:"2006–Now", exp:"19+ yrs",
    stats:[["Reliability",97],["Incident Mgmt",96],["Observability",95],["Automation",98]],
    stack:["Grafana","Prometheus","VictoriaMetrics","Jaeger","ELK","Zabbix","NetData"],
    details:["Mitigated 2 ransomware attacks in first month","Implemented org-wide zero-trust + WireGuard VPN","Comprehensive observability across every employer","Reduced page load 5s → 0.8s at Perspectives.org"],
    employers:["Animal Care Tech","Perspectives.org","BitBuilder"],
    links:[{label:"resume",url:"https://resume.bodnar.sh"}] },
  { id:"dad", title:"Dad", short:"Dad", tag:"My most important production system.", accent:C.dad,
    icon:"\uD83C\uDFE1", yrs:"Always", exp:"Priceless",
    stats:[["Love",100],["Patience",88],["Dad Jokes",91],["Pride",100]],
    stack:["Presence","Patience","Charlotte Mason","Theater Runs","Cairn + Kindling"],
    details:["Selah's biggest fan — theater show regular","Married to Lauren (Cairn + Kindling, HelpMate.sh)","Charlotte Mason household","The one role with no rollback strategy"],
    employers:["Home"], links:[] },
  { id:"tinkerer", title:"Chronic Tinkerer", short:"Tinkerer", tag:"What if I just tried one more thing...", accent:C.tinkerer,
    icon:"\uD83D\uDD27", yrs:"Since birth", exp:"Infinite",
    stats:[["Curiosity",100],["Side Projects",99],["Focus",42],["Ambition",100]],
    stack:["E-ink Displays","Semantic Search","AI Workflows","Embeddings","FPGA","Laser Mice"],
    details:["E-ink desk pad: app-aware cheat sheets via Linux focus","Researching transparent matte coatings for mouse tracking","AI capability cataloging & composed workflows","Ti-Ne cognitive stack — insatiable curiosity"],
    employers:["Self-employed since always"],
    links:[{label:"github",url:"https://github.com/danielbodnar"}] },
  { id:"hacker", title:"Old School Hacker", short:"Hacker", tag:"First website: February 2000. Age 14.", accent:C.hacker,
    icon:">_", yrs:"2000–∞", exp:"25+ yrs",
    stats:[["Grit",99],["Nostalgia",88],["Root Access",100],["Lore",97]],
    stack:["Bare Metal","The Terminal","Shell","vim","Breaking Things","Fixing Things"],
    details:["Came up pre-cloud, pre-container, pre-everything","YOLO + Arctic Code Vault Contributor on GitHub","89 repos, 131 followers, 5k+ starred repos","Learned by breaking things. Still does."],
    employers:["The Internet (since dial-up)"],
    links:[{label:"github",url:"https://github.com/danielbodnar"}] },
];

const projects = [
  { name:"ngfw.sh", desc:"Cloud-managed next-gen firewall & router admin on Cloudflare's Edge",
    tech:["Rust","TypeScript","Astro","systemd","CF Workers","OpenAPI"], pids:["cloud","systems","platform","software","linux"] },
  { name:"BitBuilder Hypervisor", desc:"Git-based multi-tenant hypervisor via systemd generators, sysext, vmspawn",
    tech:["systemd","Shell","Linux","cloud-hypervisor","VyOS"], pids:["systems","cloud","linux","sre"] },
  { name:"bbctl", desc:"BitBuilder Cloud CLI — infrastructure management in Rust",
    tech:["Rust","CLI","API"], pids:["software","cloud","systems"] },
  { name:"cloudx.sh", desc:"Cloudflare developer platform scaffolding and tooling",
    tech:["TypeScript","CF Workers","Bun"], pids:["platform","software","cloud"] },
  { name:"bbos", desc:"BitBuilder OS — immutable Linux system template",
    tech:["Shell","Linux","Buildroot","systemd"], pids:["systems","linux","hacker"] },
  { name:"bkmr", desc:"Unified CLI for bookmark & knowledge management with semantic search",
    tech:["Rust","SQLite","Embeddings","CLI"], pids:["software","tinkerer","hacker"] },
  { name:"AnthropicFS", desc:"FUSE filesystem interface for Anthropic AI SDK",
    tech:["FUSE","Linux","Anthropic API"], pids:["software","linux","tinkerer","hacker"] },
];

function Bar({ label, val, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3, marginBottom:1 }}>
      <span style={{ fontSize:7, color:"#777", width:56, textAlign:"right", fontFamily:"monospace", flexShrink:0 }}>{label}</span>
      <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
        <div style={{ width:val+"%", height:"100%", background:color, borderRadius:2 }} />
      </div>
      <span style={{ fontSize:6, color:"#444", fontFamily:"monospace", width:14 }}>{val}</span>
    </div>
  );
}

function Bdg({ t, color }) {
  return (
    <span style={{
      display:"inline-block", fontSize:6, fontFamily:"monospace",
      padding:"1px 3px", borderRadius:2, marginRight:2, marginBottom:1,
      background:color+"15", color, border:"1px solid "+color+"30",
    }}>{t}</span>
  );
}

function RadarChart({ size }) {
  const cx = size/2, cy = size/2, r = size * 0.36;
  const n = radarAxes.length;
  const step = (2*Math.PI)/n;
  const off = -Math.PI/2;
  const pt = (i,v) => {
    const a = off + i*step;
    const d = (v/100)*r;
    return [cx + d*Math.cos(a), cy + d*Math.sin(a)];
  };
  const grids = [25,50,75,100].map(pct => {
    const pts = [];
    for (let i=0;i<n;i++) pts.push(pt(i,pct));
    return pts.map(p => p[0]+","+p[1]).join(" ");
  });
  const data = radarAxes.map((a,i) => pt(i,a.value));
  const path = data.map(p => p[0]+","+p[1]).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {grids.map((pts,i) => <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />)}
      {radarAxes.map((a,i) => {
        const ep = pt(i,100);
        return <line key={i} x1={cx} y1={cy} x2={ep[0]} y2={ep[1]} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />;
      })}
      <polygon points={path} fill="rgba(100,200,255,0.1)" stroke="rgba(100,200,255,0.5)" strokeWidth="1" />
      {radarAxes.map((a,i) => {
        const dp = data[i];
        return <circle key={"d"+i} cx={dp[0]} cy={dp[1]} r={2} fill="rgba(100,200,255,0.8)" />;
      })}
      {radarAxes.map((a,i) => {
        const lp = pt(i,118);
        let anchor = "middle";
        if (lp[0] < cx - 10) anchor = "end";
        if (lp[0] > cx + 10) anchor = "start";
        let dy = "0.35em";
        if (lp[1] < cy - r*0.5) dy = "0.8em";
        if (lp[1] > cy + r*0.5) dy = "0em";
        return (
          <text key={"l"+i} x={lp[0]} y={lp[1]} textAnchor={anchor} dy={dy}
            style={{ fontSize:7, fontFamily:"monospace", fill:"#666" }}>
            {a.label}
          </text>
        );
      })}
      {radarAxes.map((a,i) => {
        const vp = pt(i,106);
        let anchor = "middle";
        if (vp[0] < cx - 10) anchor = "end";
        if (vp[0] > cx + 10) anchor = "start";
        return (
          <text key={"v"+i} x={vp[0]} y={vp[1]} textAnchor={anchor} dy="0.35em"
            style={{ fontSize:6, fontFamily:"monospace", fill:"rgba(100,200,255,0.6)" }}>
            {a.value}
          </text>
        );
      })}
    </svg>
  );
}

function Modal({ p, onClose }) {
  if (!p) return null;
  const isMono = p.icon === "\u03BB" || p.icon === ">_";
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:460, maxHeight:"90vh", overflowY:"auto",
        background:"linear-gradient(135deg, #0c0c14 0%, #14141e 100%)",
        borderRadius:16, border:"1px solid "+p.accent+"40",
        boxShadow:"0 8px 48px "+p.accent+"25",
      }}>
        <div style={{ padding:"22px 26px 14px", borderBottom:"1px solid "+p.accent+"15" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:8 }}>
            <div style={{
              width:44, height:44, borderRadius:10,
              background:p.accent+"15", border:"1px solid "+p.accent+"33",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:isMono?16:22, fontFamily:isMono?"monospace":"inherit", color:p.accent,
            }}>{p.icon}</div>
            <div>
              <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:"#fff" }}>{p.title}</h2>
              <p style={{ margin:"2px 0 0", fontSize:10, color:p.accent, fontStyle:"italic", fontFamily:"monospace", opacity:0.8 }}>"{p.tag}"</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, fontSize:9, fontFamily:"monospace", color:"#666" }}>
            <span>{p.exp}</span><span style={{color:"#333"}}>•</span><span>{p.yrs}</span>
          </div>
        </div>
        <div style={{ padding:"14px 26px" }}>
          <div style={{ fontSize:8, color:"#555", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>Stats</div>
          {p.stats.map(s => (
            <div key={s[0]} style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
              <span style={{ fontSize:9, color:"#888", width:70, textAlign:"right", fontFamily:"monospace", flexShrink:0 }}>{s[0]}</span>
              <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:s[1]+"%", height:"100%", background:p.accent, borderRadius:3 }} />
              </div>
              <span style={{ fontSize:8, color:"#555", fontFamily:"monospace", width:18 }}>{s[1]}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:"0 26px 14px" }}>
          <div style={{ fontSize:8, color:"#555", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:1.5, marginBottom:5 }}>Stack</div>
          <div style={{ lineHeight:1.7 }}>
            {p.stack.map(t => (
              <span key={t} style={{
                display:"inline-block", fontSize:9, fontFamily:"monospace",
                padding:"2px 5px", borderRadius:2, marginRight:3, marginBottom:2,
                background:p.accent+"15", color:p.accent, border:"1px solid "+p.accent+"30",
              }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ padding:"0 26px 14px" }}>
          <div style={{ fontSize:8, color:p.accent, fontFamily:"monospace", textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>Field Notes</div>
          {p.details.map((d,i) => (
            <div key={i} style={{
              display:"flex", alignItems:"flex-start", gap:8, marginBottom:5,
              padding:"5px 10px", background:p.accent+"08", borderRadius:5, border:"1px solid "+p.accent+"12",
            }}>
              <div style={{ width:3, height:3, borderRadius:"50%", background:p.accent, flexShrink:0, marginTop:5 }} />
              <span style={{ fontSize:11, color:"#ccc", lineHeight:1.4 }}>{d}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:"0 26px 14px" }}>
          <div style={{ fontSize:8, color:"#555", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>Employers</div>
          <div style={{ fontSize:11, color:"#aaa", lineHeight:1.5 }}>{p.employers.join(" • ")}</div>
        </div>
        {p.links.length > 0 && (
          <div style={{ padding:"0 26px 18px" }}>
            {p.links.map(l => (
              <span key={l.label} style={{
                display:"inline-block", fontSize:10, fontFamily:"monospace",
                color:p.accent, padding:"4px 10px", borderRadius:4,
                background:p.accent+"12", border:"1px solid "+p.accent+"25", cursor:"pointer",
              }}>{l.label} →</span>
            ))}
          </div>
        )}
        <div onClick={onClose} style={{
          padding:"10px 0", textAlign:"center", cursor:"pointer",
          borderTop:"1px solid "+p.accent+"15", background:p.accent+"06",
          borderRadius:"0 0 16px 16px", fontSize:10, fontFamily:"monospace", color:"#555",
        }}
          onMouseEnter={e => e.currentTarget.style.color = p.accent}
          onMouseLeave={e => e.currentTarget.style.color = "#555"}
        >✕ close</div>
      </div>
    </div>
  );
}

function ProjectModal({ proj, onClose }) {
  if (!proj) return null;
  const stripes = proj.pids.map(pid => C[pid]);
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:400, background:"linear-gradient(135deg, #0c0c14 0%, #14141e 100%)",
        borderRadius:16, border:"1px solid rgba(255,255,255,0.1)",
        boxShadow:"0 8px 48px rgba(0,0,0,0.6)", display:"flex", overflow:"hidden",
      }}>
        {/* Left stripe */}
        <div style={{ width:6, flexShrink:0, display:"flex", flexDirection:"column" }}>
          {stripes.map((c,i) => <div key={i} style={{ flex:1, background:c }} />)}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ padding:"18px 22px" }}>
            <h3 style={{ margin:0, fontSize:17, fontWeight:700, color:"#fff", fontFamily:"monospace" }}>{proj.name}</h3>
            <p style={{ margin:"6px 0 12px", fontSize:11, color:"#999", lineHeight:1.4 }}>{proj.desc}</p>
            <div style={{ fontSize:8, color:"#555", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:1.5, marginBottom:5 }}>Tech</div>
            <div style={{ lineHeight:1.8, marginBottom:12 }}>
              {proj.tech.map(t => (
                <span key={t} style={{
                  display:"inline-block", fontSize:9, fontFamily:"monospace",
                  padding:"2px 6px", borderRadius:3, marginRight:4, marginBottom:3,
                  background:"rgba(255,255,255,0.06)", color:"#aaa", border:"1px solid rgba(255,255,255,0.08)",
                }}>{t}</span>
              ))}
            </div>
            <div style={{ fontSize:8, color:"#555", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:1.5, marginBottom:5 }}>Persona Affinity</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {proj.pids.map(pid => {
                const pe = personas.find(p => p.id === pid);
                return pe ? (
                  <div key={pid} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:C[pid] }} />
                    <span style={{ fontSize:9, color:"#777", fontFamily:"monospace" }}>{pe.short}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <div onClick={onClose} style={{
            padding:"10px 0", textAlign:"center", cursor:"pointer",
            borderTop:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.02)",
            borderRadius:"0 0 16px 0", fontSize:10, fontFamily:"monospace", color:"#555",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}
          >✕ close</div>
        </div>
      </div>
    </div>
  );
}

function PersonaCard({ p, onModal }) {
  const [hov, setHov] = useState(false);
  const isMono = p.icon === "\u03BB" || p.icon === ">_";
  const txt = contrastText(p.accent);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ width:152, display:"flex", flexDirection:"column" }}
    >
      <div style={{
        flex:1,
        background:"linear-gradient(135deg, #0c0c14 0%, #111119 100%)",
        borderRadius:"8px 8px 0 0",
        border:"1px solid "+p.accent+(hov?"30":"15"),
        borderBottom:"none",
        boxShadow:"0 4px 10px rgba(0,0,0,0.6)",
        transition:"border-color 0.2s",
        overflow:"hidden",
      }}>
        <div style={{ height:2, background:p.accent, opacity:0.4 }} />
        <div style={{ padding:"7px 9px 8px" }}>
          <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:5 }}>
            <div style={{
              width:24, height:24, borderRadius:5, flexShrink:0,
              background:p.accent+"12", border:"1px solid "+p.accent+"25",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:isMono?9:13, fontFamily:isMono?"monospace":"inherit", color:p.accent,
            }}>{p.icon}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:8, fontWeight:700, color:"#ddd", lineHeight:1.2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.short}</div>
              <div style={{ fontSize:6, fontFamily:"monospace", color:"#555", marginTop:1 }}>{p.exp} · {p.yrs}</div>
            </div>
          </div>
          <p style={{ margin:"0 0 4px", fontSize:7, color:p.accent, fontStyle:"italic", fontFamily:"monospace", opacity:0.7, lineHeight:1.2 }}>"{p.tag}"</p>
          {p.stats.map(s => <Bar key={s[0]} label={s[0]} val={s[1]} color={p.accent} />)}
          <div style={{ marginTop:4, lineHeight:1.5 }}>
            {p.stack.map(t => <Bdg key={t} t={t} color={p.accent} />)}
          </div>
          <div style={{ marginTop:4 }}>
            {p.details.map((d,i) => (
              <div key={i} style={{ fontSize:7, color:"#888", lineHeight:1.3, marginBottom:2, paddingLeft:5, borderLeft:"2px solid "+p.accent+"25" }}>{d}</div>
            ))}
          </div>
          <div style={{ marginTop:4, fontSize:6, color:"#666", fontFamily:"monospace" }}>{p.employers.join(" • ")}</div>
        </div>
      </div>
      <div
        onClick={e => { e.stopPropagation(); onModal(); }}
        style={{
          width:"100%", padding:"5px 0",
          background:p.accent,
          borderRadius:"0 0 8px 8px",
          cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"filter 0.15s",
          filter: hov ? "brightness(1.1)" : "brightness(0.85)",
        }}
        onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
        onMouseLeave={e => e.currentTarget.style.filter = hov ? "brightness(1.1)" : "brightness(0.85)"}
      >
        <span style={{ fontSize:8, fontFamily:"monospace", fontWeight:700, color:txt, letterSpacing:1 }}>
          ↗ open details ↙
        </span>
      </div>
    </div>
  );
}

function ProjCard({ proj, onModal }) {
  const [hov, setHov] = useState(false);
  const stripes = proj.pids.map(pid => C[pid]);
  const mainColor = stripes[0] || "#888";
  const txt = contrastText(mainColor);
  const stripeH = 100/stripes.length;
  const stripeGrad = stripes.map((c,i) => c+" "+(i*stripeH)+"%, "+c+" "+((i+1)*stripeH)+"%").join(", ");

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ width:152, display:"flex", flexDirection:"column" }}
    >
      <div style={{
        flex:1, display:"flex", overflow:"hidden",
        background:"linear-gradient(135deg, #0c0c14 0%, #111119 100%)",
        borderRadius:"8px 8px 0 0",
        border:"1px solid rgba(255,255,255,"+(hov?"0.10":"0.05")+")",
        borderBottom:"none",
        boxShadow:"0 4px 10px rgba(0,0,0,0.6)",
        transition:"border-color 0.2s",
      }}>
        {/* Left color stripe */}
        <div style={{
          width:5, flexShrink:0,
          background:"linear-gradient(180deg, "+stripeGrad+")",
        }} />
        <div style={{ flex:1, padding:"6px 8px 8px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#ddd", fontFamily:"monospace", lineHeight:1.2, marginBottom:3 }}>{proj.name}</div>
          <p style={{ margin:"0 0 4px", fontSize:7, color:"#888", lineHeight:1.3 }}>{proj.desc}</p>
          <div style={{ lineHeight:1.5 }}>
            {proj.tech.map(t => (
              <span key={t} style={{
                display:"inline-block", fontSize:6, fontFamily:"monospace",
                padding:"1px 3px", borderRadius:2, marginRight:2, marginBottom:1,
                background:"rgba(255,255,255,0.06)", color:"#aaa", border:"1px solid rgba(255,255,255,0.08)",
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Gradient multi-color button */}
      <div
        onClick={e => { e.stopPropagation(); onModal(); }}
        style={{
          width:"100%", padding:"5px 0",
          background: stripes.length > 1
            ? `linear-gradient(90deg, ${stripes.join(", ")})`
            : mainColor,
          borderRadius:"0 0 8px 8px",
          cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"filter 0.15s",
          filter: hov ? "brightness(1.1)" : "brightness(0.85)",
        }}
        onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
        onMouseLeave={e => e.currentTarget.style.filter = hov ? "brightness(1.1)" : "brightness(0.85)"}
      >
        <span style={{
          fontSize:8, fontFamily:"monospace", fontWeight:700,
          color:"#0a0a0f", letterSpacing:1,
          textShadow:"0 0 3px rgba(255,255,255,0.2)",
        }}>↗ open details ↙</span>
      </div>
    </div>
  );
}

export default function App() {
  const [modalP, setModalP] = useState(null);
  const [modalPr, setModalPr] = useState(null);

  return (
    <div style={{
      minHeight:"100vh", background:"#08080c",
      padding:"10px 14px 8px", boxSizing:"border-box",
      display:"flex", flexDirection:"column",
    }}>
      {/* Header + Radar side by side */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:6 }}>
        <div style={{ textAlign:"right" }}>
          <h1 style={{ margin:0, fontSize:18, fontWeight:200, color:"#fff", letterSpacing:"-0.02em" }}>Daniel Bodnar</h1>
          <p style={{ margin:"2px 0 0", fontSize:7, color:"#444", fontFamily:"monospace" }}>
            daniel@bodnar.sh · Denton, TX
          </p>
          <p style={{ margin:"1px 0 0", fontSize:7, color:"#444", fontFamily:"monospace" }}>
            Platform · Systems · SRE · Linux
          </p>
          <p style={{ margin:"3px 0 0", fontSize:6, color:"#333", fontFamily:"monospace" }}>
            SKILL RADAR · derived from 5k+ starred repos
          </p>
        </div>
        <RadarChart size={140} />
      </div>

      {/* Color legend */}
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"2px 8px", marginBottom:6 }}>
        {personas.map(p => (
          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:3 }}>
            <div style={{ width:6, height:6, borderRadius:1, background:p.accent }} />
            <span style={{ fontSize:6, color:"#555", fontFamily:"monospace" }}>{p.short}</span>
          </div>
        ))}
      </div>

      {/* Persona Grid */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:8, alignItems:"stretch" }}>
        {personas.map(p => (
          <PersonaCard key={p.id} p={p} onModal={() => setModalP(p)} />
        ))}
      </div>

      <div style={{ textAlign:"center", marginBottom:4 }}>
        <span style={{ fontSize:7, fontFamily:"monospace", color:"#333", letterSpacing:3, textTransform:"uppercase" }}>Featured Projects</span>
      </div>

      {/* Projects Grid */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:6, alignItems:"stretch" }}>
        {projects.map(proj => (
          <ProjCard key={proj.name} proj={proj} onModal={() => setModalPr(proj)} />
        ))}
      </div>

      <div style={{ textAlign:"center", marginTop:"auto" }}>
        <span style={{ fontSize:6, color:"#2a2a2a", fontFamily:"monospace" }}>open for full view · 89 repos · Arctic Code Vault Contributor</span>
      </div>

      <Modal p={modalP} onClose={() => setModalP(null)} />
      <ProjectModal proj={modalPr} onClose={() => setModalPr(null)} />
    </div>
  );
}
