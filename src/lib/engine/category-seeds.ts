/**
 * ~200 data-driven category definitions across 20 groups.
 * Replaces the hardcoded 9-domain DOMAIN_SIGNALS + PERSONA_TEMPLATES.
 * Each category carries its own scoring signals and display metadata.
 */

export interface Category {
  id: string;
  title: string;
  groupName: string;
  icon: string;
  accentColor: string;
  languages: string[];
  topics: string[];
  keywords: string[];
  statLabels: string[];
  stackPool: string[];
  taglines: string[];
  titlePrefixes: string[];
}

/** Shorthand factory — fills defaults so each seed stays compact. */
function c(
  id: string,
  title: string,
  groupName: string,
  icon: string,
  accentColor: string,
  o: Partial<Pick<Category, "languages" | "topics" | "keywords" | "statLabels" | "stackPool" | "taglines" | "titlePrefixes">>,
): Category {
  return {
    id,
    title,
    groupName,
    icon,
    accentColor,
    languages: o.languages ?? [],
    topics: o.topics ?? [],
    keywords: o.keywords ?? [],
    statLabels: o.statLabels ?? ["Skill", "Depth", "Breadth", "Activity"],
    stackPool: o.stackPool ?? [],
    taglines: o.taglines ?? [`${title} enthusiast.`, `Living and breathing ${title.toLowerCase()}.`, `${title} is my jam.`],
    titlePrefixes: o.titlePrefixes ?? ["Principal", "Staff", "Senior"],
  };
}

// ---------------------------------------------------------------------------
// LANGUAGE group (30)
// ---------------------------------------------------------------------------

const LANGUAGES: Category[] = [
  c("rust", "Rustacean", "language", "\u{1F980}", "#FF6B35", {
    languages: ["Rust"],
    topics: ["rust", "rustlang", "cargo", "crates", "tokio", "async-rust", "rust-lang"],
    keywords: ["rust", "cargo", "crate", "tokio", "async rust"],
    statLabels: ["Safety", "Performance", "Async", "Ecosystem"],
    stackPool: ["Rust", "Cargo", "Tokio", "Serde", "Axum", "Wasm"],
    taglines: ["Fearless concurrency is my love language.", "Zero-cost abstractions, maximum joy.", "The borrow checker is my co-pilot."],
  }),
  c("typescript", "TypeScript Dev", "language", "\u{1F4D8}", "#3178C6", {
    languages: ["TypeScript"],
    topics: ["typescript", "ts", "type-safety", "typing", "tsc"],
    keywords: ["typescript", "type-safe", "strongly typed"],
    statLabels: ["Types", "Tooling", "DX", "Ecosystem"],
    stackPool: ["TypeScript", "Zod", "tsc", "ESLint", "Bun", "Deno"],
    taglines: ["Types are a love language.", "any is a code smell.", "I make JavaScript bearable."],
  }),
  c("javascript", "JavaScript Dev", "language", "\u{1F7E1}", "#F7DF1E", {
    languages: ["JavaScript"],
    topics: ["javascript", "js", "ecmascript", "es6", "nodejs", "esm"],
    keywords: ["javascript", "node.js", "ecmascript"],
    statLabels: ["Frontend", "Backend", "Ecosystem", "Versatility"],
    stackPool: ["JavaScript", "Node.js", "ESM", "V8", "Bun"],
    taglines: ["Everything is an object. Including my patience.", "The language of the web.", "undefined is not a function, but I am."],
  }),
  c("go", "Gopher", "language", "\u{1F439}", "#00ADD8", {
    languages: ["Go"],
    topics: ["golang", "go", "goroutines", "go-modules"],
    keywords: ["golang", "goroutine", "go module"],
    statLabels: ["Simplicity", "Concurrency", "Performance", "DevOps"],
    stackPool: ["Go", "Goroutines", "Channels", "Gin", "Echo"],
    taglines: ["if err != nil { handle it }.", "Simplicity is the ultimate sophistication.", "Less is exponentially more."],
  }),
  c("python", "Pythonista", "language", "\u{1F40D}", "#3776AB", {
    languages: ["Python"],
    topics: ["python", "python3", "pip", "django", "flask", "fastapi"],
    keywords: ["python", "django", "flask", "pip"],
    statLabels: ["Data", "ML", "Scripting", "Ecosystem"],
    stackPool: ["Python", "pip", "Django", "FastAPI", "NumPy"],
    taglines: ["import antigravity.", "Life is short, use Python.", "Explicit is better than implicit."],
  }),
  c("c-lang", "C Programmer", "language", "\u{2699}\u{FE0F}", "#A8B9CC", {
    languages: ["C"],
    topics: ["c", "c-programming", "ansi-c", "posix"],
    keywords: ["written in c", "c programming", "posix"],
    statLabels: ["Low-level", "Performance", "Portability", "Legacy"],
    stackPool: ["C", "GCC", "Make", "POSIX", "glibc"],
    taglines: ["malloc or die.", "Pointers are my friends.", "Close to the metal since K&R."],
  }),
  c("cpp", "C++ Developer", "language", "\u{1F9EE}", "#00599C", {
    languages: ["C++"],
    topics: ["cpp", "c-plus-plus", "cplusplus", "stl", "modern-cpp"],
    keywords: ["c++", "cpp", "modern c++", "stl"],
    statLabels: ["Performance", "Templates", "OOP", "Systems"],
    stackPool: ["C++", "STL", "CMake", "Boost", "LLVM"],
    taglines: ["Template metaprogramming is my cardio.", "C++ is my first language. And my last.", "Zero overhead, infinite complexity."],
  }),
  c("java", "Java Developer", "language", "\u{2615}", "#ED8B00", {
    languages: ["Java"],
    topics: ["java", "jvm", "spring", "maven", "gradle"],
    keywords: ["java", "jvm", "spring", "maven"],
    statLabels: ["Enterprise", "JVM", "Ecosystem", "Stability"],
    stackPool: ["Java", "Spring", "Maven", "Gradle", "JVM"],
    taglines: ["Write once, run anywhere.", "Enterprise-grade everything.", "AbstractSingletonProxyFactoryBean."],
  }),
  c("kotlin", "Kotlin Dev", "language", "\u{1F48E}", "#7F52FF", {
    languages: ["Kotlin"],
    topics: ["kotlin", "kotlinx", "ktor", "jetpack-compose"],
    keywords: ["kotlin", "ktor", "jetpack"],
    statLabels: ["Conciseness", "Safety", "Android", "Multiplatform"],
    stackPool: ["Kotlin", "Ktor", "Coroutines", "Jetpack Compose"],
    taglines: ["Java, but better.", "Null safety is non-negotiable.", "Concise, safe, interoperable."],
  }),
  c("swift", "Swift Dev", "language", "\u{1F426}", "#F05138", {
    languages: ["Swift"],
    topics: ["swift", "swiftui", "ios", "macos", "apple"],
    keywords: ["swift", "swiftui", "ios", "apple"],
    statLabels: ["iOS", "macOS", "Safety", "Performance"],
    stackPool: ["Swift", "SwiftUI", "Xcode", "UIKit", "Combine"],
    taglines: ["Protocol-oriented by nature.", "guard let sanity else { return }.", "Swift and steady wins the race."],
  }),
  c("ruby", "Rubyist", "language", "\u{1F48E}", "#CC342D", {
    languages: ["Ruby"],
    topics: ["ruby", "rails", "ruby-on-rails", "rubygems"],
    keywords: ["ruby", "rails", "rubygems"],
    statLabels: ["Elegance", "DX", "Web", "Metaprogramming"],
    stackPool: ["Ruby", "Rails", "Bundler", "RSpec", "Sinatra"],
    taglines: ["Matz is nice so we are nice.", "Convention over configuration.", "Programmer happiness first."],
  }),
  c("elixir", "Alchemist", "language", "\u{1F52E}", "#4B275F", {
    languages: ["Elixir"],
    topics: ["elixir", "phoenix", "erlang", "beam", "otp", "livebook"],
    keywords: ["elixir", "phoenix", "erlang", "beam"],
    statLabels: ["Concurrency", "Fault Tolerance", "FP", "Real-time"],
    stackPool: ["Elixir", "Phoenix", "OTP", "BEAM", "LiveView"],
    taglines: ["Let it crash.", "Fault tolerance is a feature.", "Built on the shoulders of Erlang."],
  }),
  c("haskell", "Haskeller", "language", "\u{03BB}", "#5D4F85", {
    languages: ["Haskell"],
    topics: ["haskell", "functional-programming", "ghc", "cabal", "stack-haskell"],
    keywords: ["haskell", "monad", "purely functional"],
    statLabels: ["Purity", "Types", "Theory", "Abstraction"],
    stackPool: ["Haskell", "GHC", "Cabal", "Stack", "Monads"],
    taglines: ["A monad is just a monoid in the category of endofunctors.", "Purely functional, purely happy.", "Lazy evaluation, eager learning."],
  }),
  c("zig", "Zig Programmer", "language", "\u{26A1}", "#F7A41D", {
    languages: ["Zig"],
    topics: ["zig", "ziglang", "comptime"],
    keywords: ["zig", "comptime"],
    statLabels: ["Simplicity", "Performance", "Safety", "Comptime"],
    stackPool: ["Zig", "Comptime", "LLVM", "C Interop"],
    taglines: ["No hidden allocations.", "Comptime is the ultimate power.", "Simple, but not easy."],
  }),
  c("nushell", "Nushell User", "language", "\u{1F41A}", "#3AA675", {
    languages: ["Nushell", "Nu"],
    topics: ["nushell", "nu", "shell-scripting", "structured-data"],
    keywords: ["nushell", "structured shell", "nu script"],
    statLabels: ["Shell", "Data", "Pipelines", "Scripting"],
    stackPool: ["Nushell", "Pipelines", "Plugins", "Polars"],
    taglines: ["Structured data, structured life.", "Pipelines are my love language.", "Everything is a table."],
  }),
  c("lua", "Lua Scripter", "language", "\u{1F319}", "#000080", {
    languages: ["Lua"],
    topics: ["lua", "luajit", "neovim-lua", "love2d"],
    keywords: ["lua", "luajit", "neovim config"],
    statLabels: ["Embedding", "Scripting", "Speed", "Simplicity"],
    stackPool: ["Lua", "LuaJIT", "LOVE2D", "Neovim"],
    taglines: ["Small but mighty.", "The embeddable language.", "Tables all the way down."],
  }),
  c("shell", "Shell Scripter", "language", "\u{1F41A}", "#89E051", {
    languages: ["Shell", "Bash", "Zsh", "Fish"],
    topics: ["bash", "shell", "zsh", "fish", "shell-script", "posix-shell"],
    keywords: ["bash", "shell script", "command line"],
    statLabels: ["Automation", "Scripting", "Unix", "Glue"],
    stackPool: ["Bash", "Zsh", "Fish", "POSIX sh", "awk", "sed"],
    taglines: ["#!/bin/bash is my hello world.", "Pipe dreams come true.", "Everything is a file descriptor."],
  }),
  c("scala", "Scala Dev", "language", "\u{1F534}", "#DC322F", {
    languages: ["Scala"],
    topics: ["scala", "akka", "spark", "play-framework", "sbt"],
    keywords: ["scala", "akka", "spark", "sbt"],
    statLabels: ["FP", "JVM", "Big Data", "Concurrency"],
    stackPool: ["Scala", "Akka", "Spark", "SBT", "Cats"],
  }),
  c("clojure", "Clojurist", "language", "\u{1F7E2}", "#5881D8", {
    languages: ["Clojure", "ClojureScript"],
    topics: ["clojure", "clojurescript", "lisp", "repl"],
    keywords: ["clojure", "lisp", "repl-driven"],
    statLabels: ["FP", "Lisp", "Immutability", "REPL"],
    stackPool: ["Clojure", "Leiningen", "Ring", "Reagent"],
  }),
  c("ocaml", "OCaml Dev", "language", "\u{1F42B}", "#EC6813", {
    languages: ["OCaml"],
    topics: ["ocaml", "reason", "bucklescript", "opam"],
    keywords: ["ocaml", "opam", "reason"],
    statLabels: ["Types", "FP", "Compilers", "Safety"],
    stackPool: ["OCaml", "Opam", "Dune", "Jane Street"],
  }),
  c("dart", "Dart Dev", "language", "\u{1F3AF}", "#0175C2", {
    languages: ["Dart"],
    topics: ["dart", "flutter", "dartlang"],
    keywords: ["dart", "flutter"],
    statLabels: ["Mobile", "Cross-platform", "UI", "Performance"],
    stackPool: ["Dart", "Flutter", "pub.dev"],
  }),
  c("r-lang", "R Programmer", "language", "\u{1F4CA}", "#276DC3", {
    languages: ["R"],
    topics: ["r", "rstats", "tidyverse", "ggplot2", "shiny"],
    keywords: ["rstats", "tidyverse", "ggplot"],
    statLabels: ["Statistics", "Visualization", "Data", "Research"],
    stackPool: ["R", "Tidyverse", "ggplot2", "Shiny", "RStudio"],
  }),
  c("julia", "Julia Dev", "language", "\u{1F4A0}", "#9558B2", {
    languages: ["Julia"],
    topics: ["julia", "julialang", "scientific-computing"],
    keywords: ["julia", "scientific computing"],
    statLabels: ["Science", "Performance", "Numerics", "ML"],
    stackPool: ["Julia", "Flux.jl", "DifferentialEquations.jl"],
  }),
  c("perl", "Perl Hacker", "language", "\u{1F42A}", "#39457E", {
    languages: ["Perl"],
    topics: ["perl", "cpan", "regex"],
    keywords: ["perl", "cpan", "regex"],
    statLabels: ["Text", "Regex", "Sysadmin", "Legacy"],
    stackPool: ["Perl", "CPAN", "Regex", "CGI"],
  }),
  c("nim", "Nim Dev", "language", "\u{1F451}", "#FFE953", {
    languages: ["Nim"],
    topics: ["nim", "nimlang"],
    keywords: ["nim", "nimlang"],
    statLabels: ["Metaprogramming", "Performance", "Elegance", "Compiling"],
    stackPool: ["Nim", "Nimble", "Macros"],
  }),
  c("crystal", "Crystal Dev", "language", "\u{1FA76}", "#000100", {
    languages: ["Crystal"],
    topics: ["crystal", "crystal-lang"],
    keywords: ["crystal lang"],
    statLabels: ["Speed", "Ruby-like", "Types", "Concurrency"],
    stackPool: ["Crystal", "Shards", "Lucky"],
  }),
  c("vlang", "V Dev", "language", "\u{1F170}\u{FE0F}", "#5D87BF", {
    languages: ["V"],
    topics: ["vlang", "v-language"],
    keywords: ["vlang"],
    statLabels: ["Simplicity", "Speed", "C Interop", "Compiling"],
    stackPool: ["V", "vpm"],
  }),
  c("gleam", "Gleam Dev", "language", "\u{2728}", "#FFAFF3", {
    languages: ["Gleam"],
    topics: ["gleam", "gleamlang", "beam"],
    keywords: ["gleam"],
    statLabels: ["Types", "BEAM", "FP", "Safety"],
    stackPool: ["Gleam", "BEAM", "OTP", "Hex"],
    taglines: ["Type-safe on the BEAM.", "Gleaming with joy.", "Friendly and type-safe."],
  }),
  c("fsharp", "F# Dev", "language", "\u{1F535}", "#B845FC", {
    languages: ["F#"],
    topics: ["fsharp", "dotnet", "functional-dotnet"],
    keywords: ["f#", "fsharp", ".net functional"],
    statLabels: ["FP", ".NET", "Types", "Scripting"],
    stackPool: ["F#", ".NET", "Fable", "SAFE Stack"],
  }),
];

