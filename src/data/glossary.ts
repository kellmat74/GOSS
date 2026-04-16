import gossRules from "./goss/rules.json";

export interface GlossaryEntry {
  term: string;
  abbr?: string;
  ruleRef?: string;
  definition: string;
  custom?: boolean; // true = not from section 26 glossary
}

// Single common English words that should only match by abbreviation, not full term
const SKIP_FULL_TERMS = new Set([
  "Active", "Army", "Command", "Division", "Engineer", "Fatigue",
  "Fuel", "Game", "Leader", "Mode", "Night", "Range", "Reserve",
  "Step", "Support", "Supply", "Unit", "Zone", "Volley", "Phase",
  "Weather", "Bridge", "Clear", "Column", "Captured", "Towed",
]);

/** Parse section 26 entries into glossary map */
function buildGlossary(): {
  glossaryMap: Map<string, GlossaryEntry>;
  glossaryRegex: RegExp;
} {
  const rules = gossRules as Array<{
    section: string;
    text: string;
    [k: string]: unknown;
  }>;
  const section26 = rules.filter(
    (r) => r.section.startsWith("26.0.") && r.section.length > 4
  );

  const map = new Map<string, GlossaryEntry>();

  // Pattern: **Term (ABBR) (optional-rule-ref):** Definition
  // or **Term (optional-rule-ref):** Definition (no abbr)
  const entryPattern = /^\*\*(.+?)\*\*:?\s*([\s\S]*)/;
  // Inside the bold header, find abbreviation and rule ref
  const abbrPattern = /\(([A-Za-z][A-Za-z.'/\s-]+)\)/g;
  const ruleRefPattern = /\((\d+\.\d+(?:\.\d+)?(?:[a-z])?)\)/g;

  for (const rule of section26) {
    const blocks = rule.text.split("\n\n");
    for (const block of blocks) {
      const m = block.match(entryPattern);
      if (!m) continue;

      const header = m[1];
      const definition = m[2].trim();
      if (!definition) continue;

      // Extract rule refs from header
      const ruleRefs: string[] = [];
      let rr: RegExpExecArray | null;
      const ruleRefRe = new RegExp(ruleRefPattern);
      while ((rr = ruleRefRe.exec(header))) {
        ruleRefs.push(rr[1]);
      }

      // Extract abbreviations (non-numeric parens content)
      const abbrs: string[] = [];
      let am: RegExpExecArray | null;
      const abbrRe = new RegExp(abbrPattern);
      while ((am = abbrRe.exec(header))) {
        // Skip if it's a rule ref (starts with digit)
        if (/^\d/.test(am[1])) continue;
        // Skip common words in parens that aren't abbreviations
        // Abbreviations are typically short and/or contain uppercase
        const candidate = am[1].trim();
        if (candidate.length <= 20) {
          abbrs.push(candidate);
        }
      }

      // Clean term: remove parenthesized content
      const cleanTerm = header
        .replace(/\s*\([^)]*\)/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const entry: GlossaryEntry = {
        term: cleanTerm,
        abbr: abbrs[0],
        ruleRef: ruleRefs[0],
        definition:
          definition.length > 300
            ? definition.substring(0, 297) + "..."
            : definition,
      };

      // Key by abbreviation (always)
      if (entry.abbr) {
        map.set(entry.abbr, entry);
      }

      // Key by full term (skip single common words)
      if (!SKIP_FULL_TERMS.has(cleanTerm) && cleanTerm.length > 1) {
        map.set(cleanTerm, entry);
      }
    }
  }

  // Custom entries for common acronyms not in section 26
  const extras: GlossaryEntry[] = [
    { term: "Supply Interdiction", abbr: "SI", ruleRef: "20.4", definition: "A player may attack the enemy logistic infrastructure by conducting SI missions during the Joint Logistics Phase. SI missions may only be conducted during clear or POvr atmospheric conditions." },
    { term: "Ground Interdiction", abbr: "GI", ruleRef: "20.3", definition: "Each side may allocate AP to GI missions. Players determine the ground interdiction value in the Joint Weather Phase, then during an enemy Movement Phase, the active player conducts GI attacks against his own moving units." },
    { term: "Ground Support", abbr: "GS", ruleRef: "20.2", definition: "Enemy units and/or population features may have GS missions flown against them during a friendly/enemy Fire Support Segment of the Combat Phase (11.1.0) or during an enemy Exploitation Phase (5.3.4c)." },
    { term: "Air Superiority", abbr: "ASup", ruleRef: "20.6", definition: "Each AP allocated to ASup can be assigned as escorts for GS, SI or air supply missions, or as interceptors against GS, SI, GI and air supply missions." },
    { term: "Air Transport Points", abbr: "ATP", ruleRef: "20.5", definition: "A separate pool of points used to conduct air supply to replenish OhS HQs and remove OoS markers from ground units (15.5.0)." },
    { term: "Air Points", abbr: "AP", ruleRef: "20.0", definition: "Airpower resources allocated to mission types each GD. Players receive AP to allocate to ground support, ground interdiction, supply interdiction, and air superiority missions." },
    { term: "Game Day", abbr: "GD", definition: "A game day consists of three game turns: AM, PM, and Night." },
    { term: "Game Turn", abbr: "GT", definition: "Each game day has three game turns: AM, PM, and Night. Each GT follows the Sequence of Play." },
    { term: "Die Roll", abbr: "DR", definition: "A roll of one ten-sided die (1d10), where 0 = 10 unless rules state otherwise." },
    { term: "Die Roll Modifier", abbr: "DRM", definition: "A modifier applied to a die roll result. Cumulative unless stated otherwise." },
    { term: "Movement Allowance", abbr: "MA", definition: "The number of movement points a unit may expend during a Movement or Exploitation Phase." },
    { term: "Movement Points", abbr: "MP", definition: "Points expended by a unit to enter hexes and cross hexsides during movement." },
    { term: "Truck Points", abbr: "TP", ruleRef: "16.1.0", definition: "Used to motorize non-Mech units and deliver fuel and ammo. Allocated during the Truck Point Assignment Segment of the Joint Logistics Phase." },
    { term: "Fuel Points", abbr: "FP", ruleRef: "16.4.0", definition: "Used to determine a formation's fuel status. Allocated during the Fuel Delivery Segment of the Joint Logistics Phase." },
    { term: "Ammo Depletion Value", abbr: "ADV", ruleRef: "16.3.0", definition: "The value used when checking for ammunition depletion after fire support missions. Lower ADV means higher chance of depletion." },
    { term: "Ammo Points", abbr: "AmP", ruleRef: "16.3.0", definition: "Ammunition points received during the Ammo Delivery Segment. Used to adjust army and corps ADV." },
    { term: "Replacement Points", abbr: "ReP", ruleRef: "22.0", definition: "Points used to rebuild eliminated or reduced units during the Replacement Segment." },
    { term: "Player Aid Card", abbr: "PAC", definition: "Reference cards included with the game containing charts, tables, and procedures used during play." },
    { term: "Game Turn Record Track", abbr: "GTRT", definition: "Track on the game board showing the current game turn, weather, AP availability, and other GD/GT-level information." },
    { term: "Defensive Works", abbr: "DW", ruleRef: "17.0", definition: "Fortifications including fieldworks (FW), entrenchments (ET), and forts that provide defensive benefits to occupying units." },
    { term: "Personnel Replacement Check", abbr: "PRC", ruleRef: "14.0", definition: "A check made to determine if a unit passes or fails a morale/fatigue test. Roll 1d10 and compare to the unit's PRC value with applicable DRMs." },
    { term: "Non-Effect", abbr: "NE", definition: "A combat or mission result indicating no impact on the target." },
  ];

  for (const entry of extras) {
    const tagged = { ...entry, custom: true };
    if (tagged.abbr && !map.has(tagged.abbr)) {
      map.set(tagged.abbr, tagged);
    }
    if (!SKIP_FULL_TERMS.has(tagged.term) && !map.has(tagged.term)) {
      map.set(tagged.term, tagged);
    }
  }

  // Build regex: sort keys longest-first, escape special chars, word boundaries
  const keys = Array.from(map.keys()).sort((a, b) => b.length - a.length);
  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = escaped.join("|");
  const regex = new RegExp(`\\b(${pattern})\\b`, "g");

  return { glossaryMap: map, glossaryRegex: regex };
}

export const { glossaryMap, glossaryRegex } = buildGlossary();
