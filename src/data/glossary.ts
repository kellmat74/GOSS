import gossRules from "./goss/rules.json";

export interface GlossaryEntry {
  term: string;
  abbr?: string;
  ruleRef?: string;
  definition: string;
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

  // Build regex: sort keys longest-first, escape special chars, word boundaries
  const keys = Array.from(map.keys()).sort((a, b) => b.length - a.length);
  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = escaped.join("|");
  const regex = new RegExp(`\\b(${pattern})\\b`, "g");

  return { glossaryMap: map, glossaryRegex: regex };
}

export const { glossaryMap, glossaryRegex } = buildGlossary();