// ---------------------------------------------------------------------------
// FRAMEWORK group (25)
// ---------------------------------------------------------------------------

const FRAMEWORKS: Category[] = [
  c("react", "React Dev", "framework", "\u{269B}\u{FE0F}", "#61DAFB", {
    topics: ["react", "reactjs", "react-native", "jsx", "hooks"],
    keywords: ["react", "reactjs", "jsx", "hooks"],
    stackPool: ["React", "Next.js", "Redux", "React Native"],
  }),
  c("vue", "Vue Dev", "framework", "\u{1F49A}", "#42B883", {
    topics: ["vue", "vuejs", "nuxt", "vue3", "vuetify", "pinia"],
    keywords: ["vue", "vuejs", "nuxt"],
    stackPool: ["Vue 3", "Nuxt", "Pinia", "Vuetify"],
  }),
  c("svelte", "Svelte Dev", "framework", "\u{1F525}", "#FF3E00", {
    topics: ["svelte", "sveltekit", "svelte-kit"],
    keywords: ["svelte", "sveltekit"],
    stackPool: ["Svelte", "SvelteKit", "Svelte 5"],
  }),
  c("astro", "Astro Dev", "framework", "\u{1F680}", "#BC52EE", {
    topics: ["astro", "astrojs", "astro-framework"],
    keywords: ["astro", "content-driven"],
    stackPool: ["Astro", "Islands", "MDX", "SSG"],
    taglines: ["Ship less JavaScript.", "Content-driven by design.", "Islands of interactivity."],
  }),
  c("nextjs", "Next.js Dev", "framework", "\u{25B2}", "#000000", {
    topics: ["nextjs", "next-js", "next", "vercel"],
    keywords: ["next.js", "nextjs"],
    stackPool: ["Next.js", "Vercel", "React", "RSC"],
  }),
  c("nuxt", "Nuxt Dev", "framework", "\u{1F7E2}", "#00DC82", {
    topics: ["nuxt", "nuxtjs", "nuxt3"],
    keywords: ["nuxt", "nuxtjs"],
    stackPool: ["Nuxt", "Vue", "Nitro", "UnJS"],
  }),
  c("solidjs", "SolidJS Dev", "framework", "\u{1F4A0}", "#2C4F7C", {
    topics: ["solidjs", "solid-js", "solid-start"],
    keywords: ["solidjs", "solid-start"],
    stackPool: ["SolidJS", "Solid Start", "Fine-grained Reactivity"],
  }),
  c("hono", "Hono Dev", "framework", "\u{1F525}", "#FF6633", {
    topics: ["hono", "honojs", "edge-framework"],
    keywords: ["hono", "edge", "lightweight framework"],
    stackPool: ["Hono", "Cloudflare Workers", "Bun", "Edge"],
    taglines: ["Ultrafast, edge-first.", "Small, smart, performant.", "The web framework for the edge."],
  }),
  c("elysia", "Elysia Dev", "framework", "\u{1F338}", "#7C6AEF", {
    topics: ["elysia", "elysiajs", "bun-framework"],
    keywords: ["elysia", "bun framework"],
    stackPool: ["Elysia", "Bun", "Eden", "TypeBox"],
  }),
  c("express", "Express Dev", "framework", "\u{1F6E4}\u{FE0F}", "#000000", {
    topics: ["express", "expressjs", "express-js"],
    keywords: ["express", "expressjs"],
    stackPool: ["Express", "Node.js", "Middleware"],
  }),
  c("django", "Django Dev", "framework", "\u{1F3B8}", "#092E20", {
    languages: ["Python"],
    topics: ["django", "django-rest-framework", "drf"],
    keywords: ["django"],
    stackPool: ["Django", "DRF", "Celery", "PostgreSQL"],
  }),
  c("rails", "Rails Dev", "framework", "\u{1F6E4}\u{FE0F}", "#CC0000", {
    languages: ["Ruby"],
    topics: ["rails", "ruby-on-rails", "rubyonrails"],
    keywords: ["rails", "ruby on rails"],
    stackPool: ["Rails", "Ruby", "ActiveRecord", "Sidekiq"],
  }),
  c("laravel", "Laravel Dev", "framework", "\u{1F33A}", "#FF2D20", {
    languages: ["PHP"],
    topics: ["laravel", "php", "blade", "eloquent"],
    keywords: ["laravel", "eloquent"],
    stackPool: ["Laravel", "PHP", "Eloquent", "Blade"],
  }),
  c("phoenix", "Phoenix Dev", "framework", "\u{1F426}\u{200D}\u{1F525}", "#FD4F00", {
    languages: ["Elixir"],
    topics: ["phoenix", "phoenix-framework", "liveview"],
    keywords: ["phoenix", "liveview"],
    stackPool: ["Phoenix", "LiveView", "Ecto", "Elixir"],
  }),
  c("gin", "Gin Dev", "framework", "\u{1F378}", "#00ADD8", {
    languages: ["Go"],
    topics: ["gin", "gin-gonic"],
    keywords: ["gin", "gin-gonic"],
    stackPool: ["Gin", "Go", "GORM"],
  }),
  c("axum", "Axum Dev", "framework", "\u{1F980}", "#E44D26", {
    languages: ["Rust"],
    topics: ["axum", "tokio", "tower"],
    keywords: ["axum", "tower", "tokio web"],
    stackPool: ["Axum", "Tokio", "Tower", "Rust"],
  }),
  c("flutter", "Flutter Dev", "framework", "\u{1F4F1}", "#02569B", {
    languages: ["Dart"],
    topics: ["flutter", "dart", "cross-platform", "mobile-development"],
    keywords: ["flutter", "cross-platform mobile"],
    stackPool: ["Flutter", "Dart", "Material", "pub.dev"],
  }),
  c("tailwindcss", "Tailwind CSS Dev", "framework", "\u{1F3A8}", "#06B6D4", {
    topics: ["tailwindcss", "tailwind", "tailwind-css", "utility-css"],
    keywords: ["tailwind", "utility-first css"],
    stackPool: ["Tailwind CSS", "PostCSS", "DaisyUI"],
  }),
  c("htmx", "htmx Dev", "framework", "\u{1F501}", "#3366CC", {
    topics: ["htmx", "hypermedia", "hateoas"],
    keywords: ["htmx", "hypermedia", "hateoas"],
    stackPool: ["htmx", "Alpine.js", "Hyperscript"],
    taglines: ["Hypermedia is the engine.", "JavaScript? Never heard of it.", "Back to basics, forward to greatness."],
  }),
  c("angular", "Angular Dev", "framework", "\u{1F534}", "#DD0031", {
    topics: ["angular", "angularjs", "rxjs", "ngrx"],
    keywords: ["angular", "rxjs"],
    stackPool: ["Angular", "RxJS", "NgRx", "TypeScript"],
  }),
  c("spring", "Spring Dev", "framework", "\u{1F33F}", "#6DB33F", {
    languages: ["Java", "Kotlin"],
    topics: ["spring", "spring-boot", "spring-framework"],
    keywords: ["spring boot", "spring framework"],
    stackPool: ["Spring Boot", "Spring Cloud", "JPA"],
  }),
  c("fastapi", "FastAPI Dev", "framework", "\u{26A1}", "#009688", {
    languages: ["Python"],
    topics: ["fastapi", "starlette", "pydantic"],
    keywords: ["fastapi", "pydantic"],
    stackPool: ["FastAPI", "Pydantic", "Starlette", "uvicorn"],
  }),
  c("nestjs", "NestJS Dev", "framework", "\u{1F431}", "#E0234E", {
    topics: ["nestjs", "nest-js", "nest-framework"],
    keywords: ["nestjs", "nest framework"],
    stackPool: ["NestJS", "TypeORM", "Prisma", "GraphQL"],
  }),
  c("remix", "Remix Dev", "framework", "\u{1F4BF}", "#121212", {
    topics: ["remix", "remix-run", "react-router"],
    keywords: ["remix", "remix-run"],
    stackPool: ["Remix", "React Router", "Loaders"],
  }),
  c("qwik", "Qwik Dev", "framework", "\u{26A1}", "#AC7EF4", {
    topics: ["qwik", "qwik-city", "resumability"],
    keywords: ["qwik", "resumability"],
    stackPool: ["Qwik", "Qwik City", "Resumability"],
  }),
];

