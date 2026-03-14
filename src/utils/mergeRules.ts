import type { RuleEntry } from "../types/goss";

/**
 * Compare two section IDs for sorting.
 *
 * Handles numeric parts (1.0 < 2.0 < 10.0) and
 * letter suffixes (3.3.1a < 3.3.1b) and
 * glossary entries (26.0.A < 26.0.B).
 */
function compareSections(a: string, b: string): number {
  const partsA = a.match(/(\d+|[a-zA-Z]+)/g) ?? [];
  const partsB = b.match(/(\d+|[a-zA-Z]+)/g) ?? [];

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const pa = partsA[i];
    const pb = partsB[i];

    if (pa === undefined) return -1;
    if (pb === undefined) return 1;

    const na = Number(pa);
    const nb = Number(pb);

    if (!isNaN(na) && !isNaN(nb)) {
      if (na !== nb) return na - nb;
    } else {
      const cmp = pa.localeCompare(pb);
      if (cmp !== 0) return cmp;
    }
  }
  return 0;
}

/**
 * Merge base GOSS rules with a scenario rule set.
 *
 * - Base rules always appear first in their section position.
 * - Scenario rules with a matching section are **inserted after** the base rule.
 * - Scenario rules with new sections (no base match) are inserted in sort order.
 * - The player sees both: the base rule, then the scenario modification.
 */
export function mergeRules(
  base: RuleEntry[],
  scenario: RuleEntry[]
): RuleEntry[] {
  if (scenario.length === 0) return base;

  // Index scenario rules by section for matching
  const scenarioBySection = new Map<string, RuleEntry>();
  const scenarioOnly: RuleEntry[] = [];
  const baseSet = new Set(base.map((r) => r.section));

  for (const r of scenario) {
    if (baseSet.has(r.section)) {
      scenarioBySection.set(r.section, r);
    } else {
      scenarioOnly.push(r);
    }
  }

  // Build merged list: base rule followed by its scenario counterpart
  const merged: RuleEntry[] = [];

  for (const r of base) {
    merged.push(r);
    const scenarioRule = scenarioBySection.get(r.section);
    if (scenarioRule) {
      merged.push(scenarioRule);
    }
  }

  // Insert scenario-only rules (new sections) in sort order
  for (const r of scenarioOnly) {
    // Find insertion point: after the last rule whose section sorts before this one
    let insertIdx = merged.length;
    for (let i = merged.length - 1; i >= 0; i--) {
      if (compareSections(merged[i].section, r.section) <= 0) {
        insertIdx = i + 1;
        break;
      }
    }
    merged.splice(insertIdx, 0, r);
  }

  return merged;
}
