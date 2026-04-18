#!/usr/bin/env node
// Merges src/data/goss/learn-fragments/*.json into src/data/goss/learn.json.
// Fragments are merged in filename order (01-, 02-, ...). Each fragment has
// shape { chapters: [...] }. Output is a single { chapters: [...all chapters...] }.
//
// Warns on:
// - Duplicate chapter ids across fragments
// - Invalid JSON
// - Missing required fields (id, title, intro, decisions)

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const fragDir = join(repoRoot, "src/data/goss/learn-fragments");
const outFile = join(repoRoot, "src/data/goss/learn.json");

const files = readdirSync(fragDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const allChapters = [];
const seenIds = new Set();

for (const f of files) {
  const path = join(fragDir, f);
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    console.error(`✗ ${f}: invalid JSON — ${e.message}`);
    process.exit(1);
  }
  if (!parsed.chapters || !Array.isArray(parsed.chapters)) {
    console.error(`✗ ${f}: missing "chapters" array`);
    process.exit(1);
  }

  let decisionCount = 0;
  for (const ch of parsed.chapters) {
    if (!ch.id || !ch.title || !ch.intro || !Array.isArray(ch.decisions)) {
      console.error(`✗ ${f}: chapter missing required fields: ${JSON.stringify(ch).slice(0, 80)}`);
      process.exit(1);
    }
    if (seenIds.has(ch.id)) {
      console.warn(`⚠ ${f}: duplicate chapter id "${ch.id}" — skipping`);
      continue;
    }
    seenIds.add(ch.id);
    decisionCount += ch.decisions.length;
    allChapters.push(ch);
  }

  console.log(`✓ ${f}: ${parsed.chapters.length} chapter(s), ${decisionCount} decision(s)`);
}

const merged = { chapters: allChapters };
writeFileSync(outFile, JSON.stringify(merged, null, 2) + "\n");

const totalDecisions = allChapters.reduce((n, c) => n + c.decisions.length, 0);
console.log(`\n→ Wrote ${outFile}`);
console.log(`  ${allChapters.length} chapters, ${totalDecisions} decisions total`);
