#!/usr/bin/env node
/**
 * Merge OCR card fragments into cards.json.
 *
 * Reads per-physical-card OCR entries from:
 *   src/data/blue-water-navy/_fragments/cards-{nato,soviet}-{range}.json
 *
 * Each OCR entry has shape:
 *   {
 *     "file": "NCard-Jan18- (1).png",
 *     "cardNumber": "1",
 *     "side": "nato",
 *     "operationsEvent": { "title", "cost", "text", "notes"? },
 *     "reactionEvent":   { "title", "cost", "text", "notes"? }
 *   }
 *
 * Each physical card carries TWO printed events. The same event title can
 * appear on multiple cards (e.g. "Stealthy Approach" is on Soviet 3 and 53).
 * We consolidate by (side + slot + title) so the Cards tab shows one entry per
 * unique event, with `cardNumber` formatted "3/53" when the event repeats.
 *
 * Existing src/data/blue-water-navy/cards.json carries designer-clarification
 * entries seeded from `bwn_card_clarifications_v2.pdf`. We merge those by
 * matching on (side, title): clarification text is preserved and attached to
 * the consolidated entry. Existing entries without a matching OCR event
 * survive unchanged.
 *
 * Output: src/data/blue-water-navy/cards.json with two CardCategory entries
 * (events-soviet, events-nato), each populated with the unified card list.
 *
 * Usage: node scripts/merge-bwn-cards.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "src", "data", "blue-water-navy");
const FRAGMENTS_DIR = join(DATA_DIR, "_fragments");
const OUTPUT = join(DATA_DIR, "cards.json");

const FRAGMENT_FILES = [
  "cards-nato-1-28.json",
  "cards-nato-29-55.json",
  "cards-soviet-1-28.json",
  "cards-soviet-29-55.json",
];

// ---------------------------------------------------------------------------
// Load OCR fragments
// ---------------------------------------------------------------------------

const ocrEntries = [];
for (const file of FRAGMENT_FILES) {
  const path = join(FRAGMENTS_DIR, file);
  if (!existsSync(path)) {
    console.warn(`Missing fragment ${file}, skipping.`);
    continue;
  }
  const arr = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(arr)) {
    console.error(`${file} is not an array`);
    process.exit(1);
  }
  console.log(`  loaded ${file}: ${arr.length} physical cards`);
  for (const e of arr) ocrEntries.push(e);
}
console.log(`Total physical cards: ${ocrEntries.length}`);

// ---------------------------------------------------------------------------
// Load existing cards.json to recover designer clarifications
// ---------------------------------------------------------------------------

// Load clarifications from the previous cards.json (committed pre-OCR).
// Prefer the pre-OCR git copy if available; fall back to current file.
const PRIOR_CARDS = process.env.PRIOR_CARDS_JSON ?? OUTPUT;
const existingCards = existsSync(PRIOR_CARDS) ? JSON.parse(readFileSync(PRIOR_CARDS, "utf8")) : [];
const clarificationsByExact = new Map(); // `${side}::${normTitle}` -> clarification
const clarificationsByFuzzy = new Map(); // `${side}::${fuzzyKey}` -> clarification
for (const cat of existingCards) {
  for (const c of cat.cards ?? []) {
    if (!c.clarification) continue;
    clarificationsByExact.set(`${c.side}::${normalizeTitle(c.title)}`, c.clarification);
    clarificationsByFuzzy.set(`${c.side}::${fuzzyKey(c.title)}`, c.clarification);
  }
}
console.log(`Loaded ${clarificationsByExact.size} existing clarifications from ${PRIOR_CARDS}.`);

function normalizeTitle(t) {
  return String(t ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Looser key: drop trailing 's' from each word and collapse whitespace.
 *  Handles "Escort" ↔ "Escorts" and "Division" ↔ "Divisions". */
function fuzzyKey(t) {
  return normalizeTitle(t)
    .split(" ")
    .map((w) => (w.length > 3 ? w.replace(/s$/, "") : w))
    .join(" ")
    .trim();
}

