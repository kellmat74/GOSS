#!/usr/bin/env node
/**
 * Walk docs/BWN/actions/act-*.md (skipping CHANGES-*.md) and produce the rich
 * src/data/blue-water-navy/actions.json.
 *
 * Each action markdown has:
 *   - YAML frontmatter (id, title, category, side, usage, cost, ruleRefs, seeAlso)
 *   - ## When does this come up?    → content.whenItComesUp (HTML)
 *   - ## Procedure                   → content.procedure (steps with block refs)
 *   - ## See also                    → content.seeAlso (links + rules)
 *   - ## Why and what to watch for   → content.whyAndWatchFor (HTML; empty for now)
 *
 * Each {{PA-BLOCK: pa<N>:<slug> — Label}} is extracted from procedure step text
 * and validated against play-aid-blocks.json.
 *
 * Output preserves the existing CardCategory shape so ActionsPanel can ingest
 * directly: category groups with cards[], plus a new `content` field per card.
 *
 * Run: `node scripts/merge-bwn-actions.mjs`  (depends on play-aid-blocks.json
 * having been built first via merge-bwn-play-aids.mjs).
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ACTIONS_DIR = join(ROOT, "docs/BWN/actions");
const BLOCKS_PATH = join(ROOT, "src/data/blue-water-navy/play-aid-blocks.json");
const OUTPUT_PATH = join(ROOT, "src/data/blue-water-navy/actions.json");

if (!existsSync(BLOCKS_PATH)) {
  console.error(`play-aid-blocks.json not found. Run merge-bwn-play-aids.mjs first.`);
  process.exit(1);
}
const blocks = JSON.parse(readFileSync(BLOCKS_PATH, "utf-8"));
const blockKeys = new Set(Object.keys(blocks));

const PA_BLOCK_RE = /\{\{PA-BLOCK:\s*([a-z0-9:-]+)\s*[—–-]\s*([^}]+?)\}\}/g;

/** Parse YAML frontmatter (limited; same as build-bwn-print-pdf.mjs). */
function splitFrontmatter(md) {
  if (!md.startsWith("---\n")) return { frontmatter: {}, body: md };
  const end = md.indexOf("\n---\n", 4);
  if (end === -1) return { frontmatter: {}, body: md };
  const raw = md.slice(4, end);
  const body = md.slice(end + 5);
  const frontmatter = {};
  let currentList = null;
  for (const line of raw.split("\n")) {
    if (/^\s*-\s+/.test(line) && currentList) {
      currentList.push(line.replace(/^\s*-\s+"?(.*?)"?$/, "$1"));
    } else {
      const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
      if (m) {
        const [, key, val] = m;
        if (val === "") {
          currentList = [];
          frontmatter[key] = currentList;
        } else {
          currentList = null;
          frontmatter[key] = val.replace(/^"(.*)"$/, "$1");
        }
      }
    }
  }
  return { frontmatter, body };
}

/** Split markdown body into named H2 sections. */
function splitSections(body) {
  const sections = {};
  const lines = body.split("\n");
  let currentHeading = null;
  let buf = [];
  const flush = () => {
    if (currentHeading) sections[currentHeading] = buf.join("\n").trim();
    buf = [];
  };
  for (const line of lines) {
    const m = line.match(/^## (.+)$/);
    if (m) {
      flush();
      currentHeading = m[1].trim();
    } else if (currentHeading) {
      buf.push(line);
    }
  }
  flush();
  return sections;
}

/** Parse a Procedure section into stepwise objects, extracting block refs. */
function parseProcedure(procedureMd, sourceFile) {
  const steps = [];
  if (!procedureMd) return steps;
  // Split into numbered list items.
  const lines = procedureMd.split("\n");
  let buf = [];
  const flushStep = () => {
    if (buf.length === 0) return;
    const stepRaw = buf.join("\n");
    const stepBlocks = [];
    let stepText = stepRaw.replace(PA_BLOCK_RE, (_, slug, label) => {
      slug = slug.trim();
      label = label.trim();
      if (!blockKeys.has(slug)) {
        console.warn(`  [warn] ${sourceFile}: unresolved block ref ${slug}`);
      }
      stepBlocks.push({ slug, label });
      return ""; // remove the placeholder from the step prose
    });
    // Strip leading "1. " etc. and trim
    stepText = stepText.replace(/^\s*\d+\.\s*/, "").trim();
    steps.push({
      text: stepText,
      html: marked.parse(stepText),
      blocks: stepBlocks,
    });
    buf = [];
  };
  for (const line of lines) {
    if (/^\s*\d+\.\s/.test(line)) {
      flushStep();
      buf = [line];
    } else {
      buf.push(line);
    }
  }
  flushStep();
  return steps;
}

/** Parse a See-Also section into actions, rule refs, etc. */
function parseSeeAlso(seeAlsoMd) {
  if (!seeAlsoMd) return { actions: [], ruleRefs: [] };
  const out = { actions: [], ruleRefs: [] };
  const lines = seeAlsoMd.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    // Action link: "- [Title](./act-id.md)"
    const aMatch = line.match(/^-\s*\[([^\]]+)\]\(\.\/(act-[^)]+)\.md\)/);
    if (aMatch) {
      out.actions.push({ id: aMatch[2], title: aMatch[1] });
      continue;
    }
    // Rule refs: "- Related rules: (5.1), (5.2.1)"
    const rMatch = line.match(/Related rules:\s*(.+)$/i);
    if (rMatch) {
      const refs = [...rMatch[1].matchAll(/\(([\d.]+)\)/g)].map((m) => m[1]);
      out.ruleRefs.push(...refs);
    }
  }
  return out;
}

