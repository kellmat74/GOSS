#!/usr/bin/env node
/**
 * One-shot restructure: AW's learn overlay had 4 decisions added under
 * `pregame-day-overview`, but AW introduces 2 NEW top-level SoP phases
 * (Airborne Assault Stage / Amphibious Assault Stage) that have no base
 * chapter. Without dedicated chapters, navigating to those phases falls
 * through to the "No Learn content" fallback.
 *
 * This script promotes those 4 `add decision` modifications into 2
 * `add chapter` modifications, each with phaseRef pointing to the
 * corresponding AW-specific SoP id.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, "..", "src/data/goss/atlantic-wall/learn-overlay.json");
const data = JSON.parse(readFileSync(path, "utf8"));

// Pull the 4 decisions out of their "add under pregame-day-overview" mods
const reparent = ["aw-d-day-stages", "aw-airborne-drops", "aw-dday-special-segments", "aw-beach-clearing"];
const pulled = {};
data.modifications = data.modifications.filter((m) => {
  if (m.action === "add" && m.decision && reparent.includes(m.decision.id)) {
    pulled[m.decision.id] = m.decision;
    return false;
  }
  return true;
});

if (Object.keys(pulled).length !== 4) {
  console.error("Expected 4 decisions to reparent, found:", Object.keys(pulled));
  process.exit(1);
}

// Build two new chapters
const airborneChapter = {
  id: "aw-airborne-stage",
  title: "Airborne Assault Stage",
  phaseRef: "aw-airborne-assault-stage",
  ruleRef: "41.0",
  intro: "AW adds a dedicated Airborne Assault Stage that fires before the normal Game Day for D-Day and airborne-heavy scenarios. Paratroop drops happen in their own mini-turn sequence with distinct movement, combat, and recovery rules (41.0). Plan drops carefully — bad weather and flak zones scatter formations.",
  decisions: [pulled["aw-airborne-drops"], pulled["aw-d-day-stages"]].filter(Boolean),
};

const amphibiousChapter = {
  id: "aw-amphibious-stage",
  title: "Amphibious Assault Stage",
  phaseRef: "aw-amphibious-assault-stage",
  ruleRef: "42.0",
  intro: "The Amphibious Assault Stage runs an 8-segment mini-turn sequence for beach landings (42.0): landing, German fire, Allied fire, Allied movement, German movement, assault combat, demolition, pin recovery. Special D-Day rules (Pointe du Hoc, Utah drift, DD tanks) fire during these segments. Beach clearing and WN/StP mechanics dominate the first few GDs.",
  decisions: [pulled["aw-beach-clearing"], pulled["aw-dday-special-segments"]].filter(Boolean),
};

// Insert the new chapters at the top of modifications (they don't need a target for add-chapter)
data.modifications.unshift(
  { target: "", action: "add", insertAfter: "pregame-day-overview", chapter: airborneChapter },
  { target: "", action: "add", insertAfter: "aw-airborne-stage", chapter: amphibiousChapter },
);

writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(`Restructured ${path}`);
console.log(`Added 2 new chapters: ${airborneChapter.id} (${airborneChapter.decisions.length} decisions), ${amphibiousChapter.id} (${amphibiousChapter.decisions.length} decisions)`);
