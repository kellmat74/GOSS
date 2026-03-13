import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import type { RuleEntry } from "../../types/goss";
import { useRules } from "../../context/RulesContext";
import { searchRules, getSnippet } from "../../utils/rulesSearch";
import { RuleInlineText } from "../RulesReference/RuleInlineText";

interface AskPanelProps {
  rules: RuleEntry[];
}

const EXAMPLE_SEARCHES = [
  "rounding rule",
  "supply",
  "combat resolution",
  "movement",
  "weather",
  "reinforcement",
  "stacking",
  "ZOC",
];

export function AskPanel({ rules }: AskPanelProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { openRule } = useRules();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce query
  const handleChange = useCallback((value: string) => {
    setQuery(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(value), 200);
  }, []);

  const results = useMemo(
    () => searchRules(debouncedQuery, rules),
    [debouncedQuery, rules]
  );

  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-1 text-2xl font-bold">Ask the Rules</h2>
      <p className="mb-4 text-sm text-stone-500">
        Search all 595 GOSS 2020 rules by keyword or topic
      </p>

      {/* Search input */}
      <div className="relative mb-4">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search rules by keyword or topic..."
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 pl-10 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-stone-600 dark:bg-stone-800"
        />
        <svg
          className="absolute left-3 top-3.5 h-4 w-4 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Empty state */}
      {!hasQuery && (
        <div className="py-8 text-center">
          <p className="mb-4 text-stone-500">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLE_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleChange(term)}
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 hover:border-accent-500 hover:text-accent-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-accent-400 dark:hover:text-accent-400 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      {hasQuery && (
        <p className="mb-3 text-xs text-stone-500">
          {results.length === 0
            ? "No rules match your search"
            : `${results.length} result${results.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Results */}
      {hasQuery && results.length > 0 && (
        <ul className="space-y-2">
          {results.map(({ rule, matchedFields }) => (
            <li
              key={rule.id}
              className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800"
            >
              <button
                onClick={() => openRule(rule.section)}
                className="w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
              >
                {/* Header row */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="shrink-0 rounded bg-accent-500 px-1.5 py-0.5 text-xs font-mono text-white dark:bg-stone-700 dark:text-accent-400">
                    {rule.section}
                  </span>
                  <span className="font-medium">
                    <HighlightText text={rule.title} query={debouncedQuery} />
                  </span>
                </div>

                {/* Snippet */}
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3">
                  <HighlightText
                    text={getSnippet(
                      matchedFields.includes("text")
                        ? rule.text
                        : rule.summary,
                      debouncedQuery
                    )}
                    query={debouncedQuery}
                  />
                </p>

                {/* Cross-refs */}
                {rule.crossRefs.length > 0 && (
                  <div className="mt-2 text-xs text-stone-400">
                    <RuleInlineText
                      text={`See also: ${rule.crossRefs.map((r) => `(${r})`).join(", ")}`}
                    />
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Highlight matching query tokens in text */
function HighlightText({ text, query }: { text: string; query: string }) {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  if (tokens.length === 0) return <>{text}</>;

  // Build regex matching any token
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-accent-500/20 text-accent-700 dark:bg-accent-400/20 dark:text-accent-300 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
