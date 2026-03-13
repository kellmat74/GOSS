import { useState, useMemo } from "react";
import type { RuleEntry } from "../../types/goss";

interface RulesSearchProps {
  rules: RuleEntry[];
}

export function RulesSearch({ rules }: RulesSearchProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

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
        placeholder="Search rules..."
        className="mb-4 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-stone-600 dark:bg-stone-800"
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-stone-400">
          {rules.length === 0
            ? "No rules loaded yet. Rules will be added from the rulebook."
            : "No matching rules found."}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((rule) => (
            <li
              key={rule.id}
              className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800"
            >
              <button
                onClick={() =>
                  setExpanded(expanded === rule.id ? null : rule.id)
                }
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <span className="mr-2 text-sm font-mono text-amber-600 dark:text-amber-400">
                    {rule.section}
                  </span>
                  <span className="font-medium">{rule.title}</span>
                </div>
                <span className="text-stone-400">
                  {expanded === rule.id ? "\u25B2" : "\u25BC"}
                </span>
              </button>

              {expanded === rule.id && (
                <div className="border-t border-stone-200 px-4 py-3 dark:border-stone-700">
                  <p className="mb-2 text-sm font-medium text-stone-500">
                    {rule.summary}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                    {rule.text}
                  </p>
                  {rule.crossRefs.length > 0 && (
                    <div className="mt-3 text-xs text-stone-400">
                      See also: {rule.crossRefs.join(", ")}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