// ---------------------------------------------------------------------------
// PLATFORM group (15)
// ---------------------------------------------------------------------------

const PLATFORMS: Category[] = [
  c("kubernetes", "Kubernetes Engineer", "platform", "\u{2638}\u{FE0F}", "#326CE5", {
    languages: ["HCL", "Jsonnet"],
    topics: ["kubernetes", "k8s", "kubectl", "k3s", "k8s-operator", "cncf"],
    keywords: ["kubernetes", "k8s", "container orchestrat"],
    statLabels: ["Orchestration", "Networking", "Storage", "Scaling"],
    stackPool: ["Kubernetes", "kubectl", "Helm", "Kustomize", "k3s"],
  }),
  c("docker", "Docker Expert", "platform", "\u{1F433}", "#2496ED", {
    topics: ["docker", "dockerfile", "docker-compose", "containers", "oci"],
    keywords: ["docker", "container", "dockerfile"],
    stackPool: ["Docker", "Compose", "Buildx", "OCI", "Podman"],
  }),
  c("terraform", "Terraform Engineer", "platform", "\u{1F3D7}\u{FE0F}", "#7B42BC", {
    languages: ["HCL"],
    topics: ["terraform", "opentofu", "hcl", "infrastructure-as-code"],
    keywords: ["terraform", "infrastructure as code", "hcl"],
    stackPool: ["Terraform", "OpenTofu", "HCL", "Terragrunt"],
  }),
  c("ansible", "Ansible Engineer", "platform", "\u{1F4E6}", "#EE0000", {
    topics: ["ansible", "ansible-playbook", "ansible-role", "configuration-management"],
    keywords: ["ansible", "playbook", "configuration management"],
    stackPool: ["Ansible", "AWX", "Molecule", "Roles"],
  }),
  c("pulumi", "Pulumi Dev", "platform", "\u{1F3D7}\u{FE0F}", "#8A3391", {
    topics: ["pulumi", "infrastructure-as-code"],
    keywords: ["pulumi", "infrastructure as code"],
    stackPool: ["Pulumi", "TypeScript IaC", "Go IaC"],
  }),
  c("helm", "Helm Maintainer", "platform", "\u{2693}", "#0F1689", {
    topics: ["helm", "helm-chart", "helm-charts", "helmfile"],
    keywords: ["helm chart", "helmfile"],
    stackPool: ["Helm", "Charts", "Helmfile", "Kubernetes"],
  }),
  c("argocd", "ArgoCD Engineer", "platform", "\u{1F500}", "#EF7B4D", {
    topics: ["argocd", "argo-cd", "gitops", "argo-workflows"],
    keywords: ["argocd", "gitops", "argo workflow"],
    stackPool: ["ArgoCD", "GitOps", "Argo Workflows"],
  }),
  c("github-actions", "GitHub Actions Dev", "platform", "\u{2699}\u{FE0F}", "#2088FF", {
    topics: ["github-actions", "github-action", "ci-cd", "github-ci"],
    keywords: ["github actions", "ci/cd", "workflow automation"],
    stackPool: ["GitHub Actions", "Workflows", "Runners"],
  }),
  c("jenkins", "Jenkins Admin", "platform", "\u{1F468}\u{200D}\u{1F527}", "#D24939", {
    topics: ["jenkins", "jenkinsfile", "ci-cd"],
    keywords: ["jenkins", "jenkinsfile"],
    stackPool: ["Jenkins", "Pipelines", "Groovy"],
  }),
  c("gitlab-ci", "GitLab CI Dev", "platform", "\u{1F98A}", "#FC6D26", {
    topics: ["gitlab-ci", "gitlab", "gitlab-runner"],
    keywords: ["gitlab ci", "gitlab runner"],
    stackPool: ["GitLab CI", "Runners", ".gitlab-ci.yml"],
  }),
  c("nixos", "NixOS User", "platform", "\u{2744}\u{FE0F}", "#5277C3", {
    languages: ["Nix"],
    topics: ["nixos", "nix", "nix-flakes", "nixpkgs", "home-manager"],
    keywords: ["nixos", "nix flake", "nixpkgs", "home-manager"],
    stackPool: ["NixOS", "Nix Flakes", "Home Manager", "nixpkgs"],
    taglines: ["Reproducible by design.", "Declarative everything.", "It works on my machine. And yours. And everyone's."],
  }),
  c("nomad", "Nomad User", "platform", "\u{1F3DC}\u{FE0F}", "#00CA8E", {
    topics: ["nomad", "hashicorp-nomad", "hashicorp"],
    keywords: ["nomad", "hashicorp"],
    stackPool: ["Nomad", "Consul", "Vault"],
  }),
  c("packer", "Packer User", "platform", "\u{1F4E6}", "#02A8EF", {
    topics: ["packer", "hashicorp-packer", "machine-image"],
    keywords: ["packer", "machine image"],
    stackPool: ["Packer", "AMI", "Vagrant"],
  }),
  c("vagrant", "Vagrant User", "platform", "\u{1F4E6}", "#1868F2", {
    topics: ["vagrant", "vagrantfile", "virtualbox"],
    keywords: ["vagrant", "vagrantfile"],
    stackPool: ["Vagrant", "VirtualBox", "libvirt"],
  }),
  c("crossplane", "Crossplane Dev", "platform", "\u{1F310}", "#F7B500", {
    topics: ["crossplane", "compositions", "cloud-native-iac"],
    keywords: ["crossplane", "cloud-native iac"],
    stackPool: ["Crossplane", "Compositions", "Providers"],
  }),
];

// ---------------------------------------------------------------------------
// CLOUD group (10)
// ---------------------------------------------------------------------------

const CLOUDS: Category[] = [
  c("aws", "AWS Expert", "cloud", "\u{2601}\u{FE0F}", "#FF9900", {
    topics: ["aws", "amazon-web-services", "lambda", "s3", "ec2", "eks", "dynamodb", "cloudformation"],
    keywords: ["aws", "amazon web services", "lambda", "s3"],
    stackPool: ["AWS", "Lambda", "S3", "EC2", "EKS", "CDK"],
  }),
  c("gcp", "GCP Expert", "cloud", "\u{2601}\u{FE0F}", "#4285F4", {
    topics: ["gcp", "google-cloud", "cloud-run", "bigquery", "gke"],
    keywords: ["google cloud", "gcp", "bigquery"],
    stackPool: ["GCP", "Cloud Run", "BigQuery", "GKE"],
  }),
  c("azure", "Azure Expert", "cloud", "\u{2601}\u{FE0F}", "#0078D4", {
    topics: ["azure", "microsoft-azure", "azure-functions", "aks"],
    keywords: ["azure", "microsoft cloud"],
    stackPool: ["Azure", "Functions", "AKS", "CosmosDB"],
  }),
  c("cloudflare", "Cloudflare Dev", "cloud", "\u{1F7E0}", "#F38020", {
    topics: ["cloudflare", "cloudflare-workers", "workers", "pages", "r2", "d1", "wrangler"],
    keywords: ["cloudflare", "workers", "edge"],
    stackPool: ["Workers", "D1", "R2", "KV", "Durable Objects", "Wrangler"],
    taglines: ["Edge-first everything.", "The network is the computer.", "Cloudflare all the things."],
  }),
  c("vercel", "Vercel Dev", "cloud", "\u{25B2}", "#000000", {
    topics: ["vercel", "now", "edge-functions"],
    keywords: ["vercel", "edge function"],
    stackPool: ["Vercel", "Edge Functions", "Next.js"],
  }),
  c("netlify", "Netlify Dev", "cloud", "\u{1F310}", "#00C7B7", {
    topics: ["netlify", "netlify-functions", "netlify-cms"],
    keywords: ["netlify"],
    stackPool: ["Netlify", "Functions", "Forms"],
  }),
  c("fly-io", "Fly.io Dev", "cloud", "\u{2708}\u{FE0F}", "#7B3FF2", {
    topics: ["fly-io", "flyio", "fly", "machines-api"],
    keywords: ["fly.io", "fly deploy"],
    stackPool: ["Fly.io", "Machines", "Volumes", "Litefs"],
  }),
  c("supabase", "Supabase Dev", "cloud", "\u{26A1}", "#3ECF8E", {
    topics: ["supabase", "supabase-js", "realtime"],
    keywords: ["supabase", "firebase alternative"],
    stackPool: ["Supabase", "PostgreSQL", "Auth", "Realtime"],
  }),
  c("firebase", "Firebase Dev", "cloud", "\u{1F525}", "#FFCA28", {
    topics: ["firebase", "firestore", "firebase-auth", "firebase-functions"],
    keywords: ["firebase", "firestore"],
    stackPool: ["Firebase", "Firestore", "Auth", "Cloud Functions"],
  }),
  c("digitalocean", "DigitalOcean Dev", "cloud", "\u{1F30A}", "#0080FF", {
    topics: ["digitalocean", "droplets", "kubernetes-digitalocean"],
    keywords: ["digitalocean", "droplet"],
    stackPool: ["DigitalOcean", "Droplets", "Spaces", "App Platform"],
  }),
];

// ---------------------------------------------------------------------------
// DATABASE group (12)
// ---------------------------------------------------------------------------

