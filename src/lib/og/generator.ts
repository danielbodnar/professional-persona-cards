/**
 * OG image generation pipeline: SVG template -> PNG via satori + resvg-wasm.
 * Stores generated images in R2 with content-type metadata.
 *
 * Pipeline:
 *   1. Check R2 for an existing image (cache hit)
 *   2. Generate SVG string using the OG template
 *   3. Convert SVG to PNG using resvg-wasm
 *   4. Store the PNG in R2 with metadata
 *
 * Reference: spec lines 983-1006.
 *
 * NOTE: satori converts JSX/React-like elements to SVG, but since we already
 * produce raw SVG in template.ts, we use resvg-wasm directly for SVG->PNG.
 * If satori is needed in the future (e.g., for font rendering), it can be
 * added as an intermediate step.
 */

import { renderOGTemplate } from "./template";
import type { OGPersona, OGRadarAxis } from "./template";
import type { ProfileRow, PersonaRow } from "../db/types";

// resvg-wasm is lazily imported to allow the WASM module to be loaded once.
// In Cloudflare Workers, WASM modules can be imported statically.
// The consumer should ensure `@resvg/resvg-wasm` is installed.
let resvgInitialized = false;

/**
 * Initialize the resvg-wasm module. Call once before first render.
 * Safe to call multiple times (idempotent).
 */
async function ensureResvgInitialized(): Promise<void> {
  if (resvgInitialized) return;
  try {
    const { initWasm } = await import("@resvg/resvg-wasm");
    // In Workers, the WASM binary is typically imported as a module.
    // The init function may accept a URL, ArrayBuffer, or WebAssembly.Module.
    // When bundled with wrangler, just calling initWasm() should work if the
    // WASM file is correctly referenced in the build.
    await initWasm();
    resvgInitialized = true;
  } catch {
    // If resvg-wasm fails to init (e.g., missing dep), fall back to storing
    // raw SVG. This allows the system to work in development without WASM.
    console.warn("[og/generator] resvg-wasm initialization failed; PNG generation will be skipped.");
  }
}

/**
 * Convert an SVG string to PNG bytes using resvg-wasm.
 * Returns null if resvg is unavailable.
 */
async function svgToPng(svg: string): Promise<Uint8Array | null> {
  await ensureResvgInitialized();

  if (!resvgInitialized) return null;

  try {
    const { Resvg } = await import("@resvg/resvg-wasm");
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width" as const, value: 1200 },
    });
    const pngData = resvg.render();
    return pngData.asPng();
  } catch (err) {
    console.error("[og/generator] SVG to PNG conversion failed:", err);
    return null;
  }
}

/**
 * Generate (or retrieve cached) OG image for a profile.
 *
 * @param profile   - Profile row from D1
 * @param personas  - Persona rows from D1 (with id stripped is fine)
 * @param env       - Worker Env with R2 binding
 * @returns         - PNG bytes (Uint8Array) or SVG string as fallback
 */
export async function generateOGImage(
  profile: ProfileRow,
  personas: Array<Omit<PersonaRow, "id"> | PersonaRow>,
  env: { R2: R2Bucket },
): Promise<Uint8Array | string> {
  const key = `og/${profile.username}.png`;

  // 1. Check R2 for existing image
  const existing = await env.R2.get(key);
  if (existing) {
    const arrayBuf = await existing.arrayBuffer();
    return new Uint8Array(arrayBuf);
  }

  // 2. Map PersonaRow to OGPersona
  const ogPersonas: OGPersona[] = personas.map((p) => ({
    persona_id: p.persona_id,
    title: p.title,
    icon: p.icon || "",
    accent_color: p.accent_color,
    confidence: p.confidence,
  }));

  // 3. Generate SVG
  const svg = renderOGTemplate(profile, ogPersonas);

  // 4. Convert to PNG
  const png = await svgToPng(svg);

  if (png) {
    // 5. Store PNG in R2
    await env.R2.put(key, png, {
      httpMetadata: { contentType: "image/png" },
      customMetadata: {
        username: profile.username,
        generatedAt: new Date().toISOString(),
      },
    });
    return png;
  }

  // Fallback: store SVG in R2 if PNG conversion is unavailable
  const svgKey = `og/${profile.username}.svg`;
  await env.R2.put(svgKey, svg, {
    httpMetadata: { contentType: "image/svg+xml" },
    customMetadata: {
      username: profile.username,
      generatedAt: new Date().toISOString(),
    },
  });
  return svg;
}

/**
 * Delete the cached OG image for a user (call on profile refresh).
 */
export async function invalidateOGImage(
  username: string,
  env: { R2: R2Bucket },
): Promise<void> {
  await Promise.all([
    env.R2.delete(`og/${username}.png`),
    env.R2.delete(`og/${username}.svg`),
  ]);
}