/** Damerau-Levenshtein distance (handles transpositions like "Assassinations" vs "Assasinations"). */
function editDistance(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  // Use a small 2-row buffer
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost,
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/** Try exact, then fuzzy (trailing-s stripped), then edit distance ≤ 2. */
function findClarification(side, title, byExact, byFuzzy) {
  const exact = byExact.get(`${side}::${normalizeTitle(title)}`);
  if (exact) return exact;
  const fuzzy = byFuzzy.get(`${side}::${fuzzyKey(title)}`);
  if (fuzzy) return fuzzy;
  // Edit-distance fallback against same-side normalized titles
  const target = normalizeTitle(title);
  for (const [key, val] of byExact.entries()) {
    if (!key.startsWith(`${side}::`)) continue;
    const candidate = key.slice(side.length + 2);
    if (Math.abs(candidate.length - target.length) > 2) continue;
    if (editDistance(candidate, target) <= 2) return val;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Flatten OCR entries into per-event records
// ---------------------------------------------------------------------------

const events = []; // {side, slot, title, cost, text, cardNumber, notes?}
for (const card of ocrEntries) {
  for (const slot of ["operationsEvent", "reactionEvent"]) {
    const ev = card[slot];
    if (!ev || !ev.title) continue;
    events.push({
      side: card.side,
      slot,
      title: ev.title,
      cost: ev.cost,
      text: ev.text ?? "",
      cardNumber: card.cardNumber,
      notes: ev.notes,
    });
  }
}
console.log(`Total event slots OCR'd: ${events.length}`);

// ---------------------------------------------------------------------------
// Consolidate by (side, slot, normalized title)
// ---------------------------------------------------------------------------

const consolidated = new Map(); // key -> { side, slot, title, cost, text, cardNumbers[], notes? }
for (const ev of events) {
  const key = `${ev.side}::${ev.slot}::${normalizeTitle(ev.title)}`;
  if (consolidated.has(key)) {
    const c = consolidated.get(key);
    if (!c.cardNumbers.includes(ev.cardNumber)) c.cardNumbers.push(ev.cardNumber);
    // Prefer the longer of the two texts (in case one OCR pass was truncated)
    if ((ev.text?.length ?? 0) > (c.text?.length ?? 0)) c.text = ev.text;
  } else {
    consolidated.set(key, {
      side: ev.side,
      slot: ev.slot,
      title: ev.title,
      cost: ev.cost,
      text: ev.text,
      cardNumbers: [ev.cardNumber],
      notes: ev.notes,
    });
  }
}
console.log(`Unique events after consolidation: ${consolidated.size}`);

// ---------------------------------------------------------------------------
// Build final CardCategory entries
// ---------------------------------------------------------------------------

const sortByCardNumber = (a, b) => {
  const na = parseInt(a.cardNumbers[0], 10);
  const nb = parseInt(b.cardNumbers[0], 10);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return a.cardNumbers[0].localeCompare(b.cardNumbers[0]);
};

const slotToType = {
  operationsEvent: "operations-event",
  reactionEvent: "reaction-event",
};

function buildCategory(side, label) {
  const entries = Array.from(consolidated.values())
    .filter((c) => c.side === side)
    .sort(sortByCardNumber);

  const cards = entries.map((c) => {
    // Sort multi-card numbers numerically when possible
    const sortedNums = [...c.cardNumbers].sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      return a.localeCompare(b);
    });
    const cardNumber = sortedNums.join("/");
    const idSlot = c.slot === "operationsEvent" ? "ops" : "rxn";
    const id = `${side === "soviet" ? "sov" : "nato"}-${sortedNums[0]}-${idSlot}`;

    const entry = {
      id,
      cardNumber,
      side,
      title: c.title,
      type: slotToType[c.slot],
    };

    if (typeof c.cost === "number") entry.cost = c.cost;
    if (c.text) entry.text = c.text;

    // Attach clarification — try exact, fuzzy, then edit-distance match
    const clar = findClarification(side, c.title, clarificationsByExact, clarificationsByFuzzy);
    if (clar) entry.clarification = clar;

    if (c.notes) entry.notes = c.notes;
    return entry;
  });

  return { id: `events-${side}`, label, cards };
}

const output = [
  buildCategory("soviet", "Soviet Event Cards"),
  buildCategory("nato", "NATO Event Cards"),
];

writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + "\n");

console.log("");
console.log(`Wrote ${OUTPUT}`);
for (const cat of output) {
  console.log(`  ${cat.id}: ${cat.cards.length} unique events`);
}

// Report orphaned clarifications (entries in old cards.json that didn't match any OCR title)
const matchedKeys = new Set();
for (const cat of output) {
  for (const c of cat.cards) {
    if (c.clarification) {
      matchedKeys.add(`${c.side}::${normalizeTitle(c.title)}`);
    }
  }
}
const orphaned = [];
for (const key of clarificationsByExact.keys()) {
  if (!matchedKeys.has(key)) orphaned.push(key);
}
if (orphaned.length > 0) {
  console.log("");
  console.log(`Orphaned clarifications (no OCR title match — review titles):`);
  for (const k of orphaned) console.log(`  - ${k}`);
}