const DATABASES: Category[] = [
  c("postgresql", "PostgreSQL Expert", "database", "\u{1F418}", "#4169E1", {
    topics: ["postgresql", "postgres", "psql", "postgis", "pg"],
    keywords: ["postgresql", "postgres", "psql"],
    stackPool: ["PostgreSQL", "PostGIS", "pgvector", "pg_dump"],
  }),
  c("mysql", "MySQL Dev", "database", "\u{1F42C}", "#4479A1", {
    topics: ["mysql", "mariadb", "percona"],
    keywords: ["mysql", "mariadb"],
    stackPool: ["MySQL", "MariaDB", "Percona"],
  }),
  c("sqlite", "SQLite Dev", "database", "\u{1F4BE}", "#003B57", {
    topics: ["sqlite", "sqlite3", "libsql", "litestream"],
    keywords: ["sqlite", "embedded database"],
    stackPool: ["SQLite", "libSQL", "Litestream", "better-sqlite3"],
  }),
  c("mongodb", "MongoDB Dev", "database", "\u{1F343}", "#47A248", {
    topics: ["mongodb", "mongoose", "nosql", "bson"],
    keywords: ["mongodb", "nosql", "document database"],
    stackPool: ["MongoDB", "Mongoose", "Atlas", "Aggregation"],
  }),
  c("redis", "Redis Expert", "database", "\u{1F534}", "#DC382D", {
    topics: ["redis", "redis-cluster", "valkey", "keydb"],
    keywords: ["redis", "in-memory", "cache"],
    stackPool: ["Redis", "Valkey", "Pub/Sub", "Streams"],
  }),
  c("duckdb", "DuckDB Dev", "database", "\u{1F986}", "#FFF000", {
    topics: ["duckdb", "olap", "analytical-database"],
    keywords: ["duckdb", "olap", "analytical"],
    stackPool: ["DuckDB", "Parquet", "Arrow", "SQL"],
    taglines: ["Analytics at the speed of quack.", "In-process OLAP.", "SQL for the modern age."],
  }),
  c("clickhouse", "ClickHouse Dev", "database", "\u{26A1}", "#FFCC00", {
    topics: ["clickhouse", "olap", "columnar-database"],
    keywords: ["clickhouse", "columnar", "analytics"],
    stackPool: ["ClickHouse", "MergeTree", "Materialized Views"],
  }),
  c("neo4j", "Neo4j Dev", "database", "\u{1F578}\u{FE0F}", "#008CC1", {
    topics: ["neo4j", "graph-database", "cypher", "knowledge-graph"],
    keywords: ["neo4j", "graph database", "cypher"],
    stackPool: ["Neo4j", "Cypher", "Graph", "Knowledge Graph"],
  }),
  c("surrealdb", "SurrealDB Dev", "database", "\u{1F30C}", "#FF00A0", {
    topics: ["surrealdb", "surreal", "multi-model-database"],
    keywords: ["surrealdb", "surreal"],
    stackPool: ["SurrealDB", "SurrealQL", "Multi-model"],
  }),
  c("turso", "Turso Dev", "database", "\u{1FA90}", "#4FF8D2", {
    topics: ["turso", "libsql", "edge-database"],
    keywords: ["turso", "libsql", "edge database"],
    stackPool: ["Turso", "libSQL", "Embedded Replicas"],
  }),
  c("drizzle", "Drizzle ORM Dev", "database", "\u{1F4A7}", "#C5F74F", {
    topics: ["drizzle", "drizzle-orm", "orm"],
    keywords: ["drizzle orm", "type-safe orm"],
    stackPool: ["Drizzle ORM", "Drizzle Kit", "TypeScript ORM"],
  }),
  c("prisma", "Prisma Dev", "database", "\u{25B3}", "#2D3748", {
    topics: ["prisma", "prisma-orm", "prisma-client"],
    keywords: ["prisma", "prisma orm"],
    stackPool: ["Prisma", "Prisma Client", "Migrations"],
  }),
];

// ---------------------------------------------------------------------------
// AI-ML group (12)
// ---------------------------------------------------------------------------

const AI_ML: Category[] = [
  c("llm", "LLM Engineer", "ai-ml", "\u{1F9E0}", "#8B5CF6", {
    topics: ["llm", "large-language-model", "gpt", "claude", "openai", "anthropic", "langchain", "llamaindex"],
    keywords: ["llm", "large language model", "gpt", "claude", "openai"],
    stackPool: ["LLMs", "Claude", "GPT", "LangChain", "Prompting"],
    taglines: ["Prompt engineering is engineering.", "I talk to machines for a living.", "Tokens in, wisdom out."],
  }),
  c("rag", "RAG Engineer", "ai-ml", "\u{1F4DA}", "#7C3AED", {
    topics: ["rag", "retrieval-augmented-generation", "vector-search", "semantic-search"],
    keywords: ["rag", "retrieval augmented", "vector search", "semantic search"],
    stackPool: ["RAG", "Embeddings", "Vector DB", "Chunking"],
  }),
  c("embeddings", "Embeddings Dev", "ai-ml", "\u{1F4CD}", "#6D28D9", {
    topics: ["embeddings", "vector-database", "vector-search", "pgvector", "qdrant", "pinecone"],
    keywords: ["embedding", "vector database", "similarity search"],
    stackPool: ["Embeddings", "pgvector", "Qdrant", "Pinecone"],
  }),
  c("computer-vision", "Computer Vision Dev", "ai-ml", "\u{1F441}\u{FE0F}", "#059669", {
    topics: ["computer-vision", "opencv", "image-recognition", "object-detection", "yolo"],
    keywords: ["computer vision", "image recognition", "object detection"],
    stackPool: ["OpenCV", "YOLO", "CNN", "Image Processing"],
  }),
  c("nlp", "NLP Engineer", "ai-ml", "\u{1F4AC}", "#0EA5E9", {
    topics: ["nlp", "natural-language-processing", "text-analysis", "sentiment-analysis", "tokenizer"],
    keywords: ["nlp", "natural language", "text analysis", "sentiment"],
    stackPool: ["NLP", "Transformers", "Tokenizers", "spaCy"],
  }),
  c("ai-agents", "AI Agent Builder", "ai-ml", "\u{1F916}", "#EC4899", {
    topics: ["ai-agent", "ai-agents", "autonomous-agents", "agent-framework", "mcp", "tool-use"],
    keywords: ["ai agent", "autonomous agent", "tool use", "mcp"],
    stackPool: ["AI Agents", "MCP", "Tool Use", "Orchestration"],
    taglines: ["Building minds, one tool at a time.", "Agents are the new apps.", "I automate the thinkers."],
  }),
  c("mlops", "MLOps Engineer", "ai-ml", "\u{2699}\u{FE0F}", "#10B981", {
    topics: ["mlops", "ml-pipeline", "model-serving", "ml-deployment", "kubeflow"],
    keywords: ["mlops", "model serving", "ml pipeline"],
    stackPool: ["MLOps", "Kubeflow", "MLflow", "Model Registry"],
  }),
  c("tensorflow", "TensorFlow Dev", "ai-ml", "\u{1F9E0}", "#FF6F00", {
    topics: ["tensorflow", "keras", "tf", "tflite"],
    keywords: ["tensorflow", "keras"],
    stackPool: ["TensorFlow", "Keras", "TFLite", "TensorBoard"],
  }),
  c("pytorch", "PyTorch Dev", "ai-ml", "\u{1F525}", "#EE4C2C", {
    topics: ["pytorch", "torch", "torchvision"],
    keywords: ["pytorch", "torch"],
    stackPool: ["PyTorch", "torchvision", "Lightning"],
  }),
  c("huggingface", "Hugging Face Dev", "ai-ml", "\u{1F917}", "#FFD21E", {
    topics: ["huggingface", "transformers", "hugging-face", "datasets"],
    keywords: ["hugging face", "transformers", "huggingface"],
    stackPool: ["Hugging Face", "Transformers", "Datasets", "Spaces"],
  }),
  c("ollama", "Ollama User", "ai-ml", "\u{1F999}", "#FFFFFF", {
    topics: ["ollama", "local-llm", "self-hosted-ai", "llama"],
    keywords: ["ollama", "local llm", "self-hosted ai"],
    stackPool: ["Ollama", "Llama", "Mistral", "Local LLM"],
    taglines: ["AI belongs on your machine.", "No cloud required.", "Self-hosted intelligence."],
  }),
  c("stable-diffusion", "Stable Diffusion Dev", "ai-ml", "\u{1F3A8}", "#A855F7", {
    topics: ["stable-diffusion", "image-generation", "diffusion", "comfyui", "automatic1111"],
    keywords: ["stable diffusion", "image generation", "diffusion model"],
    stackPool: ["Stable Diffusion", "ComfyUI", "LoRA", "SDXL"],
  }),
];

// ---------------------------------------------------------------------------
// SECURITY group (10)
// ---------------------------------------------------------------------------

const SECURITY: Category[] = [
  c("pentesting", "Pentester", "security", "\u{1F575}\u{FE0F}", "#FF0000", {
    topics: ["penetration-testing", "pentesting", "pentest", "ethical-hacking", "bug-bounty"],
    keywords: ["penetration testing", "pentest", "ethical hacking", "bug bounty"],
    stackPool: ["Burp Suite", "Metasploit", "Nmap", "OWASP"],
  }),
  c("cryptography", "Cryptographer", "security", "\u{1F510}", "#FFD700", {
    topics: ["cryptography", "encryption", "tls", "ssl", "pgp", "e2ee"],
    keywords: ["cryptography", "encryption", "tls", "end-to-end"],
    stackPool: ["TLS", "PGP", "AES", "RSA", "Curve25519"],
  }),
  c("oauth-sso", "Auth Engineer", "security", "\u{1F511}", "#4CAF50", {
    topics: ["oauth", "sso", "openid-connect", "saml", "authentication", "authorization", "oidc"],
    keywords: ["oauth", "sso", "authentication", "authorization", "openid"],
    stackPool: ["OAuth 2.0", "OIDC", "SAML", "JWT", "Passkeys"],
  }),
  c("zero-trust", "Zero Trust Engineer", "security", "\u{1F6E1}\u{FE0F}", "#1565C0", {
    topics: ["zero-trust", "zero-trust-security", "beyondcorp", "identity-aware-proxy"],
    keywords: ["zero trust", "beyondcorp", "identity-aware"],
    stackPool: ["Zero Trust", "mTLS", "SPIFFE", "Tailscale"],
  }),
  c("supply-chain-security", "Supply Chain Security", "security", "\u{1F517}", "#FF6D00", {
    topics: ["supply-chain-security", "sbom", "sigstore", "software-supply-chain", "slsa"],
    keywords: ["supply chain", "sbom", "sigstore", "slsa"],
    stackPool: ["SBOM", "Sigstore", "SLSA", "Cosign"],
  }),
  c("ctf", "CTF Player", "security", "\u{1F3F4}", "#9C27B0", {
    topics: ["ctf", "capture-the-flag", "wargame", "cybersecurity-challenges"],
    keywords: ["ctf", "capture the flag", "wargame"],
    stackPool: ["CTF", "pwn", "crypto", "forensics", "rev"],
  }),
  c("network-security", "Network Security", "security", "\u{1F310}", "#00BCD4", {
    topics: ["network-security", "firewall", "ids", "ips", "nids"],
    keywords: ["network security", "firewall", "intrusion detection"],
    stackPool: ["Firewall", "IDS/IPS", "Wireshark", "Suricata"],
  }),
  c("vulnerability-research", "Vuln Researcher", "security", "\u{1F41B}", "#F44336", {
    topics: ["vulnerability", "cve", "exploit", "security-research", "fuzzing"],
    keywords: ["vulnerability", "cve", "exploit", "security research"],
    stackPool: ["CVE", "AFL", "Fuzzing", "Ghidra"],
  }),
  c("malware-analysis", "Malware Analyst", "security", "\u{1F9EA}", "#880E4F", {
    topics: ["malware", "malware-analysis", "reverse-engineering", "threat-intelligence"],
    keywords: ["malware", "reverse engineering", "threat intelligence"],
    stackPool: ["Ghidra", "IDA", "YARA", "Cuckoo"],
  }),
  c("devsecops", "DevSecOps Engineer", "security", "\u{1F6E1}\u{FE0F}", "#7CB342", {
    topics: ["devsecops", "security-automation", "sast", "dast", "container-security"],
    keywords: ["devsecops", "security automation", "sast", "dast"],
    stackPool: ["Trivy", "Snyk", "SonarQube", "OWASP ZAP"],
  }),
];

