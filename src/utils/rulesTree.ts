import type { RuleEntry } from "../types/goss";

export interface TreeNode {
  rule: RuleEntry;
  children: TreeNode[];
}

/**
 * Build a hierarchical tree from flat rules array.
 *
 * Hierarchy: X.0 → X.Y → X.Y.Z (two levels of nesting)
 * Special case: 26.0.A-Z glossary entries are children of 26.0
 */
export function buildRulesTree(rules: RuleEntry[]): TreeNode[] {
  // Use rule.id as key (unique even when base + scenario share a section)
  const nodeMap = new Map<string, TreeNode>();
  // Track first node per section for parent lookups
  const sectionToFirstId = new Map<string, string>();
  const topLevel: TreeNode[] = [];

  // Create all nodes
  for (const rule of rules) {
    nodeMap.set(rule.id, { rule, children: [] });
    if (!sectionToFirstId.has(rule.section)) {
      sectionToFirstId.set(rule.section, rule.id);
    }
  }

  // Helper: find a parent node by section (returns first matching node)
  const getNodeBySection = (section: string): TreeNode | undefined => {
    const id = sectionToFirstId.get(section);
    return id ? nodeMap.get(id) : undefined;
  };

  // Build hierarchy
  for (const rule of rules) {
    const node = nodeMap.get(rule.id)!;
    const parentKey = getParentSection(rule.section);

    // Try exact parent, then with .0 suffix (e.g., "4.1" → "4.1.0")
    const parent =
      parentKey &&
      (getNodeBySection(parentKey) ?? getNodeBySection(parentKey + ".0"));

    if (parent) {
      parent.children.push(node);
    } else {
      topLevel.push(node);
    }
  }

  return topLevel;
}

/**
 * Determine the parent section ID for a given section.
 * Returns null for top-level sections (X.0).
 *
 * Examples:
 *   "7.5.1"  → "7.5"
 *   "7.5.1a" → "7.5"    (strip trailing letter, then up one level — but 7.5.1a parent is 7.5.1 if it exists...
 *                          actually we want 7.5 as parent since 7.5.1a is same depth as 7.5.1)
 *   "7.5"    → "7.0"
 *   "7.0"    → null
 *   "26.0.A" → "26.0"
 *   "3.3.1a" → "3.3"    (strip letter, get 3.3.1, parent is 3.3... but we want depth-based)
 */
function getParentSection(section: string): string | null {
  // Special case: glossary entries like 26.0.A
  if (/^\d+\.\d+\.[A-Z]$/.test(section)) {
    return section.replace(/\.[A-Z]$/, "");
  }

  // Strip trailing letter (e.g., "3.3.1a" → "3.3.1")
  const stripped = section.replace(/[a-z]+$/, "");
  const parts = stripped.split(".");

  // X.0 → top-level (no parent)
  if (parts.length === 2 && parts[1] === "0") {
    return null;
  }

  // X.Y → parent is X.0
  if (parts.length === 2) {
    return parts[0] + ".0";
  }

  // X.Y.0 (like 4.1.0) → treat as depth-2, parent is X.0
  if (parts.length === 3 && parts[2] === "0") {
    return parts[0] + ".0";
  }

  // X.Y.Z → parent is X.Y or X.Y.0 (try both)
  const directParent = parts[0] + "." + parts[1];
  return directParent;
}
