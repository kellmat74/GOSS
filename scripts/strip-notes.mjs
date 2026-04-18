#!/usr/bin/env node
/**
 * Strip pedagogical `notes` arrays from sequence.json and `appendNotes`
 * patches from all sequence-overlay.json files. The `notes` field remains
 * (as []) to preserve the schema shape; agents rendering sequence data
 * will simply see empty arrays.
 *
 * Tips now live in the Learn tab only. Run once per release after verifying
 * coverage via docs/notes-vs-learn-comparison.md.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

let cleared = 0;

// --- 1. Base sequence.json: walk tree, blank notes --------------------------
const seqPath = join(root, "src/data/goss/sequence.json");
const seq = JSON.parse(readFileSync(seqPath, "utf8"));
for (const phase of seq.phases) {
  if (phase.notes?.length) { cleared += phase.notes.length; phase.notes = []; }
  for (const sub of phase.subPhases ?? []) {
    if (sub.notes?.length) { cleared += sub.notes.length; sub.notes = []; }
    for (const seg of sub.subPhases ?? []) {
      if (seg.notes?.length) { cleared += seg.notes.length; seg.notes = []; }
    }
  }
}
writeFileSync(seqPath, JSON.stringify(seq, null, 2) + "\n");
console.log(`sequence.json: cleared ${cleared} notes`);

// --- 2. Scenario overlays: remove appendNotes from each modification --------
const overlays = [
  "src/data/goss/war/sequence-overlay.json",
  "src/data/goss/hurtgen/sequence-overlay.json",
  "src/data/goss/lucky-forward/sequence-overlay.json",
  "src/data/goss/atlantic-wall/sequence-overlay.json",
];

function stripAppendNotesFromMod(mod) {
  let n = 0;
  if (mod.patch?.appendNotes?.length) {
    n += mod.patch.appendNotes.length;
    delete mod.patch.appendNotes;
    if (Object.keys(mod.patch).length === 0) delete mod.patch;
  }
  // Inserted items (add action) may also have notes
  if (mod.item?.notes?.length) { n += mod.item.notes.length; mod.item.notes = []; }
  return n;
}

for (const rel of overlays) {
  const path = join(root, rel);
  const data = JSON.parse(readFileSync(path, "utf8"));
  let stripped = 0;
  for (const mod of data.modifications ?? []) stripped += stripAppendNotesFromMod(mod);
  for (const [, override] of Object.entries(data.scenarioOverrides ?? {})) {
    for (const mod of override.modifications ?? []) stripped += stripAppendNotesFromMod(mod);
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`${rel}: stripped ${stripped} appendNotes/item.notes entries`);
}

console.log("\nDone.");