// ---------------------------------------------------------------------------
// SYSTEMS group (10)
// ---------------------------------------------------------------------------

const SYSTEMS: Category[] = [
  c("kernel-dev", "Kernel Developer", "systems", "\u{2699}\u{FE0F}", "#4A90D9", {
    languages: ["C", "C++", "Rust", "Assembly"],
    topics: ["kernel", "linux-kernel", "operating-system", "os-dev"],
    keywords: ["kernel", "syscall", "operating system"],
    stackPool: ["Linux Kernel", "syscalls", "POSIX", "drivers"],
  }),
  c("embedded", "Embedded Engineer", "systems", "\u{1F4DF}", "#2E7D32", {
    languages: ["C", "C++", "Rust", "Assembly"],
    topics: ["embedded", "embedded-systems", "bare-metal", "rtos", "microcontroller"],
    keywords: ["embedded", "bare metal", "microcontroller", "rtos"],
    stackPool: ["Embedded C", "RTOS", "ARM", "STM32"],
  }),
  c("compilers", "Compiler Engineer", "systems", "\u{1F9F0}", "#9C27B0", {
    topics: ["compiler", "compilers", "llvm", "parser", "ast", "programming-language", "language-design"],
    keywords: ["compiler", "parser", "ast", "llvm", "language design"],
    stackPool: ["LLVM", "Parsers", "AST", "Codegen", "IR"],
  }),
  c("hypervisors", "Virtualization Engineer", "systems", "\u{1F4BB}", "#0097A7", {
    topics: ["hypervisor", "virtualization", "qemu", "kvm", "proxmox", "esxi", "xen"],
    keywords: ["hypervisor", "virtualization", "qemu", "kvm", "proxmox"],
    stackPool: ["QEMU", "KVM", "Proxmox", "libvirt", "Xen"],
  }),
  c("ebpf", "eBPF Engineer", "systems", "\u{1F41D}", "#F9A825", {
    topics: ["ebpf", "bpf", "xdp", "linux-tracing", "cilium"],
    keywords: ["ebpf", "bpf", "xdp", "tracing"],
    stackPool: ["eBPF", "Cilium", "bpftrace", "XDP"],
  }),
  c("wasm", "WebAssembly Dev", "systems", "\u{1F4E6}", "#654FF0", {
    topics: ["webassembly", "wasm", "wasi", "wasmtime", "wasmer", "wasm-bindgen"],
    keywords: ["webassembly", "wasm", "wasi"],
    stackPool: ["WebAssembly", "WASI", "Wasmtime", "wasm-bindgen"],
  }),
  c("firmware", "Firmware Engineer", "systems", "\u{1F4DF}", "#607D8B", {
    languages: ["C", "C++", "Assembly"],
    topics: ["firmware", "bootloader", "bios", "uefi", "u-boot"],
    keywords: ["firmware", "bootloader", "uefi", "bios"],
    stackPool: ["Firmware", "U-Boot", "UEFI", "SPI Flash"],
  }),
  c("fpga", "FPGA Engineer", "systems", "\u{1F9E9}", "#E91E63", {
    languages: ["Verilog", "VHDL", "SystemVerilog"],
    topics: ["fpga", "verilog", "vhdl", "hdl", "chisel"],
    keywords: ["fpga", "verilog", "vhdl", "hardware description"],
    stackPool: ["FPGA", "Verilog", "VHDL", "Vivado", "Chisel"],
  }),
  c("performance-engineering", "Performance Engineer", "systems", "\u{1F3CE}\u{FE0F}", "#FF5722", {
    topics: ["performance", "profiling", "benchmark", "optimization", "perf"],
    keywords: ["performance", "profiling", "benchmark", "optimization"],
    stackPool: ["perf", "flamegraph", "Valgrind", "io_uring"],
  }),
  c("memory-management", "Memory Systems Dev", "systems", "\u{1F9F1}", "#795548", {
    topics: ["memory-management", "garbage-collection", "allocator", "memory-safety"],
    keywords: ["memory management", "garbage collect", "allocator"],
    stackPool: ["Allocators", "GC", "jemalloc", "Memory Safety"],
  }),
];

// ---------------------------------------------------------------------------
// LINUX group (10)
// ---------------------------------------------------------------------------

const LINUX: Category[] = [
  c("window-managers", "WM Ricer", "linux", "\u{1F5BC}\u{FE0F}", "#FFEB3B", {
    topics: ["window-manager", "hyprland", "sway", "i3", "i3wm", "bspwm", "dwm", "awesome-wm", "ricing"],
    keywords: ["window manager", "hyprland", "sway", "i3", "ricing"],
    stackPool: ["Hyprland", "Sway", "i3", "bspwm", "dwm"],
    taglines: ["My desktop is my canvas.", "btw, I rice.", "Gaps and transparency are a lifestyle."],
  }),
  c("wayland", "Wayland Advocate", "linux", "\u{1F4BB}", "#1A237E", {
    topics: ["wayland", "wlroots", "wayland-compositor", "wayland-protocol"],
    keywords: ["wayland", "wlroots", "compositor"],
    stackPool: ["Wayland", "wlroots", "Smithay", "Mir"],
  }),
  c("dotfiles", "Dotfiles Curator", "linux", "\u{1F4C1}", "#66BB6A", {
    topics: ["dotfiles", "configuration", "rice", "dotfile-manager", "chezmoi", "stow"],
    keywords: ["dotfiles", "configuration", "rice", "chezmoi", "stow"],
    stackPool: ["Chezmoi", "GNU Stow", "YADM", "Git"],
    taglines: ["My dotfiles are a work of art.", "Configuration is king.", "git clone my life."],
  }),
  c("sysadmin", "Sysadmin", "linux", "\u{1F468}\u{200D}\u{1F4BB}", "#F57C00", {
    topics: ["sysadmin", "system-administration", "server-management", "linux-server"],
    keywords: ["sysadmin", "system admin", "server management"],
    stackPool: ["Linux", "SSH", "systemd", "iptables", "cron"],
  }),
  c("nixos-ecosystem", "Nix Ecosystem", "linux", "\u{2744}\u{FE0F}", "#7EBAE4", {
    languages: ["Nix"],
    topics: ["nix", "nix-flakes", "home-manager", "nixpkgs", "nix-darwin"],
    keywords: ["nix", "flake", "home-manager", "nixpkgs"],
    stackPool: ["Nix", "Flakes", "Home Manager", "nix-darwin"],
  }),
  c("arch-linux", "Arch Linux User", "linux", "\u{1F3D4}\u{FE0F}", "#1793D1", {
    topics: ["arch-linux", "archlinux", "aur", "pacman", "makepkg"],
    keywords: ["arch linux", "aur", "pacman"],
    stackPool: ["Arch Linux", "pacman", "AUR", "makepkg"],
    taglines: ["btw, I use Arch.", "Rolling release, rolling with it.", "RTFM."],
  }),
  c("desktop-customization", "Desktop Customizer", "linux", "\u{1F3A8}", "#AB47BC", {
    topics: ["desktop-customization", "theming", "gtk-theme", "qt-theme", "unixporn"],
    keywords: ["desktop customiz", "theming", "unixporn"],
    stackPool: ["GTK", "Qt", "Kvantum", "Pywal"],
  }),
  c("package-management", "Package Maintainer", "linux", "\u{1F4E6}", "#26A69A", {
    topics: ["package-manager", "apt", "pacman", "rpm", "flatpak", "snap", "appimage"],
    keywords: ["package manager", "apt", "flatpak", "snap"],
    stackPool: ["apt", "pacman", "Flatpak", "AppImage"],
  }),
  c("containers-runtime", "Container Runtime Dev", "linux", "\u{1F4E6}", "#0DB7ED", {
    topics: ["containerd", "podman", "cri-o", "runc", "container-runtime"],
    keywords: ["containerd", "podman", "container runtime", "runc"],
    stackPool: ["containerd", "Podman", "CRI-O", "runc"],
  }),
  c("systemd", "systemd Expert", "linux", "\u{2699}\u{FE0F}", "#4CAF50", {
    topics: ["systemd", "init-system", "journald", "systemctl"],
    keywords: ["systemd", "systemctl", "journald", "init system"],
    stackPool: ["systemd", "journald", "systemctl", "units"],
  }),
];

// ---------------------------------------------------------------------------
// CLI group (8)
// ---------------------------------------------------------------------------

