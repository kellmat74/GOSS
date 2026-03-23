import type { RuleEntry, Phase, SubPhase } from "../types/goss";

export interface SearchResult {
  rule: RuleEntry;
  score: number;
  matchedFields: ("title" | "section" | "summary" | "text")[];
}

export interface SequenceSearchResult {
  name: string;
  ruleRef?: string;
  content: string;
  notes: string[];
  score: number;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "shall",
  "should", "may", "might", "must", "can", "could", "am", "it", "its",
  "of", "in", "to", "for", "with", "on", "at", "from", "by", "as",
  "or", "and", "but", "not", "no", "if", "then", "than", "that", "this",
  "what", "which", "who", "whom", "how", "when", "where", "why",
  "all", "each", "any", "both", "few", "more", "most", "some",
  "i", "me", "my", "we", "us", "our", "you", "your", "he", "she",
  "they", "them", "their", "about", "into", "through", "during",
  "before", "after", "above", "below", "between", "under", "again",
  "there", "here", "so", "just", "also", "very", "too",
  "explain", "tell", "describe", "mean", "means",
]);

/**
 * Synonym map: common wargaming terms → GOSS-specific terms.
 * When a query token matches a key, the associated terms are added
 * to the search tokens so rules using GOSS terminology are found.
 */
const SYNONYMS: Record<string, string[]> = {
  "zoc": ["movement halt", "adjacent enemy", "zone of control"],
  "zocs": ["movement halt", "adjacent enemy", "zone of control"],
  "zone": ["movement halt", "adjacent"],
  "retreat": ["retreat", "withdraw", "displacement"],
  "overrun": ["overrun", "exploitation"],
  "cas": ["ground support", "gs mission"],
  "interdiction": ["supply interdiction", "ground interdiction"],
  "arty": ["artillery", "art"],
  "ammo": ["ammunition", "ammo depletion", "ammo replenishment"],
  "hq": ["headquarters", "command"],
  "recon": ["reconnaissance"],
  "mech": ["mechanized", "mech"],
  "gens": ["general supply"],
  "ohs": ["on hand supply"],
};

/**
 * Relevance-ranked search across all rule fields.
 * Uses OR logic with scoring — more matched tokens = higher score.
 * Stop words are filtered out to focus on meaningful terms.
 */
export function searchRules(
  query: string,
  rules: RuleEntry[],
  maxResults = 20
): SearchResult[] {
  const rawTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

  // Expand synonyms: add GOSS-specific terms for common wargame jargon
  const tokens = [...rawTokens];
  for (const token of rawTokens) {
    const synonyms = SYNONYMS[token];
    if (synonyms) {
      for (const syn of synonyms) {
        // Multi-word synonyms are kept as single search phrases
        tokens.push(syn);
      }
    }
  }

  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const rule of rules) {
    const titleLower = (rule.title ?? "").toLowerCase();
    const sectionLower = (rule.section ?? "").toLowerCase();
    const summaryLower = (rule.summary ?? "").toLowerCase();
    const textLower = (rule.text ?? "").toLowerCase();

    let score = 0;
    let matchedTokens = 0;
    const matchedFields = new Set<"title" | "section" | "summary" | "text">();

    for (const token of tokens) {
      const inTitle = titleLower.includes(token);
      const inSection = sectionLower.includes(token);
      const inSummary = summaryLower.includes(token);
      const inText = textLower.includes(token);

      if (!inTitle && !inSection && !inSummary && !inText) continue;

      matchedTokens++;

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

    // Require at least one token match; bonus for matching more tokens
    if (matchedTokens > 0) {
      // Boost rules that match more of the query tokens
      score *= (matchedTokens / tokens.length);
      results.push({ rule, score, matchedFields: [...matchedFields] });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

/**
 * Relevance-ranked search across sequence.json content and notes (tips).
 * Flattens the 3-level hierarchy, scores by name/content/notes matches.
 */
export function searchSequence(
  query: string,
  phases: Phase[],
  maxResults = 10
): SequenceSearchResult[] {
  const rawTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

  const tokens = [...rawTokens];
  for (const token of rawTokens) {
    const synonyms = SYNONYMS[token];
    if (synonyms) {
      for (const syn of synonyms) tokens.push(syn);
    }
  }

  if (tokens.length === 0) return [];

  const items: { name: string; ruleRef?: string; content: string; notes: string[] }[] = [];

  function collect(item: Phase | SubPhase) {
    if (item.content || item.notes.length > 0) {
      items.push({
        name: item.name,
        ruleRef: item.ruleRef,
        content: item.content ?? "",
        notes: item.notes,
      });
    }
    const subs = "subPhases" in item ? item.subPhases : undefined;
    if (subs) {
      for (const sub of subs) collect(sub);
    }
  }
  for (const p of phases) collect(p);

  const results: SequenceSearchResult[] = [];

  for (const item of items) {
    const nameLower = item.name.toLowerCase();
    const contentLower = item.content.toLowerCase();
    const notesLower = item.notes.join(" ").toLowerCase();

    let score = 0;
    let matchedTokens = 0;

    for (const token of tokens) {
      const inName = nameLower.includes(token);
      const inContent = contentLower.includes(token);
      const inNotes = notesLower.includes(token);

      if (!inName && !inContent && !inNotes) continue;
      matchedTokens++;

      if (inName) score += 8;
      if (inContent) score += 2;
      if (inNotes) score += 3;
    }

    if (matchedTokens > 0) {
      score *= matchedTokens / tokens.length;
      results.push({ ...item, score });
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
