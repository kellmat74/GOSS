import type { RuleEntry } from "../types/goss";

export interface GlossaryEntry {
  term: string;
  abbr?: string;
  ruleRef?: string;
  definition: string;
  custom?: boolean; // true = not extracted from a rules section
}

/** Config for building a per-game glossary. */
export interface GlossaryConfig {
  /**
   * Section ID prefixes to scan for glossary entries.
   * E.g. ["26.0."] for GOSS section 26, ["12", "13"] for BWN Glossary + Acronyms.
   * A rule matches if its section starts with any prefix.
   */
  sectionPrefixes: string[];
  /**
   * Single common English words that should only match by abbreviation, not full term.
   * E.g. "Range", "Unit", "Zone" — these match too broadly otherwise.
   */
  skipFullTerms?: string[];
  /** Additional entries not in any rules section. */
  extras?: GlossaryEntry[];
}

export interface BuiltGlossary {
  glossaryMap: Map<string, GlossaryEntry>;
  glossaryRegex: RegExp;
}

const EMPTY: BuiltGlossary = {
  glossaryMap: new Map(),
  glossaryRegex: /(?!)/g, // never matches
};

/**
 * Build a glossary from rules + config.
 *
 * Parses entries in the format:
 *   **Term**: Definition
 *   **Term (ABBR)**: Definition
 *   **Term (ABBR) (X.Y.Z)**: Definition (rule ref in parens)
 *   **Term** — Definition       (em-dash separator also supported)
 */
export function buildGlossary(
  rules: RuleEntry[],
  config: GlossaryConfig | undefined,
): BuiltGlossary {
  if (!config || config.sectionPrefixes.length === 0) return EMPTY;

  const skipSet = new Set(config.skipFullTerms ?? []);

  const matchingRules = rules.filter((r) =>
    config.sectionPrefixes.some((p) => r.section.startsWith(p)),
  );

  const map = new Map<string, GlossaryEntry>();

  // Pattern: **Header** [optional :] [optional em-dash and space] definition...
  const entryPattern = /^\*\*(.+?)\*\*\s*(?::|—|–|-)?\s*([\s\S]*)/;
  // Inside header, find abbreviation and rule ref in parens
  const abbrPattern = /\(([A-Za-z][A-Za-z.'/\s-]+)\)/g;
  const ruleRefPattern = /\((\d+\.\d+(?:\.\d+)?(?:[a-z])?)\)/g;

  for (const rule of matchingRules) {
    const blocks = rule.text.split("\n\n");
    for (const block of blocks) {
      const m = block.match(entryPattern);
      if (!m) continue;

      const header = m[1];
      // Strip a leading em/en-dash if the regex didn't consume it
      let definition = m[2].trim().replace(/^[—–-]\s*/, "");
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
        if (/^\d/.test(am[1])) continue; // skip rule refs
        const candidate = am[1].trim();
        if (candidate.length <= 20) abbrs.push(candidate);
      }

      // Clean term: remove parenthesized content
      const cleanTerm = header
        .replace(/\s*\([^)]*\)/g, "")
        .replace(/\s+/g, " ")
        .trim();

      // Truncate long definitions for tooltip readability
      if (definition.length > 300) definition = definition.substring(0, 297) + "...";

      const entry: GlossaryEntry = {
        term: cleanTerm,
        abbr: abbrs[0],
        ruleRef: ruleRefs[0],
        definition,
      };

      if (entry.abbr) map.set(entry.abbr, entry);
      if (!skipSet.has(cleanTerm) && cleanTerm.length > 1) {
        map.set(cleanTerm, entry);
      }
    }
  }

  // Apply extras (don't override existing keys)
  for (const entry of config.extras ?? []) {
    const tagged = { ...entry, custom: true };
    if (tagged.abbr && !map.has(tagged.abbr)) map.set(tagged.abbr, tagged);
    if (!skipSet.has(tagged.term) && !map.has(tagged.term)) {
      map.set(tagged.term, tagged);
    }
  }

  if (map.size === 0) return EMPTY;

  // Longest-first to prefer multi-word matches over substrings.
  const keys = Array.from(map.keys()).sort((a, b) => b.length - a.length);
  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "g");

  return { glossaryMap: map, glossaryRegex: regex };
}