const CLI: Category[] = [
  c("terminal-emulators", "Terminal Enthusiast", "cli", ">_", "#00FF41", {
    topics: ["terminal", "terminal-emulator", "ghostty", "alacritty", "kitty", "wezterm", "foot"],
    keywords: ["terminal emulator", "ghostty", "alacritty", "kitty", "wezterm"],
    stackPool: ["Ghostty", "Alacritty", "Kitty", "WezTerm", "foot"],
  }),
  c("shell-scripting", "Shell Scripter", "cli", "\u{1F41A}", "#89E051", {
    languages: ["Shell", "Bash", "Zsh", "Fish", "Nushell"],
    topics: ["shell-script", "bash-script", "shell-scripting", "automation"],
    keywords: ["shell script", "bash script", "automation"],
    stackPool: ["Bash", "Zsh", "Fish", "Nushell", "POSIX sh"],
  }),
  c("tui-development", "TUI Developer", "cli", "\u{1F4BB}", "#00BFA5", {
    topics: ["tui", "terminal-ui", "ncurses", "ratatui", "bubbletea", "textual"],
    keywords: ["tui", "terminal ui", "text user interface"],
    stackPool: ["Ratatui", "Bubbletea", "Textual", "Ink"],
  }),
  c("cli-tooling", "CLI Tool Builder", "cli", "\u{1F527}", "#FF9800", {
    topics: ["cli", "command-line", "cli-tool", "cli-app", "clap", "cobra"],
    keywords: ["cli tool", "command-line tool", "cli app"],
    stackPool: ["Clap", "Cobra", "Commander.js", "oclif"],
  }),
  c("terminal-multiplexers", "Multiplexer User", "cli", "\u{1F4F0}", "#4DB6AC", {
    topics: ["tmux", "zellij", "screen", "terminal-multiplexer"],
    keywords: ["tmux", "zellij", "terminal multiplexer"],
    stackPool: ["tmux", "Zellij", "screen"],
  }),
  c("prompt-customization", "Prompt Customizer", "cli", "\u{2728}", "#E040FB", {
    topics: ["starship", "oh-my-zsh", "powerlevel10k", "prompt", "shell-prompt"],
    keywords: ["shell prompt", "starship", "oh-my-zsh"],
    stackPool: ["Starship", "p10k", "oh-my-zsh", "oh-my-fish"],
  }),
  c("shell-plugins", "Shell Plugin Dev", "cli", "\u{1F9E9}", "#8BC34A", {
    topics: ["zsh-plugin", "fish-plugin", "shell-plugin", "nushell-plugin"],
    keywords: ["shell plugin", "zsh plugin"],
    stackPool: ["zinit", "Fisher", "antibody"],
  }),
  c("command-line-utils", "CLI Utils Dev", "cli", "\u{1F6E0}\u{FE0F}", "#FFCA28", {
    topics: ["coreutils", "rust-cli", "modern-unix", "command-line-utils"],
    keywords: ["modern unix", "coreutils", "command line util"],
    stackPool: ["ripgrep", "fd", "bat", "exa", "delta", "sd"],
    taglines: ["Rewriting coreutils in Rust.", "Modern Unix for modern times.", "grep is dead, long live rg."],
  }),
];

// ---------------------------------------------------------------------------
// EDITOR group (6)
// ---------------------------------------------------------------------------

const EDITORS: Category[] = [
  c("neovim", "Neovim User", "editor", "\u{1F4DD}", "#57A143", {
    languages: ["Lua", "Vim Script", "Vimscript"],
    topics: ["neovim", "nvim", "neovim-plugin", "neovim-config", "nvim-lua"],
    keywords: ["neovim", "nvim", "neovim plugin"],
    stackPool: ["Neovim", "Lua", "lazy.nvim", "LSP", "Treesitter"],
    taglines: ["The terminal is home.", "hjkl is all you need.", "Neovim is my IDE."],
  }),
  c("vim", "Vim User", "editor", "\u{1F4DD}", "#019733", {
    languages: ["Vim Script", "Vimscript"],
    topics: ["vim", "vimscript", "vim-plugin"],
    keywords: ["vim", "vimrc", "vim plugin"],
    stackPool: ["Vim", "Vimscript", ".vimrc", "vim-plug"],
  }),
  c("vscode-extensions", "VS Code Extension Dev", "editor", "\u{1F4DD}", "#007ACC", {
    topics: ["vscode", "vscode-extension", "visual-studio-code", "vscode-theme"],
    keywords: ["vscode", "vs code", "visual studio code"],
    stackPool: ["VS Code", "Extension API", "LSP", "Themes"],
  }),
  c("emacs", "Emacs User", "editor", "\u{1F4DD}", "#7F5AB6", {
    languages: ["Emacs Lisp"],
    topics: ["emacs", "elisp", "doom-emacs", "spacemacs", "org-mode"],
    keywords: ["emacs", "elisp", "org-mode", "doom emacs"],
    stackPool: ["Emacs", "Elisp", "Org-mode", "Doom", "TRAMP"],
  }),
  c("helix", "Helix User", "editor", "\u{1F4DD}", "#281733", {
    topics: ["helix", "helix-editor"],
    keywords: ["helix editor"],
    stackPool: ["Helix", "Tree-sitter", "LSP"],
  }),
  c("zed", "Zed User", "editor", "\u{26A1}", "#084CCF", {
    topics: ["zed", "zed-editor"],
    keywords: ["zed editor"],
    stackPool: ["Zed", "GPUI", "Tree-sitter"],
  }),
];

// ---------------------------------------------------------------------------
// WEB group (12)
// ---------------------------------------------------------------------------

const WEB: Category[] = [
  c("frontend", "Frontend Dev", "web", "\u{1F3A8}", "#E91E63", {
    topics: ["frontend", "front-end", "ui", "ux", "responsive-design", "css", "html"],
    keywords: ["frontend", "front-end", "user interface", "responsive"],
    stackPool: ["HTML", "CSS", "JavaScript", "Responsive Design"],
  }),
  c("backend", "Backend Dev", "web", "\u{2699}\u{FE0F}", "#3F51B5", {
    topics: ["backend", "back-end", "server-side", "rest-api", "microservice"],
    keywords: ["backend", "back-end", "server-side", "rest api"],
    stackPool: ["REST", "API", "Databases", "Auth"],
  }),
  c("fullstack", "Full Stack Dev", "web", "\u{1F310}", "#9C27B0", {
    topics: ["fullstack", "full-stack", "full-stack-developer"],
    keywords: ["full stack", "fullstack"],
    stackPool: ["Frontend", "Backend", "Database", "DevOps"],
  }),
  c("api-design", "API Designer", "web", "\u{1F4D0}", "#FF9800", {
    topics: ["api-design", "openapi", "swagger", "rest", "json-schema", "api-gateway"],
    keywords: ["api design", "openapi", "swagger", "json schema"],
    stackPool: ["OpenAPI", "Swagger", "JSON Schema", "REST"],
  }),
  c("graphql", "GraphQL Dev", "web", "\u{25C6}", "#E10098", {
    topics: ["graphql", "apollo", "relay", "hasura", "graphql-api"],
    keywords: ["graphql", "apollo", "relay", "hasura"],
    stackPool: ["GraphQL", "Apollo", "Relay", "Hasura"],
  }),
  c("grpc", "gRPC Dev", "web", "\u{1F4E1}", "#244C5A", {
    topics: ["grpc", "protobuf", "protocol-buffers", "grpc-web"],
    keywords: ["grpc", "protobuf", "protocol buffers"],
    stackPool: ["gRPC", "Protobuf", "Connect", "Buf"],
  }),
  c("websockets", "WebSocket Dev", "web", "\u{1F50C}", "#4CAF50", {
    topics: ["websocket", "websockets", "socket-io", "realtime", "sse"],
    keywords: ["websocket", "real-time", "socket.io"],
    stackPool: ["WebSockets", "Socket.io", "SSE", "MQTT"],
  }),
  c("pwa", "PWA Dev", "web", "\u{1F4F1}", "#5A0FC8", {
    topics: ["pwa", "progressive-web-app", "service-worker", "web-push"],
    keywords: ["pwa", "progressive web app", "service worker"],
    stackPool: ["PWA", "Service Workers", "Web Push", "Workbox"],
  }),
  c("ssg", "Static Site Builder", "web", "\u{1F4C4}", "#FF5722", {
    topics: ["ssg", "static-site-generator", "jamstack", "11ty", "hugo", "zola", "jekyll"],
    keywords: ["static site", "ssg", "jamstack"],
    stackPool: ["Hugo", "Zola", "11ty", "Jekyll"],
  }),
  c("jamstack", "Jamstack Dev", "web", "\u{26A1}", "#F0047F", {
    topics: ["jamstack", "headless-cms", "static-first"],
    keywords: ["jamstack", "headless cms"],
    stackPool: ["Jamstack", "Headless CMS", "CDN", "API"],
  }),
  c("web-components", "Web Components Dev", "web", "\u{1F9E9}", "#29ABE2", {
    topics: ["web-components", "custom-elements", "shadow-dom", "lit", "stencil"],
    keywords: ["web component", "custom element", "shadow dom", "lit"],
    stackPool: ["Lit", "Stencil", "Custom Elements", "Shadow DOM"],
  }),
  c("web-standards", "Web Standards Advocate", "web", "\u{1F310}", "#005A9C", {
    topics: ["web-standards", "w3c", "whatwg", "web-platform", "html5", "css3"],
    keywords: ["web standard", "w3c", "whatwg", "web platform"],
    stackPool: ["HTML5", "CSS3", "Web APIs", "WHATWG"],
  }),
];

// ---------------------------------------------------------------------------
// DATA group (8)
// ---------------------------------------------------------------------------

const DATA: Category[] = [
  c("data-engineering", "Data Engineer", "data", "\u{1F4CA}", "#FF7043", {
    topics: ["data-engineering", "data-pipeline", "etl", "data-warehouse", "data-lake"],
    keywords: ["data engineering", "data pipeline", "etl"],
    stackPool: ["Spark", "Airflow", "dbt", "Kafka"],
  }),
  c("etl", "ETL Dev", "data", "\u{1F504}", "#5C6BC0", {
    topics: ["etl", "data-integration", "data-loading", "airbyte", "fivetran"],
    keywords: ["etl", "data integration", "data loading"],
    stackPool: ["Airbyte", "Fivetran", "dbt", "Singer"],
  }),
  c("data-viz", "Data Visualization Dev", "data", "\u{1F4C8}", "#FF4081", {
    topics: ["data-visualization", "d3", "chart", "dashboard", "plotting", "d3js"],
    keywords: ["data visualization", "d3", "chart", "dashboard"],
    stackPool: ["D3.js", "Observable", "Vega", "Plotly"],
  }),
  c("stream-processing", "Stream Processing Dev", "data", "\u{1F30A}", "#00897B", {
    topics: ["stream-processing", "kafka", "flink", "pulsar", "event-streaming"],
    keywords: ["stream processing", "kafka", "event streaming"],
    stackPool: ["Kafka", "Flink", "Pulsar", "NATS"],
  }),
  c("data-lakes", "Data Lake Engineer", "data", "\u{1F3DE}\u{FE0F}", "#0277BD", {
    topics: ["data-lake", "delta-lake", "iceberg", "hudi", "lakehouse"],
    keywords: ["data lake", "delta lake", "iceberg", "lakehouse"],
    stackPool: ["Delta Lake", "Iceberg", "Hudi", "Parquet"],
  }),
  c("analytics", "Analytics Engineer", "data", "\u{1F4CA}", "#7B1FA2", {
    topics: ["analytics", "business-intelligence", "bi", "metabase", "superset"],
    keywords: ["analytics", "business intelligence"],
    stackPool: ["dbt", "Metabase", "Superset", "Looker"],
  }),
  c("sql-tooling", "SQL Tooling Dev", "data", "\u{1F4BE}", "#336791", {
    topics: ["sql", "sql-tools", "database-gui", "query-builder"],
    keywords: ["sql tool", "database gui", "query builder"],
    stackPool: ["SQL", "pgAdmin", "DBeaver", "DataGrip"],
  }),
  c("data-pipelines", "Pipeline Builder", "data", "\u{1F6E0}\u{FE0F}", "#E65100", {
    topics: ["data-pipeline", "airflow", "dagster", "prefect", "workflow"],
    keywords: ["data pipeline", "airflow", "dagster", "prefect"],
    stackPool: ["Airflow", "Dagster", "Prefect", "Luigi"],
  }),
];

// ---------------------------------------------------------------------------
// TESTING group (6)
// ---------------------------------------------------------------------------

