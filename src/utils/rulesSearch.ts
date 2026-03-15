import type { RuleEntry } from "../types/goss";

export interface SearchResult {
  rule: RuleEntry;
  score: number;
  matchedFields: ("title" | "section" | "summary" | "text")[];
}

/**
 * Relevance-ranked search across all rule fields.
 * All query tokens must match somewhere in the rule (AND logic).
 */
export function searchRules(
  query: string,
  rules: RuleEntry[],
  maxResults = 20
): SearchResult[] {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const rule of rules) {
    const titleLower = (rule.title ?? "").toLowerCase();
    const sectionLower = (rule.section ?? "").toLowerCase();
    const summaryLower = (rule.summary ?? "").toLowerCase();
    const textLower = (rule.text ?? "").toLowerCase();

    let score = 0;
    let allMatch = true;
    const matchedFields = new Set<"title" | "section" | "summary" | "text">();

    for (const token of tokens) {
      const inTitle = titleLower.includes(token);
      const inSection = sectionLower.includes(token);
      const inSummary = summaryLower.includes(token);
      const inText = textLower.includes(token);

      if (!inTitle && !inSection && !inSummary && !inText) {
        allMatch = false;
        break;
      }

      if (inTitle) {
        score += 10;
        matchedFields.add("title");
      }
      if (inSection) {
        score += 5;
        matchedFields.add("section");
      }
      if (inSummary) {
        score += 3;
        matchedFields.add("summary");
      }
      if (inText) {
        score += 1;
        matchedFields.add("text");
      }
    }

    if (allMatch) {
      results.push({ rule, score, matchedFields: [...matchedFields] });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

/**
 * Extract a snippet around the first match of any query token in the text.
 */
export function getSnippet(
  text: string,
  query: string,
  maxLength = 160
): string {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  const textLower = text.toLowerCase();

  let earliestIdx = text.length;
  for (const token of tokens) {
    const idx = textLower.indexOf(token);
    if (idx !== -1 && idx < earliestIdx) earliestIdx = idx;
  }

  if (earliestIdx >= text.length) {
    return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
  }

  const start = Math.max(0, earliestIdx - 40);
  const end = Math.min(text.length, start + maxLength);
  let snippet = text.slice(start, end).replace(/\n+/g, " ");
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet;
}
