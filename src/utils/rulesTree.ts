import type { RuleEntry } from "../types/goss";

export interface TreeNode {
  rule: RuleEntry;
  children: TreeNode[];
}

/**
 * Build a hierarchical tree from a flat rules array.
 *
 * Supports multiple section-numbering conventions:
 *   - GOSS / NW: `X.0` → `X.Y` → `X.Y.Z` (3 levels, "X.0" chapter markers)
 *   - BWN:       `X`   → `X.Y` → `X.Y.Z` → `X.Y.Z.W` (up to 4 levels, bare-int chapters)
 *   - Prefixed:  `GSR.X.Y`, `26.0.A` (letter suffix glossary entries)
 *
 * Parent resolution strategy:
 *   1. If the section has a trailing letter (`3.3.1a`), parent is the
 *      stripped form (`3.3.1`) if it exists; else fall through.
 *   2. Drop the last `.`-segment. If the result exists as a section, use it.
 *      (Handles BWN's `5.1.3.2` → `5.1.3`, and GOSS's `5.6.1` → `5.6`.)
 *   3. If not, try replacing the last numeric segment with `0` to find a
 *      GOSS-style chapter marker (`5.6` → `5.0`, `4.1.0` → `4.0`).
 *   4. Special-case glossary entries with uppercase-letter leaves
 *      (`26.0.A` → `26.0`).
 *   5. Single-segment sections (`5`, `12`) have no parent — top-level.
 */
export function buildRulesTree(rules: RuleEntry[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const sectionToFirstId = new Map<string, string>();
  const allSections = new Set<string>();
  const topLevel: TreeNode[] = [];

  for (const rule of rules) {
    nodeMap.set(rule.id, { rule, children: [] });
    allSections.add(rule.section);
    if (!sectionToFirstId.has(rule.section)) {
      sectionToFirstId.set(rule.section, rule.id);
    }
  }

  const getNodeBySection = (section: string): TreeNode | undefined => {
    const id = sectionToFirstId.get(section);
    return id ? nodeMap.get(id) : undefined;
  };

  for (const rule of rules) {
    const node = nodeMap.get(rule.id)!;
    const parentKey = getParentSection(rule.section, allSections);
    const parent = parentKey ? getNodeBySection(parentKey) : undefined;
    if (parent) parent.children.push(node);
    else topLevel.push(node);
  }

  return topLevel;
}

/**
 * Determine the parent section ID for a given section.
 * Returns null for top-level sections.
 *
 * Examples (with sections actually present in `allSections`):
 *   "5.1.3.2"  → "5.1.3"   (BWN — drop last segment)
 *   "5.1.3"    → "5.1"
 *   "5.1"      → "5"       (BWN bare-int chapter)
 *   "5.6.1"    → "5.6"     (GOSS)
 *   "5.6"      → "5.0"     (GOSS — falls back when "5" doesn't exist)
 *   "5.0"      → null      (GOSS chapter)
 *   "5"        → null      (BWN chapter)
 *   "26.0.A"   → "26.0"    (glossary letter suffix)
 *   "3.3.1a"   → "3.3.1"   (sub-item letter suffix, if "3.3.1" exists)
 */
function getParentSection(section: string, allSections: Set<string>): string | null {
  // Letter-suffix sub-items: "3.3.1a" → parent "3.3.1" if it exists
  const letterMatch = section.match(/^(.*?)[a-z]+$/);
  if (letterMatch) {
    const base = letterMatch[1];
    if (base !== section && allSections.has(base)) return base;
    // Fall through to normal segment-drop if base doesn't exist
  }

  // Glossary entries like "26.0.A" (uppercase letter leaf)
  if (/\.[A-Z]$/.test(section)) {
    const stripped = section.replace(/\.[A-Z]$/, "");
    if (allSections.has(stripped)) return stripped;
  }

  const lastDot = section.lastIndexOf(".");
  if (lastDot === -1) {
    // Single-segment (e.g., BWN "5" or "12") — top-level
    return null;
  }

  // 1. Drop the last segment — works for BWN bare-int chapters and any
  //    convention where the direct parent has the exact dropped form.
  const direct = section.substring(0, lastDot);
  if (allSections.has(direct)) return direct;

  // 2. GOSS fallback: chapter marker is "X.0". Replace last segment with "0".
  //    Handles "5.6" → "5.0" and "4.1.0" → "4.0" (since "4.1" wouldn't exist).
  const parts = direct.split(".");
  const gossChapter = parts[0] + ".0";
  if (allSections.has(gossChapter) && gossChapter !== section) return gossChapter;

  // 3. Walk further up in case of gaps (e.g., depth-4 missing depth-3 parent).
  if (parts.length > 1) {
    for (let i = parts.length - 1; i >= 1; i--) {
      const ancestor = parts.slice(0, i).join(".");
      if (allSections.has(ancestor)) return ancestor;
    }
  }

  return null;
}
