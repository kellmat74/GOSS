import { useState, useRef, useEffect, useCallback } from "react";
import type { RuleEntry, Phase, PhysicalCard } from "../../types/goss";

import { searchRules, searchSequence, searchLearn, searchForum, searchCards, type SearchConfig, type LearnSearchResult, type ForumPostEntry, type ForumSearchResult, type CardSearchResult } from "../../utils/rulesSearch";
import type { LearnChapter } from "../../types/learn";
import { RuleInlineText } from "../RulesReference/RuleInlineText";

interface AskPanelProps {
  rules: RuleEntry[];
  phases?: Phase[];
  workerUrl?: string;
  systemPromptPreamble?: string;
  exampleQuestions?: string[];
  /** Game id used to scope chat history in localStorage so games don't share threads. */
  gameId?: string;
  /** Per-game search config (synonym expansion, module aliases) for retrieval. */
  searchConfig?: SearchConfig;
  /** Learn chapters — hand-authored teaching content used as AI Coach context. */
  learnChapters?: LearnChapter[];
  /** Auxiliary "coach context" JSON (e.g. Often Overlooked Rules) injected wholesale. */
  coachContext?: unknown;
  /** Curated forum knowledge (Tier 1+2 designer/endorsed posts) — injected wholesale with provenance. */
  forumContext?: unknown;
  /** Physical card deck — used to inject relevant card coach notes into RAG context. */
  cards?: PhysicalCard[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const DEFAULT_WORKER_URL = "https://goss-ask-proxy.kellmat74.workers.dev";

const DEFAULT_EXAMPLE_QUESTIONS = [
  "How does supply work?",
  "What happens when a unit is out of ammo?",
  "How do ZOCs affect movement?",
  "Explain the ground assault procedure",
  "What are the stacking limits?",
  "How does weather affect combat?",
];

interface SequenceContext {
  name: string;
  ruleRef?: string;
  content: string;
  notes: string[];
}

function buildSystemPrompt(
  topRules: RuleEntry[],
  summaryRules: RuleEntry[],
  sequenceItems: SequenceContext[] = [],
  learnItems: LearnSearchResult[] = [],
  coachContext?: unknown,
  forumHits: ForumSearchResult[] = [],
  preamble?: string,
  cardHits: CardSearchResult[] = [],
): string {
  const fullText = topRules
    .map((r) => `[${r.section}] ${r.title}: ${r.text}`)
    .join("\n\n");

  const summaries = summaryRules
    .map((r) => `[${r.section}] ${r.title}: ${r.summary}`)
    .join("\n");

  let sequenceSection = "";
  if (sequenceItems.length > 0) {
    const seqText = sequenceItems
      .map((s) => {
        const ref = s.ruleRef ? ` (${s.ruleRef})` : "";
        const tips = s.notes.length > 0 ? `\nTips:\n${s.notes.map((n) => `- ${n}`).join("\n")}` : "";
        return `### ${s.name}${ref}\n${s.content}${tips}`;
      })
      .join("\n\n");
    sequenceSection = `\n\n## Relevant procedures & tips from the Sequence of Play:\n\n${seqText}`;
  }

  let learnSection = "";
  if (learnItems.length > 0) {
    const learnText = learnItems
      .map((l) => {
        const refs = l.ruleRefs.length > 0 ? ` (refs: ${l.ruleRefs.join(", ")})` : "";
        return `### ${l.chapterTitle} — ${l.decisionTitle}${refs}\nWhen: ${l.when}\n\n${l.body}`;
      })
      .join("\n\n");
    learnSection = `\n\n## Pedagogical context from the AI Coach (Learn) — use this to teach the "why", not just recite rules:\n\n${learnText}`;
  }

  let coachSection = "";
  if (coachContext && typeof coachContext === "object") {
    // Strip metadata keys starting with underscore for compactness
    const filtered: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(coachContext as Record<string, unknown>)) {
      if (!k.startsWith("_")) filtered[k] = v;
    }
    if (Object.keys(filtered).length > 0) {
      coachSection = `\n\n## Coach context (auxiliary teaching notes, always injected):\n\n${JSON.stringify(filtered, null, 2)}`;
    }
  }

  let forumSection = "";
  if (forumHits.length > 0) {
    const fmt = (p: ForumSearchResult) => {
      const date = p.createdAt ? ` (${(p.createdAt ?? "").slice(0, 10)})` : "";
      const url = p.postUrl ?? p.threadUrl ?? "";
      const tierLabel =
        p.tier === 1 ? "DESIGNER" : p.tier === 2 ? "ENDORSED" : "COMMUNITY";
      const thread = p.threadTitle ? ` — "${p.threadTitle}"` : "";
      return `### [${tierLabel}] @${p.author}${date}${thread}\nURL: ${url}\n${p.body}`;
    };
    forumSection =
      `\n\n## Relevant BGG forum posts (rank-ordered by relevance to the question; cite the URL when quoting):\n\n` +
      forumHits.map(fmt).join("\n\n---\n\n");
  }

  let cardsSection = "";
  if (cardHits.length > 0) {
    const fmt = (c: CardSearchResult) => {
      const opsLabel = c.ops?.title ? `OPS: "${c.ops.title}"` : "";
      const reactionLabel = c.reaction?.title ? ` / Reaction: "${c.reaction.title}"` : "";
      const coach = c.coachNotes ?? c.coachNotesShort ?? "";
      return `### Card ${c.cardNumber} (${c.side}) — ${opsLabel}${reactionLabel}\n${coach}`;
    };
    cardsSection = `\n\n## Relevant card coach notes:\n\n` + cardHits.map(fmt).join("\n\n---\n\n");
  }

  const defaultPreamble = "You are a rules expert for a complex tabletop wargame system.";
  return `${preamble ?? defaultPreamble} Answer questions about the rules accurately, citing specific rule sections in parenthesized format like (3.2.1) so they render as clickable links.

Be concise but thorough. If a question is ambiguous, explain the relevant rules and note the ambiguity. Always cite the specific rule section numbers. When the pedagogical context below is relevant, use it to explain the "why" behind the rules — not just recite them.

## Most relevant rules (full text):

${fullText}

## Additional related rules (summaries):

${summaries}${sequenceSection}${learnSection}${coachSection}${cardsSection}${forumSection}`;
}

function CopyButton({ text, isUser, question }: { text: string; isUser: boolean; question?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const copyText = question ? `Q: ${question}\n\nA: ${text}` : text;
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className={`absolute top-1 right-1 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
        isUser
          ? "text-white/70 hover:text-white hover:bg-white/10"
          : "text-stone-400 hover:text-stone-600 hover:bg-stone-200 dark:hover:text-stone-200 dark:hover:bg-stone-700"
      }`}
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

const LEGACY_STORAGE_KEY = "goss-ask-history";

function storageKeyForGame(gameId?: string): string {
  return gameId ? `wc-ask-history-${gameId}` : LEGACY_STORAGE_KEY;
}

function loadHistory(gameId?: string): ChatMessage[] {
  try {
    const key = storageKeyForGame(gameId);
    // One-time migration: if no per-game history exists but legacy key does,
    // migrate it into the GOSS-scoped key (GOSS was the only game when the
    // legacy key was used).
    if (gameId === "goss" && !localStorage.getItem(key)) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        localStorage.setItem(key, legacy);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[], gameId?: string) {
  try {
    localStorage.setItem(storageKeyForGame(gameId), JSON.stringify(messages));
  } catch { /* quota exceeded — silently fail */ }
}

export function AskPanel({
  rules,
  phases = [],
  workerUrl = DEFAULT_WORKER_URL,
  systemPromptPreamble,
  exampleQuestions = DEFAULT_EXAMPLE_QUESTIONS,
  gameId,
  searchConfig,
  learnChapters = [],
  coachContext,
  forumContext,
  cards = [],
}: AskPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory(gameId));

  // Reload history when game changes
  useEffect(() => {
    setMessages(loadHistory(gameId));
  }, [gameId]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Persist messages to localStorage (scoped by gameId)
  useEffect(() => {
    if (messages.length > 0) saveHistory(messages, gameId);
  }, [messages, gameId]);

  // Auto-resize textarea
  const handleInput = useCallback((value: string) => {
    setInput(value);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, []);

  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = text ?? input.trim();
      if (!messageText || loading) return;

      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";
      setError(null);

      const userMessage: ChatMessage = { role: "user", content: messageText };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setLoading(true);

      try {
        // Top 10 get full text, next 15 get summaries only
        const relevant = searchRules(messageText, rules, 25, searchConfig);
        const topRules = relevant.slice(0, 10).map((r) => r.rule);
        const summaryRules = relevant.slice(10).map((r) => r.rule);

        // Search sequence content & tips for additional context
        const seqResults = phases.length > 0
          ? searchSequence(messageText, phases, 5, searchConfig)
          : [];

        // Search Learn chapters/decisions for pedagogical context
        const learnResults = learnChapters.length > 0
          ? searchLearn(messageText, learnChapters, 5, searchConfig)
          : [];

        // Search curated forum corpus (Tier 1 designer + Tier 2 endorsed + Tier 3 community)
        // for posts relevant to THIS question
        const forumPosts = forumContext && typeof forumContext === "object"
          ? [
              ...(((forumContext as { tier1?: ForumPostEntry[] }).tier1) ?? []),
              ...(((forumContext as { tier2?: ForumPostEntry[] }).tier2) ?? []),
              ...(((forumContext as { tier3?: ForumPostEntry[] }).tier3) ?? []),
            ]
          : [];
        const forumHits = forumPosts.length > 0
          ? searchForum(messageText, forumPosts, 12, searchConfig)
          : [];

        const cardHits = cards.length > 0
          ? searchCards(messageText, cards, 8, searchConfig)
          : [];

        const response = await fetch(workerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: buildSystemPrompt(
              topRules,
              summaryRules,
              seqResults,
              learnResults,
              coachContext,
              forumHits,
              systemPromptPreamble,
              cardHits,
            ),
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(
            errData?.error?.message ?? `API error (${response.status})`
          );
        }

        const data = await response.json();
        const assistantText =
          data.content?.[0]?.text ?? "Sorry, I got an empty response.";

        setMessages([
          ...newMessages,
          { role: "assistant", content: assistantText },
        ]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to get response"
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, rules]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col" style={{ height: "calc(100vh - 8rem)" }}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl font-bold">Ask the Rules</h2>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); localStorage.removeItem(storageKeyForGame(gameId)); }}
              className="rounded px-2 py-1 text-xs text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <p className="mb-4 text-sm text-stone-500">
        AI-powered Q&A across {rules.length} rules
      </p>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
        {messages.length === 0 && !loading && (
          <div className="py-8 text-center">
            <p className="mb-4 text-stone-500">Try asking:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {exampleQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 hover:border-accent-500 hover:text-accent-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-accent-400 dark:hover:text-accent-400 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`group flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`relative max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent-500 text-white"
                  : "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200"
              }`}
            >
              {msg.role === "assistant" ? (
                <AssistantMessage content={msg.content} />
              ) : (
                msg.content
              )}
              <CopyButton
                text={msg.content}
                isUser={msg.role === "user"}
                question={msg.role === "assistant" ? messages.slice(0, i).reverse().find(m => m.role === "user")?.content : undefined}
              />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-stone-100 px-4 py-3 text-sm dark:bg-stone-800">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="relative shrink-0">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the rules..."
          rows={1}
          className="w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-3 pr-12 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-stone-600 dark:bg-stone-800"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 rounded-md bg-accent-500 p-1.5 text-white disabled:opacity-40 hover:bg-accent-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Render a line of text with bold + rule refs + clickable URLs. */
function MarkdownLine({ text }: { text: string }) {
  // Strip bold markers; we don't currently style them
  const stripped = text.replace(/\*\*/g, "");
  // Detect URLs (http/https) and render them as <a>. Other segments pass
  // through the rule-ref / glossary inline renderer.
  const urlRe = /https?:\/\/[^\s)\]]+[^\s)\].,;:!?]/g;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = urlRe.exec(stripped))) {
    if (match.index > lastIdx) {
      parts.push(
        <RuleInlineText key={`t${key++}`} text={stripped.slice(lastIdx, match.index)} />,
      );
    }
    const url = match[0];
    const isBgg = url.includes("boardgamegeek.com");
    parts.push(
      <a
        key={`u${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline ${
          isBgg
            ? "text-purple-600 hover:text-purple-500 dark:text-purple-400"
            : "text-accent-700 hover:text-accent-500 dark:text-accent-400"
        }`}
      >
        {isBgg ? "BGG ↗" : url}
      </a>,
    );
    lastIdx = urlRe.lastIndex;
  }
  if (lastIdx < stripped.length) {
    parts.push(<RuleInlineText key={`t${key++}`} text={stripped.slice(lastIdx)} />);
  }
  return parts.length > 0 ? <>{parts}</> : <RuleInlineText text={stripped} />;
}

/** Render assistant message with clickable rule refs */
function AssistantMessage({ content }: { content: string }) {
  // Split on double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, i) => {
        const lines = para.split("\n");

        // Heading lines (any # level)
        const firstLine = lines[0].trim();
        const headingMatch = firstLine.match(/^(#{1,4})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const cls = level === 1 ? "font-bold text-base mt-2" : "font-semibold mt-1";
          return (
            <h3 key={i} className={cls}>
              <MarkdownLine text={headingMatch[2]} />
            </h3>
          );
        }

        // Bullet lists
        const isList = lines.every(
          (l) => l.startsWith("- ") || l.startsWith("* ") || l.trim() === ""
        );

        if (isList && lines.some((l) => l.startsWith("- ") || l.startsWith("* "))) {
          return (
            <ul key={i} className="list-disc pl-4 space-y-1">
              {lines
                .filter((l) => l.startsWith("- ") || l.startsWith("* "))
                .map((l, j) => (
                  <li key={j}>
                    <MarkdownLine text={l.slice(2)} />
                  </li>
                ))}
            </ul>
          );
        }

        return (
          <p key={i}>
            <MarkdownLine text={para.replace(/\n/g, " ")} />
          </p>
        );
      })}
    </div>
  );
}