const TESTING: Category[] = [
  c("unit-testing", "Unit Testing Dev", "testing", "\u{2705}", "#4CAF50", {
    topics: ["unit-testing", "jest", "vitest", "mocha", "pytest", "testing"],
    keywords: ["unit test", "jest", "vitest", "mocha"],
    stackPool: ["Vitest", "Jest", "Mocha", "bun:test"],
  }),
  c("e2e-testing", "E2E Testing Dev", "testing", "\u{1F9EA}", "#00BCD4", {
    topics: ["e2e-testing", "playwright", "cypress", "selenium", "puppeteer"],
    keywords: ["e2e test", "playwright", "cypress", "selenium"],
    stackPool: ["Playwright", "Cypress", "Selenium"],
  }),
  c("load-testing", "Load Testing Dev", "testing", "\u{1F4C8}", "#FF5722", {
    topics: ["load-testing", "k6", "gatling", "jmeter", "stress-testing"],
    keywords: ["load test", "k6", "gatling", "stress test"],
    stackPool: ["k6", "Gatling", "Locust", "Artillery"],
  }),
  c("fuzzing", "Fuzz Tester", "testing", "\u{1F41B}", "#9C27B0", {
    topics: ["fuzzing", "fuzz-testing", "afl", "libfuzzer", "honggfuzz"],
    keywords: ["fuzzing", "fuzz test", "afl"],
    stackPool: ["AFL++", "libFuzzer", "cargo-fuzz"],
  }),
  c("tdd", "TDD Practitioner", "testing", "\u{1F501}", "#2196F3", {
    topics: ["tdd", "test-driven-development", "bdd"],
    keywords: ["tdd", "test-driven", "bdd"],
    stackPool: ["TDD", "BDD", "Red-Green-Refactor"],
  }),
  c("property-testing", "Property Tester", "testing", "\u{1F3B2}", "#795548", {
    topics: ["property-testing", "quickcheck", "hypothesis", "proptest"],
    keywords: ["property test", "quickcheck", "hypothesis"],
    stackPool: ["QuickCheck", "Hypothesis", "Proptest", "fast-check"],
  }),
];

// ---------------------------------------------------------------------------
// OBSERVABILITY group (8)
// ---------------------------------------------------------------------------

const OBSERVABILITY: Category[] = [
  c("monitoring", "Monitoring Expert", "observability", "\u{1F4CA}", "#FF5252", {
    topics: ["monitoring", "grafana", "prometheus", "victoriametrics", "datadog"],
    keywords: ["monitoring", "grafana", "prometheus", "metrics"],
    stackPool: ["Grafana", "Prometheus", "VictoriaMetrics", "Datadog"],
  }),
  c("logging", "Logging Expert", "observability", "\u{1F4D3}", "#FFC107", {
    topics: ["logging", "elk", "elasticsearch", "logstash", "loki", "fluentd"],
    keywords: ["logging", "elasticsearch", "log aggregat"],
    stackPool: ["Loki", "ELK", "Fluentd", "Vector"],
  }),
  c("tracing", "Tracing Expert", "observability", "\u{1F50D}", "#7C4DFF", {
    topics: ["tracing", "distributed-tracing", "jaeger", "zipkin", "tempo"],
    keywords: ["distributed tracing", "jaeger", "zipkin"],
    stackPool: ["Jaeger", "Tempo", "Zipkin", "Spans"],
  }),
  c("opentelemetry", "OpenTelemetry Dev", "observability", "\u{1F4E1}", "#425CC7", {
    topics: ["opentelemetry", "otel", "telemetry"],
    keywords: ["opentelemetry", "otel", "telemetry"],
    stackPool: ["OpenTelemetry", "OTLP", "Collectors", "SDKs"],
  }),
  c("chaos-engineering", "Chaos Engineer", "observability", "\u{1F525}", "#D50000", {
    topics: ["chaos-engineering", "chaos-monkey", "litmus", "chaos-mesh"],
    keywords: ["chaos engineering", "chaos monkey", "resilience"],
    stackPool: ["Litmus", "Chaos Mesh", "Gremlin", "Toxiproxy"],
  }),
  c("incident-response", "Incident Responder", "observability", "\u{1F6A8}", "#FF6D00", {
    topics: ["incident-response", "on-call", "pagerduty", "opsgenie", "incident-management"],
    keywords: ["incident response", "on-call", "pagerduty"],
    stackPool: ["PagerDuty", "OpsGenie", "Runbooks", "Postmortems"],
  }),
  c("slo-sli", "SLO/SLI Expert", "observability", "\u{1F3AF}", "#00C853", {
    topics: ["slo", "sli", "error-budget", "reliability"],
    keywords: ["slo", "sli", "error budget", "reliability"],
    stackPool: ["SLOs", "SLIs", "Error Budgets", "Nobl9"],
  }),
  c("alerting", "Alerting Expert", "observability", "\u{1F514}", "#FF1744", {
    topics: ["alerting", "alertmanager", "notification", "alert-rules"],
    keywords: ["alerting", "alertmanager", "notification"],
    stackPool: ["Alertmanager", "Grafana Alerts", "PagerDuty"],
  }),
];

// ---------------------------------------------------------------------------
// NETWORKING group (6)
// ---------------------------------------------------------------------------

const NETWORKING: Category[] = [
  c("vpn-wireguard", "VPN / WireGuard Dev", "networking", "\u{1F510}", "#88171A", {
    topics: ["vpn", "wireguard", "openvpn", "tailscale", "headscale"],
    keywords: ["vpn", "wireguard", "tailscale", "tunnel"],
    stackPool: ["WireGuard", "Tailscale", "Headscale", "OpenVPN"],
  }),
  c("dns", "DNS Expert", "networking", "\u{1F310}", "#4FC3F7", {
    topics: ["dns", "dnsmasq", "coredns", "bind", "pihole"],
    keywords: ["dns", "nameserver", "domain name"],
    stackPool: ["CoreDNS", "Pi-hole", "BIND", "dnsmasq"],
  }),
  c("load-balancing", "Load Balancer Dev", "networking", "\u{2696}\u{FE0F}", "#7CB342", {
    topics: ["load-balancer", "nginx", "haproxy", "envoy", "traefik", "caddy"],
    keywords: ["load balanc", "nginx", "haproxy", "envoy", "traefik"],
    stackPool: ["Nginx", "HAProxy", "Envoy", "Traefik", "Caddy"],
  }),
  c("service-mesh", "Service Mesh Dev", "networking", "\u{1F578}\u{FE0F}", "#00ACC1", {
    topics: ["service-mesh", "istio", "linkerd", "cilium", "consul-connect"],
    keywords: ["service mesh", "istio", "linkerd"],
    stackPool: ["Istio", "Linkerd", "Cilium", "Consul"],
  }),
  c("cdn", "CDN Expert", "networking", "\u{1F30D}", "#FF8F00", {
    topics: ["cdn", "edge-computing", "caching", "cache-invalidation"],
    keywords: ["cdn", "content delivery", "edge caching"],
    stackPool: ["Cloudflare", "Fastly", "Akamai", "KeyCDN"],
  }),
  c("http-protocols", "HTTP Protocol Dev", "networking", "\u{1F310}", "#1565C0", {
    topics: ["http", "http2", "http3", "quic", "hpack"],
    keywords: ["http/2", "http/3", "quic", "http protocol"],
    stackPool: ["HTTP/3", "QUIC", "h2", "HPACK"],
  }),
];

// ---------------------------------------------------------------------------
// IOT group (5)
// ---------------------------------------------------------------------------

const IOT: Category[] = [
  c("raspberry-pi", "Raspberry Pi Tinkerer", "iot", "\u{1F353}", "#C51A4A", {
    topics: ["raspberry-pi", "raspberrypi", "rpi", "gpio"],
    keywords: ["raspberry pi", "gpio", "rpi"],
    stackPool: ["Raspberry Pi", "GPIO", "Pi OS", "SBC"],
  }),
  c("arduino", "Arduino Builder", "iot", "\u{1F4A1}", "#00979D", {
    topics: ["arduino", "esp32", "esp8266", "platformio"],
    keywords: ["arduino", "esp32", "esp8266"],
    stackPool: ["Arduino", "ESP32", "PlatformIO", "AVR"],
  }),
  c("home-automation", "Home Automation Dev", "iot", "\u{1F3E0}", "#4CAF50", {
    topics: ["home-automation", "home-assistant", "zigbee", "z-wave", "mqtt", "smart-home"],
    keywords: ["home automation", "home assistant", "smart home", "zigbee"],
    stackPool: ["Home Assistant", "Zigbee", "MQTT", "ESPHome"],
  }),
  c("robotics", "Robotics Dev", "iot", "\u{1F916}", "#607D8B", {
    topics: ["robotics", "ros", "ros2", "robot", "autonomous"],
    keywords: ["robotics", "ros", "autonomous robot"],
    stackPool: ["ROS", "ROS2", "Gazebo", "MoveIt"],
  }),
  c("3d-printing", "3D Printing Dev", "iot", "\u{1F3ED}", "#F57C00", {
    topics: ["3d-printing", "3dprinting", "klipper", "marlin", "octoprint", "openscad"],
    keywords: ["3d print", "klipper", "marlin", "openscad"],
    stackPool: ["Klipper", "Marlin", "OctoPrint", "OpenSCAD"],
  }),
];

// ---------------------------------------------------------------------------
// GAMEDEV group (5)
// ---------------------------------------------------------------------------

const GAMEDEV: Category[] = [
  c("godot", "Godot Dev", "gamedev", "\u{1F3AE}", "#478CBF", {
    topics: ["godot", "godot-engine", "gdscript", "godot4"],
    keywords: ["godot", "gdscript"],
    stackPool: ["Godot", "GDScript", "GDNative"],
  }),
  c("bevy", "Bevy Dev", "gamedev", "\u{1F3AE}", "#232326", {
    languages: ["Rust"],
    topics: ["bevy", "bevy-engine", "bevy-ecs"],
    keywords: ["bevy", "bevy engine"],
    stackPool: ["Bevy", "ECS", "Rust", "WGPU"],
  }),
  c("game-engines", "Game Engine Dev", "gamedev", "\u{1F3AE}", "#FF5722", {
    topics: ["game-engine", "unity", "unreal-engine", "game-development"],
    keywords: ["game engine", "unity", "unreal"],
    stackPool: ["Unity", "Unreal", "Custom Engine"],
  }),
  c("graphics-programming", "Graphics Programmer", "gamedev", "\u{1F3A8}", "#673AB7", {
    topics: ["graphics", "opengl", "vulkan", "webgpu", "wgpu", "shaders", "rendering"],
    keywords: ["graphics programming", "opengl", "vulkan", "webgpu", "shader"],
    stackPool: ["Vulkan", "WebGPU", "OpenGL", "WGSL", "GLSL"],
  }),
  c("game-ai", "Game AI Dev", "gamedev", "\u{1F9E0}", "#009688", {
    topics: ["game-ai", "pathfinding", "behavior-tree", "steering"],
    keywords: ["game ai", "pathfinding", "behavior tree"],
    stackPool: ["Behavior Trees", "A*", "NavMesh", "FSM"],
  }),
];

