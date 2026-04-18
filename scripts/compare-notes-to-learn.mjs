#!/usr/bin/env node
/**
 * Generates a side-by-side comparison of:
 *   - LEFT:  pedagogical "notes" arrays in sequence.json (existing tips)
 *   - RIGHT: Learn chapter/decision content that covers the same SoP position
 *
 * For each phase/sub-phase/segment that has notes, writes:
 *   - The notes as bullets
 *   - The matching Learn chapter title + decision titles covering that position
 *
 * Output: docs/notes-vs-learn-comparison.md
 *
 * Usage:
 *   node scripts/compare-notes-to-learn.mjs
 *
 * How to use the output:
 *   Read the generated doc top to bottom. For each position that has notes,
 *   verify every note is captured (or intentionally dropped) in the listed
 *   Learn decisions. Strike through notes that are covered. Anything left
 *   uncovered tells you what to migrate (or keep as Steps tips) before deleting.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sequence = JSON.parse(
  readFileSync(join(root, "src/data/goss/sequence.json"), "utf8"),
);
const learn = JSON.parse(
  readFileSync(join(root, "src/data/goss/learn.json"), "utf8"),
);

// Normalize allied-/axis- prefix and turn-context suffix so mirrored items match
const normalize = (id) =>
  id
    .replace(/^(allied|axis|enemy)-/, "")
    .replace(/-in-(allied|axis)-turn$/, "")
    .replace(/-phase$/, "")
    .replace(/-segment$/, "");

/** Find the Learn chapter whose phaseRef best matches a given SoP id. */
function findChapter(sopId) {
  if (!sopId) return null;
  const exact = learn.chapters.find((c) => c.phaseRef === sopId);
  if (exact) return exact;
  const normTarget = normalize(sopId);
  return learn.chapters.find(
    (c) => c.phaseRef && normalize(c.phaseRef) === normTarget,
  ) ?? null;
}

/** Walk the sequence tree; collect every node that has notes. */
function collectNodes() {
  const rows = [];
  for (const phase of sequence.phases) {
    if (phase.notes && phase.notes.length > 0) {
      rows.push({
        level: "Phase",
        id: phase.id,
        name: phase.name,
        ruleRef: phase.ruleRef,
        notes: phase.notes,
        parentIds: [],
      });
    }
    for (const sub of phase.subPhases ?? []) {
      if (sub.notes && sub.notes.length > 0) {
        rows.push({
          level: "Sub-Phase",
          id: sub.id,
          name: sub.name,
          ruleRef: sub.ruleRef,
          notes: sub.notes,
          parent: phase.name,
          parentIds: [phase.id],
        });
      }
      for (const seg of sub.subPhases ?? []) {
        if (seg.notes && seg.notes.length > 0) {
          rows.push({
            level: "Segment",
            id: seg.id,
            name: seg.name,
            ruleRef: seg.ruleRef,
            notes: seg.notes,
            parent: `${phase.name} › ${sub.name}`,
            parentIds: [sub.id, phase.id],
          });
        }
      }
    }
  }
  return rows;
}

/** Find chapter for this id, walking up to parent ids if no direct match. */
function findChapterWithFallback(row) {
  const direct = findChapter(row.id);
  if (direct) return { chapter: direct, via: "direct" };
  for (const pid of row.parentIds) {
    const match = findChapter(pid);
    if (match) return { chapter: match, via: `parent (${pid})` };
  }
  return { chapter: null, via: null };
}

const rows = collectNodes();

// ---------------------------------------------------------------------------
// Markdown output
// ---------------------------------------------------------------------------

const lines = [];
lines.push("# Notes vs Learn — Coverage Comparison");
lines.push("");
lines.push(
  "For each SoP position with existing pedagogical notes (`sequence.json`), " +
  "this doc pairs them with the matching Learn chapter + decisions. Review each " +
  "section and decide whether every note is captured elsewhere before deleting " +
  "notes from `sequence.json`.",
);
lines.push("");
lines.push("**Key:**");
lines.push("- ✅ = Learn chapter exists for this position");
lines.push("- ⚠️  = No matching Learn chapter (note would be lost if deleted)");
lines.push("");
lines.push(`**Stats:** ${rows.length} positions with notes; ${learn.chapters.length} Learn chapters; ${learn.chapters.reduce((n, c) => n + c.decisions.length, 0)} decisions.`);
lines.push("");
lines.push("---");
lines.push("");

let covered = 0;
let uncovered = 0;

for (const row of rows) {
  const { chapter, via } = findChapterWithFallback(row);
  const marker = chapter ? "✅" : "⚠️";
  if (chapter) covered++; else uncovered++;

  lines.push(`## ${marker} ${row.level}: ${row.name}`);
  if (row.ruleRef) lines.push(`**Rule:** §${row.ruleRef}  `);
  lines.push(`**ID:** \`${row.id}\`  `);
  if (row.parent) lines.push(`**Parent:** ${row.parent}  `);
  lines.push("");

  lines.push("### Existing notes (in sequence.json)");
  lines.push("");
  for (const note of row.notes) {
    lines.push(`- ${note}`);
  }
  lines.push("");

  lines.push("### Matching Learn content");
  lines.push("");
  if (chapter) {
    lines.push(`**Chapter:** ${chapter.title} (id: \`${chapter.id}\`, match: *${via}*)`);
    lines.push("");
    lines.push(`*Intro:* ${chapter.intro}`);
    lines.push("");
    lines.push("**Decisions in this chapter:**");
    for (const d of chapter.decisions) {
      const firstProse = d.blocks.find((b) => b.kind === "prose");
      const preview = firstProse
        ? firstProse.text.split("\n")[0].replace(/\*\*/g, "").slice(0, 140)
        : "(no prose preview)";
      lines.push(`- **${d.title}** — *${d.when}*`);
      lines.push(`  > ${preview}${preview.length >= 140 ? "…" : ""}`);
    }
  } else {
    lines.push("_**No Learn chapter covers this position.** Notes here are not yet migrated._");
  }
  lines.push("");
  lines.push("---");
  lines.push("");
}

lines.push("## Summary");
lines.push("");
lines.push(`- ${covered} positions with a matching Learn chapter`);
lines.push(`- ${uncovered} positions WITHOUT a matching Learn chapter (review these first)`);
lines.push("");
lines.push("### Suggested workflow");
lines.push("");
lines.push("1. Scan the ⚠️ positions above — decide if their notes should be: migrated into an existing Learn chapter, made into a new Learn chapter, or kept in Steps as a Tips section.");
lines.push("2. For ✅ positions, read each note and the chapter's decision previews side-by-side. If every note's substance is captured in the decisions, the notes can be deleted from `sequence.json`.");
lines.push("3. When ready, delete the `notes` arrays from `sequence.json` (keep the field as `[]` to avoid breaking readers).");
lines.push("4. Remove the Tips-rendering block from `PhaseStepper.tsx`.");

const out = join(root, "docs/notes-vs-learn-comparison.md");
writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${out}`);
console.log(`${covered} covered, ${uncovered} uncovered, ${rows.length} total positions with notes.`);
