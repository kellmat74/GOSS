import type { RuleEntry, Phase, SubPhase, PhysicalCard } from "../types/goss";
import type { LearnChapter, LearnDecision } from "../types/learn";

export interface SearchResult {
  rule: RuleEntry;
  score: number;
  matchedFields: ("title" | "section" | "summary" | "text")[];
}

export interface LearnSearchResult {
  chapterTitle: string;
  chapterIntro: string;
  decisionTitle: string;
  when: string;
  body: string;          // flattened text of all prose / callout / ask / rule blocks
  ruleRefs: string[];
  score: number;
}

/** Shape of one curated BGG forum post (matches what the curator emits). */
export interface ForumPostEntry {
  author: string;
  isDesigner: boolean;
  createdAt?: string | null;
  body: string;
  thumbs?: number;
  threadTitle?: string;
  threadId?: string;
  threadUrl?: string;
  postUrl?: string | null;
  forumName?: string;
  tier?: number;
}

export interface ForumSearchResult extends ForumPostEntry {
  score: number;
}

/**
 * Per-game search behavior. Pass to `searchRules` / `searchSequence` to enable
 * game-specific synonym expansion and module-name detection.
 */
export interface SearchConfig {
  /**
   * Token expansion. When a query token matches a key, the listed phrases are
   * also added to the search tokens. Keep both keys and values lowercase.
   * Example: `{ "zoc": ["movement halt", "adjacent enemy"] }`
   */
  synonyms?: Record<string, string[]>;
  /**
   * Substring aliases for game-module names. Map lowercased aliases to module
   * IDs. Longer aliases checked first; short (<=3 char) aliases are matched
   * with word boundaries to avoid false positives.
   * Example: `[ ["battle of the bulge", "war"], ["bulge", "war"] ]`
   */
  moduleAliases?: [string, string][];
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
 * Detect if the query references a specific game module, using per-game aliases.
 * Returns the module ID or null.
 */
function detectModule(query: string, aliases: [string, string][] | undefined): string | null {
  if (!aliases || aliases.length === 0) return null;
  const q = query.toLowerCase();
  for (const [alias, moduleId] of aliases) {
    if (alias.length <= 3) {
      const re = new RegExp(`\\b${alias}\\b`, "i");
      if (re.test(q)) return moduleId;
    } else if (q.includes(alias)) {
      return moduleId;
    }
  }
  return null;
}

/**
 * Relevance-ranked search across all rule fields.
 * Uses OR logic with scoring — more matched tokens = higher score.
 * Stop words are filtered out to focus on meaningful terms.
 */
export function searchRules(
  query: string,
  rules: RuleEntry[],
  maxResults = 20,
  config?: SearchConfig,
): SearchResult[] {
  const rawTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

  // Expand synonyms with per-game terminology (no-op if config not provided)
  const synonyms = config?.synonyms;
  const tokens = [...rawTokens];
  if (synonyms) {
    for (const token of rawTokens) {
      const syns = synonyms[token];
      if (syns) for (const s of syns) tokens.push(s);
    }
  }

  if (tokens.length === 0) return [];

  // Detect if query references a specific game module
  const detectedModule = detectModule(query, config?.moduleAliases);

  const results: SearchResult[] = [];

  for (const rule of rules) {
    const titleLower = (rule.title ?? "").toLowerCase();
    const sectionLower = (rule.section ?? "").toLowerCase();
    const summaryLower = (rule.summary ?? "").toLowerCase();
    const textLower = (rule.text ?? "").toLowerCase();
    const moduleLower = (rule.module ?? "").toLowerCase();

    let score = 0;
    let matchedTokens = 0;
    const matchedFields = new Set<"title" | "section" | "summary" | "text">();

    for (const token of tokens) {
      const inTitle = titleLower.includes(token);
      const inSection = sectionLower.includes(token);
      const inSummary = summaryLower.includes(token);
      const inText = textLower.includes(token);
      const inModule = moduleLower.includes(token);

      if (!inTitle && !inSection && !inSummary && !inText && !inModule) continue;

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
      if (inModule) {
        score += 3;
      }
    }

    // Require at least one token match; bonus for matching more tokens
    if (matchedTokens > 0) {
      // Boost rules that match more of the query tokens
      score *= (matchedTokens / tokens.length);

      // Flat boost for rules from the detected module
      if (detectedModule && rule.module === detectedModule) {
        score += 8;
      }

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
  maxResults = 10,
  config?: SearchConfig,
): SequenceSearchResult[] {
  const rawTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

  const synonyms = config?.synonyms;
  const tokens = [...rawTokens];
  if (synonyms) {
    for (const token of rawTokens) {
      const syns = synonyms[token];
      if (syns) for (const s of syns) tokens.push(s);
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
 * Flatten all the prose-bearing blocks of a Learn decision into a single
 * searchable string. Excludes diagram block names since they don't carry
 * substantive content for retrieval.
 */
function flattenDecisionBlocks(decision: LearnDecision): string {
  const parts: string[] = [];
  const collect = (blocks: typeof decision.blocks | undefined) => {
    if (!blocks) return;
    for (const b of blocks) {
      if (b.kind === "prose" || b.kind === "callout") parts.push(b.text);
      else if (b.kind === "rule") parts.push(b.text);
      else if (b.kind === "ask") parts.push(b.items.join(" "));
    }
  };
  collect(decision.blocks);
  collect(decision.appendedBlocks);
  return parts.join("\n");
}

/**
 * Relevance-ranked search across Learn chapters/decisions. Returns the top
 * matching decisions with their chapter context, body text, and rule refs —
 * intended as auxiliary context for the AI Coach (Ask tab).
 */
export function searchLearn(
  query: string,
  chapters: LearnChapter[],
  maxResults = 5,
  config?: SearchConfig,
): LearnSearchResult[] {
  const rawTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

  const synonyms = config?.synonyms;
  const tokens = [...rawTokens];
  if (synonyms) {
    for (const token of rawTokens) {
      const syns = synonyms[token];
      if (syns) for (const s of syns) tokens.push(s);
    }
  }

  if (tokens.length === 0) return [];

  const results: LearnSearchResult[] = [];

  for (const chapter of chapters) {
    const chapterTitleLower = chapter.title.toLowerCase();
    const chapterIntroLower = (chapter.intro ?? "").toLowerCase();
    for (const decision of chapter.decisions ?? []) {
      const titleLower = decision.title.toLowerCase();
      const whenLower = (decision.when ?? "").toLowerCase();
      const body = flattenDecisionBlocks(decision);
      const bodyLower = body.toLowerCase();

      let score = 0;
      let matchedTokens = 0;

      for (const token of tokens) {
        const inDecisionTitle = titleLower.includes(token);
        const inWhen = whenLower.includes(token);
        const inBody = bodyLower.includes(token);
        const inChapterTitle = chapterTitleLower.includes(token);
        const inChapterIntro = chapterIntroLower.includes(token);

        if (
          !inDecisionTitle && !inWhen && !inBody &&
          !inChapterTitle && !inChapterIntro
        ) continue;

        matchedTokens++;
        if (inDecisionTitle) score += 10;
        if (inChapterTitle) score += 6;
        if (inWhen) score += 4;
        if (inChapterIntro) score += 2;
        if (inBody) score += 1;
      }

      if (matchedTokens > 0) {
        score *= matchedTokens / tokens.length;
        results.push({
          chapterTitle: chapter.title,
          chapterIntro: chapter.intro ?? "",
          decisionTitle: decision.title,
          when: decision.when ?? "",
          body,
          ruleRefs: decision.ruleRefs ?? [],
          score,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

/**
 * Relevance-ranked search across curated forum posts (Tier 1+2+3 combined).
 * Designed for AI Coach: returns the most relevant designer / endorsed posts
 * for a specific user question. Tier 1 (designer) posts get a baseline score
 * bonus so they're preferred over tier-equal community posts.
 */
export function searchForum(
  query: string,
  posts: ForumPostEntry[],
  maxResults = 20,
  config?: SearchConfig,
): ForumSearchResult[] {
  if (!posts || posts.length === 0) return [];

  const rawTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

  const synonyms = config?.synonyms;
  const tokens = [...rawTokens];
  if (synonyms) {
    for (const token of rawTokens) {
      const syns = synonyms[token];
      if (syns) for (const s of syns) tokens.push(s);
    }
  }

  if (tokens.length === 0) return [];

  const results: ForumSearchResult[] = [];
  for (const p of posts) {
    const bodyLower = (p.body ?? "").toLowerCase();
    const titleLower = (p.threadTitle ?? "").toLowerCase();
    let score = 0;
    let matched = 0;
    for (const token of tokens) {
      const inTitle = titleLower.includes(token);
      const inBody = bodyLower.includes(token);
      if (!inTitle && !inBody) continue;
      matched++;
      if (inTitle) score += 6;
      if (inBody) score += 1;
    }
    if (matched === 0) continue;

    // Tier bonus: designer posts > endorsed > community
    const tier = p.tier ?? (p.isDesigner ? 1 : 4);
    const tierBonus = tier === 1 ? 8 : tier === 2 ? 3 : 1;

    // Coverage scaling — posts matching more query tokens rank higher
    score = (score + tierBonus) * (matched / tokens.length);

    results.push({ ...p, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

export interface CardSearchResult extends PhysicalCard {
  score: number;
}

export function searchCards(
  query: string,
  cards: PhysicalCard[],
  maxResults = 8,
  config?: SearchConfig,
): CardSearchResult[] {
  if (!cards || cards.length === 0) return [];

  const rawTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

  const synonyms = config?.synonyms;
  const tokens = [...rawTokens];
  if (synonyms) {
    for (const token of rawTokens) {
      const syns = synonyms[token];
      if (syns) for (const s of syns) tokens.push(s);
    }
  }

  if (tokens.length === 0) return [];

  const results: CardSearchResult[] = [];
  for (const c of cards) {
    const opsTitleLower = (c.ops?.title ?? "").toLowerCase();
    const reactionTitleLower = (c.reaction?.title ?? "").toLowerCase();
    const opsTextLower = (c.ops?.text ?? "").toLowerCase();
    const coachLower = ((c.coachNotes ?? "") + " " + (c.coachNotesShort ?? "")).toLowerCase();
    let score = 0;
    let matched = 0;
    for (const token of tokens) {
      const inOpsTitle = opsTitleLower.includes(token);
      const inReactionTitle = reactionTitleLower.includes(token);
      const inText = opsTextLower.includes(token);
      const inCoach = coachLower.includes(token);
      if (!inOpsTitle && !inReactionTitle && !inText && !inCoach) continue;
      matched++;
      if (inOpsTitle) score += 8;
      if (inReactionTitle) score += 6;
      if (inText) score += 3;
      if (inCoach) score += 1;
    }
    if (matched === 0) continue;
    score = score * (matched / tokens.length);
    results.push({ ...c, score });
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
