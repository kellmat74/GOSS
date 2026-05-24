#!/usr/bin/env node
/**
 * Walk docs/BWN/play-aids/*.md and produce src/data/blue-water-navy/play-aid-blocks.json.
 *
 * Each H2 in a play-aid file becomes one addressable block keyed `pa<N>:<slug>`.
 * Slug convention: take H2 text, strip after " — " or " - " (with spaces) or " (",
 * strip trailing ":./,", lowercase, kebab-case.
 *
 * Duplicate slugs (PA-6 has two `## SAM Suppression (SEAD)` and two `## SAM Attack`
 * H2s for bombing vs cruise contexts) are auto-disambiguated by context-keyword
 * scan of the nearest preceding non-duplicate H2.
 *
 * The block `body` is the raw markdown between this H2 and the next H2/EOF (H3+ headings preserved).
 * The block `html` is pre-rendered with marked so React doesn't need a runtime markdown parser.
 *
 * Run: `node scripts/merge-bwn-play-aids.mjs`
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PLAY_AIDS_DIR = join(ROOT, "docs/BWN/play-aids");
const OUTPUT_PATH = join(ROOT, "src/data/blue-water-navy/play-aid-blocks.json");

function slugify(h2) {
  let s = h2;
  // Strip parenthetical asides inline: "SAM Suppression (SEAD) — vs Bombing" → "SAM Suppression — vs Bombing"
  s = s.replace(/\s*\([^)]*\)/g, "");
  // Strip after hyphen-with-spaces " - " (e.g. "Facility Damage - Effects cumulative" → "Facility Damage")
  // Keep em-dash separator content (" — vs Bombing") since it's used for explicit disambiguation.
  s = s.split(/ - /)[0];
  // Trailing punctuation
  s = s.replace(/[:.,]+$/, "").trim();
  // Lowercase + kebab. Em-dash becomes whitespace then dash.
  s = s
    .toLowerCase()
    .replace(/[—–]/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s;
}

/**
 * Extract trailing rule-ref paren from an H2 title and return
 * { displayTitle, ruleRefs }. Only strips a paren if the entire content
 * is a digit-dot section ref list, e.g. "(7.2)" or "(5.2.1, 7.3)" — leaves
 * non-numeric parens like "(SEAD)" alone.
 */
function extractRuleRefs(h2) {
  const TRAILING = /\s*\((\d+(?:\.\d+){1,3}(?:[a-z])?(?:\s*,\s*\d+(?:\.\d+){1,3}(?:[a-z])?)*)\)\s*$/;
  const m = h2.match(TRAILING);
  if (!m) return { displayTitle: h2.trim(), ruleRefs: [] };
  const refs = m[1].split(/\s*,\s*/).map((r) => r.trim()).filter(Boolean);
  return { displayTitle: h2.replace(TRAILING, "").trim(), ruleRefs: refs };
}

function processFile(filename) {
  const md = readFileSync(join(PLAY_AIDS_DIR, filename), "utf-8");
  const paMatch = filename.match(/^0(\d)-/);
  if (!paMatch) return [];
  const paNumber = parseInt(paMatch[1], 10);
  const lines = md.split("\n");

  // Find all H2 boundaries
  const h2s = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^## (.+)$/);
    if (m) h2s.push({ line: i, title: m[1].trim() });
  }

  // Build blocks
  const blocks = [];
  const seenSlugs = new Set();
  for (let i = 0; i < h2s.length; i++) {
    const { line, title } = h2s[i];
    const slug = slugify(title);
    if (!slug) continue;

    const key = `pa${paNumber}:${slug}`;

    if (seenSlugs.has(key)) {
      console.error(`COLLISION inside ${filename}: "${title}" produces slug "${key}" — already taken. Disambiguate the H2 title (e.g. add " — vs Foo" suffix).`);
      process.exit(1);
    }
    seenSlugs.add(key);

    // Body: lines between this H2 and the next H2 (or EOF)
    const endLine = i + 1 < h2s.length ? h2s[i + 1].line : lines.length;
    const body = lines
      .slice(line + 1, endLine)
      .join("\n")
      .replace(/^---\s*$/gm, "") // strip horizontal rules separating sections
      .trim();

    const { displayTitle, ruleRefs } = extractRuleRefs(title);
    blocks.push({ key, paNumber, title: displayTitle, body, ruleRefs });
  }
  return blocks;
}

function main() {
  const files = readdirSync(PLAY_AIDS_DIR)
    .filter((f) => /^0[2-8]-.*\.md$/.test(f))
    .sort();

  const out = {};
  for (const f of files) {
    const blocks = processFile(f);
    for (const b of blocks) {
      if (out[b.key]) {
        console.error(`COLLISION: ${b.key} appears in both ${out[b.key].sourceFile} and ${f}`);
        process.exit(1);
      }
      out[b.key] = {
        paNumber: b.paNumber,
        title: b.title,
        ruleRefs: b.ruleRefs,
        body: b.body,
        html: marked.parse(b.body),
        sourceFile: f,
      };
    }
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(out).length} blocks to ${OUTPUT_PATH}`);
}

main();
