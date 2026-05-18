#!/usr/bin/env node
/**
 * Merge OCR card fragments into cards.json (physical-card centric).
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
 * Output: src/data/blue-water-navy/cards.json as a flat array of PhysicalCard,
 * one entry per physical card (110 total: 55 Soviet + 55 NATO). Each event
 * carries a `frequency` field (count of how many times this exact event-slot
 * appears across the entire deck) so the UI can flag duplicates.
 *
 * Designer clarifications are loaded from a prior cards.json (event-centric
 * format) via PRIOR_CARDS_JSON env var, matched by (side, title) using
 * exact / fuzzy / edit-distance lookup.
 *
 * Usage:
 *   node scripts/merge-bwn-cards.mjs
 *   PRIOR_CARDS_JSON=/tmp/old-cards.json node scripts/merge-bwn-cards.mjs
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
// Helpers
// ---------------------------------------------------------------------------

function normalizeTitle(t) {
  return String(t ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function fuzzyKey(t) {
  return normalizeTitle(t)
    .split(" ")
    .map((w) => (w.length > 3 ? w.replace(/s$/, "") : w))
    .join(" ")
    .trim();
}

function editDistance(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function findClarification(side, title, byExact, byFuzzy) {
  const exact = byExact.get(`${side}::${normalizeTitle(title)}`);
  if (exact) return exact;
  const fuzzy = byFuzzy.get(`${side}::${fuzzyKey(title)}`);
  if (fuzzy) return fuzzy;
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
// Load clarifications from prior cards.json
// ---------------------------------------------------------------------------

const PRIOR_CARDS = process.env.PRIOR_CARDS_JSON ?? OUTPUT;
const existingCards = existsSync(PRIOR_CARDS) ? JSON.parse(readFileSync(PRIOR_CARDS, "utf8")) : [];
const clarificationsByExact = new Map();
const clarificationsByFuzzy = new Map();

// Prior file could be either event-centric (legacy CardCategory[]) or the new
// physical-card array. Handle both.
function harvestClarification(entry, side, title) {
  if (!entry?.clarification) return;
  clarificationsByExact.set(`${side}::${normalizeTitle(title)}`, entry.clarification);
  clarificationsByFuzzy.set(`${side}::${fuzzyKey(title)}`, entry.clarification);
}

if (Array.isArray(existingCards) && existingCards.length > 0) {
  // Detect shape
  if ("cards" in existingCards[0] && "label" in existingCards[0]) {
    // Legacy CardCategory[]
    for (const cat of existingCards) {
      for (const c of cat.cards ?? []) harvestClarification(c, c.side, c.title);
    }
  } else if ("ops" in existingCards[0] || "reaction" in existingCards[0]) {
    // PhysicalCard[]
    for (const card of existingCards) {
      if (card.ops) harvestClarification(card.ops, card.side, card.ops.title);
      if (card.reaction) harvestClarification(card.reaction, card.side, card.reaction.title);
    }
  }
}
console.log(`Loaded ${clarificationsByExact.size} clarifications from ${PRIOR_CARDS}.`);

// ---------------------------------------------------------------------------
// Compute event frequency across the whole deck
// ---------------------------------------------------------------------------

// Key: side::slot::normalizedTitle  →  count
const frequencyMap = new Map();
function freqKey(side, slot, title) {
  return `${side}::${slot}::${normalizeTitle(title)}`;
}
for (const card of ocrEntries) {
  for (const slot of ["operationsEvent", "reactionEvent"]) {
    const ev = card[slot];
    if (!ev || !ev.title) continue;
    const k = freqKey(card.side, slot, ev.title);
    frequencyMap.set(k, (frequencyMap.get(k) ?? 0) + 1);
  }
}

// ---------------------------------------------------------------------------
// Emit PhysicalCard[] — one entry per physical card
// ---------------------------------------------------------------------------

const slotToType = {
  operationsEvent: "operations-event",
  reactionEvent: "reaction-event",
};

function buildEvent(card, slot) {
  const ev = card[slot];
  if (!ev) {
    return {
      title: "None",
      type: slotToType[slot],
      text: "",
      frequency: 0,
    };
  }
  const event = {
    title: ev.title,
    type: slotToType[slot],
    text: ev.text ?? "",
    frequency: frequencyMap.get(freqKey(card.side, slot, ev.title)) ?? 1,
  };
  if (typeof ev.cost === "number") event.cost = ev.cost;
  const clar = findClarification(card.side, ev.title, clarificationsByExact, clarificationsByFuzzy);
  if (clar) event.clarification = clar;
  if (ev.notes) event.notes = ev.notes;
  return event;
}

const cards = ocrEntries
  .map((card) => ({
    id: `${card.side}-${card.cardNumber}`,
    cardNumber: card.cardNumber,
    side: card.side,
    ops: buildEvent(card, "operationsEvent"),
    reaction: buildEvent(card, "reactionEvent"),
  }))
  .sort((a, b) => {
    if (a.side !== b.side) return a.side === "soviet" ? -1 : 1;
    const na = parseInt(a.cardNumber, 10);
    const nb = parseInt(b.cardNumber, 10);
    if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
    return a.cardNumber.localeCompare(b.cardNumber);
  });

writeFileSync(OUTPUT, JSON.stringify(cards, null, 2) + "\n");

const stats = { soviet: 0, nato: 0, withOpsClarification: 0, withRxnClarification: 0 };
for (const c of cards) {
  stats[c.side]++;
  if (c.ops.clarification) stats.withOpsClarification++;
  if (c.reaction.clarification) stats.withRxnClarification++;
}

console.log("");
console.log(`Wrote ${OUTPUT}`);
console.log(`  ${stats.soviet} Soviet + ${stats.nato} NATO = ${cards.length} physical cards`);
console.log(`  Clarifications attached: ${stats.withOpsClarification} ops, ${stats.withRxnClarification} reaction`);
console.log(`  Unique events: ${frequencyMap.size}`);

const dupes = [...frequencyMap.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
if (dupes.length > 0) {
  console.log("");
  console.log(`Top duplicates (event printed on multiple cards):`);
  for (const [k, n] of dupes.slice(0, 8)) {
    console.log(`  ${n}× ${k.replace(/::/g, " / ")}`);
  }
}