/** Type-mapper for the existing GameCard shape so the renderer stays compatible. */
function deriveType(usage) {
  if (usage === "active") return "use-when-active";
  if (usage === "anytime") return "use-anytime";
  return "operations-event";
}

function processAction(filename) {
  const md = readFileSync(join(ACTIONS_DIR, filename), "utf-8");
  const { frontmatter, body } = splitFrontmatter(md);
  const sections = splitSections(body);

  const procedure = parseProcedure(sections["Procedure"], filename);
  const seeAlso = parseSeeAlso(sections["See also"]);

  const whenItComesUp = sections["When does this come up?"] || "";
  const whyAndWatchFor = sections["Why and what to watch for"] || "";

  const card = {
    id: frontmatter.id,
    cardNumber: "—",
    side: frontmatter.side || "neutral",
    title: frontmatter.title,
    type: deriveType(frontmatter.usage),
    usage: frontmatter.usage || "action",
    text: whenItComesUp.replace(/\n+/g, " ").slice(0, 240), // short blurb for list view
    cost: frontmatter.cost && frontmatter.cost !== "null" ? parseInt(frontmatter.cost, 10) : undefined,
    ruleRefs: frontmatter.ruleRefs || [],
    category: frontmatter.category,
    content: {
      whenItComesUp,
      whenItComesUpHtml: marked.parse(whenItComesUp),
      procedure,
      seeAlso,
      whyAndWatchFor: whyAndWatchFor.replace(/<!-- COACH-PASS -->/g, "").trim(),
      whyAndWatchForHtml: marked.parse(whyAndWatchFor.replace(/<!-- COACH-PASS -->/g, "").trim()),
    },
  };

  // Skip undefined cost (so it's omitted in JSON, not null)
  if (card.cost === undefined || isNaN(card.cost)) delete card.cost;

  return card;
}

function main() {
  const files = readdirSync(ACTIONS_DIR)
    .filter((f) => f.startsWith("act-") && f.endsWith(".md"))
    .sort();

  const cards = files.map(processAction);

  // Group by category, preserving the existing CardCategory shape.
  const categoryMeta = {
    "ship-actions": "Ship Actions",
    "sub-actions": "Submarine Actions",
    "air-actions": "Air Unit Actions",
    "misc-actions": "Miscellaneous Actions",
  };

  const groups = {};
  for (const cat of Object.keys(categoryMeta)) {
    groups[cat] = { id: cat, label: categoryMeta[cat], cards: [] };
  }
  for (const c of cards) {
    const cat = c.category || "misc-actions";
    if (!groups[cat]) {
      groups[cat] = { id: cat, label: cat, cards: [] };
    }
    delete c.category; // category is on the group, not the card
    groups[cat].cards.push(c);
  }

  const out = Object.values(groups).filter((g) => g.cards.length > 0);
  writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${cards.length} actions across ${out.length} categories to ${OUTPUT_PATH}`);
}

main();