// ---------------------------------------------------------------------------
// ROLE group (15)
// ---------------------------------------------------------------------------

const ROLES: Category[] = [
  c("frontend-engineer", "Frontend Engineer", "role", "\u{1F3A8}", "#E91E63", {
    topics: ["frontend", "front-end", "ui-development", "css", "responsive"],
    keywords: ["frontend engineer", "ui developer", "front-end"],
    stackPool: ["HTML", "CSS", "JS", "Frameworks", "Design Systems"],
    titlePrefixes: ["Senior", "Staff", "Principal", "Lead"],
  }),
  c("backend-engineer", "Backend Engineer", "role", "\u{2699}\u{FE0F}", "#3F51B5", {
    topics: ["backend", "server-side", "api", "microservices"],
    keywords: ["backend engineer", "server-side", "api developer"],
    stackPool: ["APIs", "Databases", "Auth", "Queues"],
    titlePrefixes: ["Senior", "Staff", "Principal", "Lead"],
  }),
  c("devops-engineer", "DevOps Engineer", "role", "\u{1F504}", "#FF9800", {
    topics: ["devops", "ci-cd", "infrastructure", "automation", "gitops"],
    keywords: ["devops", "ci/cd", "infrastructure", "automation"],
    stackPool: ["CI/CD", "Docker", "K8s", "Terraform", "Ansible"],
    titlePrefixes: ["Senior", "Staff", "Principal", "Lead"],
  }),
  c("sre", "Site Reliability Engineer", "role", "\u{1F4DF}", "#FF5252", {
    topics: ["sre", "reliability", "uptime", "incident", "on-call", "observability"],
    keywords: ["sre", "site reliability", "uptime", "incident"],
    stackPool: ["SLOs", "Monitoring", "Incident Response", "Chaos"],
    titlePrefixes: ["Senior", "Staff", "Principal", "Lead"],
    taglines: ["Sleep is for the well-monitored.", "Uptime is a lifestyle.", "I break things so production doesn't."],
  }),
  c("platform-engineer", "Platform Engineer", "role", "\u{1F517}", "#7C4DFF", {
    topics: ["platform-engineering", "internal-developer-platform", "developer-experience", "dx"],
    keywords: ["platform engineer", "developer experience", "internal platform"],
    stackPool: ["IDP", "Backstage", "Port", "Kubernetes"],
    titlePrefixes: ["Senior", "Staff", "Principal", "Lead"],
    taglines: ["Your deploy pipeline is my canvas.", "I automate the automators.", "DX is my north star."],
  }),
  c("security-engineer", "Security Engineer", "role", "\u{1F6E1}\u{FE0F}", "#F44336", {
    topics: ["security", "appsec", "infosec", "security-engineering"],
    keywords: ["security engineer", "appsec", "infosec"],
    stackPool: ["SAST", "DAST", "WAF", "IAM", "Zero Trust"],
    titlePrefixes: ["Senior", "Staff", "Principal", "Lead"],
  }),
  c("data-engineer", "Data Engineer", "role", "\u{1F4CA}", "#FF7043", {
    topics: ["data-engineering", "data-pipeline", "big-data"],
    keywords: ["data engineer", "data pipeline", "big data"],
    stackPool: ["Spark", "Airflow", "dbt", "Kafka", "Flink"],
    titlePrefixes: ["Senior", "Staff", "Principal", "Lead"],
  }),
  c("ml-engineer", "ML Engineer", "role", "\u{1F9E0}", "#8B5CF6", {
    topics: ["machine-learning", "ml-engineering", "deep-learning", "model-training"],
    keywords: ["ml engineer", "machine learning", "deep learning"],
    stackPool: ["PyTorch", "TensorFlow", "MLflow", "Kubeflow"],
    titlePrefixes: ["Senior", "Staff", "Principal", "Lead"],
  }),
  c("solutions-architect", "Solutions Architect", "role", "\u{1F3D7}\u{FE0F}", "#FF9800", {
    topics: ["architecture", "system-design", "design-patterns", "microservices", "ddd"],
    keywords: ["solutions architect", "system design", "architecture"],
    stackPool: ["Architecture", "Design Patterns", "DDD", "CQRS"],
    titlePrefixes: ["Principal", "Senior", "Lead"],
    taglines: ["Architecture is a conversation.", "I translate between humans and machines.", "The bridge between what you want and what's possible."],
  }),
  c("cloud-architect", "Cloud Architect", "role", "\u{2601}\u{FE0F}", "#40C4FF", {
    topics: ["cloud-architecture", "multi-cloud", "cloud-native", "hybrid-cloud"],
    keywords: ["cloud architect", "multi-cloud", "cloud-native"],
    stackPool: ["Multi-cloud", "Cloud Native", "Well-Architected", "Landing Zones"],
    titlePrefixes: ["Principal", "Senior", "Lead"],
    taglines: ["The cloud is just someone else's bare metal.", "Distributed by design.", "Multi-cloud native."],
  }),
  c("systems-programmer", "Systems Programmer", "role", "\u{2699}\u{FE0F}", "#4A90D9", {
    languages: ["C", "C++", "Rust", "Zig"],
    topics: ["systems-programming", "low-level", "performance"],
    keywords: ["systems programming", "low-level", "close to the metal"],
    stackPool: ["C", "Rust", "Zig", "Assembly", "POSIX"],
    titlePrefixes: ["Principal", "Staff", "Senior"],
    taglines: ["Closer to the metal than your bootloader.", "I speak fluent syscall.", "The kernel whisperer."],
  }),
  c("mobile-developer", "Mobile Developer", "role", "\u{1F4F1}", "#02569B", {
    topics: ["mobile", "ios", "android", "react-native", "flutter", "mobile-development"],
    keywords: ["mobile developer", "ios", "android", "react native"],
    stackPool: ["iOS", "Android", "Flutter", "React Native"],
    titlePrefixes: ["Senior", "Staff", "Principal", "Lead"],
  }),
  c("open-source-maintainer", "Open Source Maintainer", "role", "\u{1F4E6}", "#2196F3", {
    topics: ["open-source", "oss", "maintainer", "contributor", "hacktoberfest"],
    keywords: ["open source", "maintainer", "contributor"],
    stackPool: ["GitHub", "Issues", "PRs", "Releases", "CI/CD"],
    titlePrefixes: [""],
    taglines: ["Merge or close, there is no maybe.", "Issues are my inbox.", "Open source is a lifestyle."],
  }),
  c("technical-writer", "Technical Writer", "role", "\u{270D}\u{FE0F}", "#795548", {
    topics: ["documentation", "technical-writing", "docs", "readme", "docusaurus", "mdx"],
    keywords: ["technical writ", "documentation", "docs", "readme"],
    stackPool: ["Docusaurus", "MDX", "VitePress", "Mintlify"],
    titlePrefixes: ["Senior", "Staff", "Principal"],
  }),
  c("developer-advocate", "Developer Advocate", "role", "\u{1F4E3}", "#00BCD4", {
    topics: ["developer-relations", "devrel", "developer-experience", "developer-advocacy"],
    keywords: ["developer advocate", "devrel", "developer relations"],
    stackPool: ["Talks", "Blogs", "Demos", "Community"],
    titlePrefixes: ["Senior", "Staff", "Principal"],
  }),
];

// ---------------------------------------------------------------------------
// INDUSTRY group (8)
// ---------------------------------------------------------------------------

const INDUSTRIES: Category[] = [
  c("fintech", "Fintech Dev", "industry", "\u{1F4B0}", "#00C853", {
    topics: ["fintech", "payments", "banking", "stripe", "crypto", "defi"],
    keywords: ["fintech", "payments", "banking", "financial"],
    stackPool: ["Stripe", "Plaid", "Ledger", "Compliance"],
  }),
  c("healthtech", "Healthtech Dev", "industry", "\u{1F3E5}", "#E53935", {
    topics: ["healthtech", "health", "medical", "fhir", "hl7", "healthcare"],
    keywords: ["healthtech", "healthcare", "medical", "fhir"],
    stackPool: ["FHIR", "HL7", "HIPAA", "EHR"],
  }),
  c("ecommerce", "E-commerce Dev", "industry", "\u{1F6D2}", "#FF6F00", {
    topics: ["ecommerce", "e-commerce", "shopify", "stripe", "commerce"],
    keywords: ["ecommerce", "e-commerce", "shopify"],
    stackPool: ["Shopify", "Stripe", "Medusa", "Saleor"],
  }),
  c("saas", "SaaS Builder", "industry", "\u{1F4BB}", "#1565C0", {
    topics: ["saas", "software-as-a-service", "multi-tenant", "subscription"],
    keywords: ["saas", "multi-tenant", "subscription"],
    stackPool: ["SaaS", "Multi-tenant", "Billing", "Auth"],
  }),
  c("web3", "Web3 Dev", "industry", "\u{26D3}\u{FE0F}", "#F7931A", {
    topics: ["web3", "blockchain", "ethereum", "solidity", "smart-contracts", "defi", "nft"],
    keywords: ["web3", "blockchain", "ethereum", "smart contract"],
    stackPool: ["Ethereum", "Solidity", "Hardhat", "IPFS"],
  }),
  c("gaming-industry", "Gaming Industry Dev", "industry", "\u{1F3AE}", "#9C27B0", {
    topics: ["gaming", "game-development", "indie-game", "multiplayer"],
    keywords: ["game development", "indie game", "multiplayer"],
    stackPool: ["Game Dev", "Multiplayer", "Netcode", "ECS"],
  }),
  c("media-tech", "Media Tech Dev", "industry", "\u{1F3AC}", "#FF4081", {
    topics: ["media", "streaming", "video", "audio", "ffmpeg", "transcoding"],
    keywords: ["media tech", "streaming", "video", "audio", "transcoding"],
    stackPool: ["FFmpeg", "HLS", "WebRTC", "Mux"],
  }),
  c("govtech", "GovTech Dev", "industry", "\u{1F3DB}\u{FE0F}", "#37474F", {
    topics: ["govtech", "government", "civic-tech", "open-data", "e-government"],
    keywords: ["govtech", "government", "civic tech", "open data"],
    stackPool: ["Open Data", "CKAN", "GDS", "Accessibility"],
  }),
];

// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------

export const CATEGORY_SEEDS: Category[] = [
  ...LANGUAGES,
  ...FRAMEWORKS,
  ...PLATFORMS,
  ...CLOUDS,
  ...DATABASES,
  ...AI_ML,
  ...SECURITY,
  ...SYSTEMS,
  ...LINUX,
  ...CLI,
  ...EDITORS,
  ...WEB,
  ...DATA,
  ...TESTING,
  ...OBSERVABILITY,
  ...NETWORKING,
  ...IOT,
  ...GAMEDEV,
  ...ROLES,
  ...INDUSTRIES,
];

/** Lookup a category by ID. */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORY_SEEDS.find((c) => c.id === id);
}

/** Get all categories in a group. */
export function getCategoriesByGroup(groupName: string): Category[] {
  return CATEGORY_SEEDS.filter((c) => c.groupName === groupName);
}
