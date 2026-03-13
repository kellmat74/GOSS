import { useState, useMemo } from "react";
import type { RuleEntry } from "../../types/goss";
import { useRules } from "../../context/RulesContext";

interface RulesSearchProps {
  rules: RuleEntry[];
}

export function RulesSearch({ rules }: RulesSearchProps) {
  const [query, setQuery] = useState("");
  const { openRule } = useRules();

  const filtered = useMemo(() => {
    if (!query.trim()) return rules;
    const q = query.toLowerCase();
    return rules.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.section.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q)
    );
  }, [rules, query]);

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-4 text-2xl font-bold">Rules Reference</h2>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search rules by title, section number, or content..."
        className="mb-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-stone-600 dark:bg-stone-800"
      />

      <p className="mb-4 text-xs text-stone-500">
        {filtered.length} of {rules.length} rules
        {query.trim() ? ` matching "${query}"` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-stone-400">
          {rules.length === 0
            ? "No rules loaded yet."
            : "No matching rules found."}
        </p>
      ) : (
        <ul className="space-y-1">
          {filtered.map((rule) => (
            <li
              key={rule.id}
              className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800"
            >
              <button
                onClick={() => openRule(rule.section)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
              >
                <span className="shrink-0 rounded bg-accent-500 px-1.5 py-0.5 text-xs font-mono text-white dark:bg-stone-700 dark:text-accent-400">
                  {rule.section}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-medium">{rule.title}</span>
                </div>
                {rule.crossRefs.length > 0 && (
                  <span className="shrink-0 text-xs text-stone-500">
                    {rule.crossRefs.length} refs
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
