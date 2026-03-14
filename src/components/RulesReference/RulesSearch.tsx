import { useState, useMemo, useCallback } from "react";
import type { RuleEntry } from "../../types/goss";
import { useRules } from "../../context/RulesContext";
import { buildRulesTree, type TreeNode } from "../../utils/rulesTree";

interface RulesSearchProps {
  rules: RuleEntry[];
}

export function RulesSearch({ rules }: RulesSearchProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { openRule } = useRules();

  const tree = useMemo(() => {
    // For the tree, hide scenario rules that overlay a base section
    // (they're shown in the combined modal). Keep scenario-only sections.
    const baseSections = new Set(
      rules.filter((r) => !r.module).map((r) => r.section)
    );
    const treeRules = rules.filter(
      (r) => !r.module || !baseSections.has(r.section)
    );
    return buildRulesTree(treeRules);
  }, [rules]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    // Filter out scenario overlays that duplicate a base section
    const baseSections = new Set(
      rules.filter((r) => !r.module).map((r) => r.section)
    );
    return rules
      .filter((r) => !r.module || !baseSections.has(r.section))
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.section.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q)
      );
  }, [rules, query]);

  const toggleExpand = useCallback((section: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }, []);

  const hasQuery = query.trim().length > 0;

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
        {hasQuery
          ? `${filtered.length} of ${rules.length} rules matching "${query}"`
          : `${rules.length} rules`}
      </p>

      {hasQuery ? (
        /* Flat filtered list when searching */
        filtered.length === 0 ? (
          <p className="py-8 text-center text-stone-400">
            No matching rules found.
          </p>
        ) : (
          <ul className="space-y-1">
            {filtered.map((rule) => (
              <RuleRow key={rule.id} rule={rule} onOpen={openRule} />
            ))}
          </ul>
        )
      ) : (
        /* Tree view when not searching */
        <ul className="space-y-1">
          {tree.map((node) => (
            <TreeRow
              key={node.rule.id}
              node={node}
              depth={0}
              expanded={expanded}
              onToggle={toggleExpand}
              onOpen={openRule}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Flat rule row (used in search results) */
function RuleRow({
  rule,
  onOpen,
}: {
  rule: RuleEntry;
  onOpen: (section: string) => void;
}) {
  return (
    <li className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800">
      <button
        onClick={() => onOpen(rule.id)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
      >
        <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-mono text-white ${rule.module ? "bg-blue-500 dark:bg-blue-700" : "bg-accent-500 dark:bg-stone-700 dark:text-accent-400"}`}>
          {rule.section}
        </span>
        {rule.module && (
          <span className="shrink-0 rounded bg-blue-500/20 px-1 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400">
            {rule.module === "war" ? "WaR" : rule.module}
          </span>
        )}
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
  );
}

/** Recursive tree row */
function TreeRow({
  node,
  depth,
  expanded,
  onToggle,
  onOpen,
}: {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (section: string) => void;
  onOpen: (section: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expanded.has(node.rule.section);
  const indent = depth === 0 ? "" : depth === 1 ? "ml-4" : "ml-8";

  return (
    <>
      <li
        className={`rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800 ${indent}`}
      >
        <div className="flex w-full items-center">
          {/* Expand/collapse button */}
          {hasChildren ? (
            <button
              onClick={() => onToggle(node.rule.section)}
              className="flex items-center justify-center w-10 py-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors shrink-0"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span className={`text-xs transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                ▶
              </span>
            </button>
          ) : (
            <span className="w-10 shrink-0" />
          )}

          {/* Rule content — opens modal */}
          <button
            onClick={() => onOpen(node.rule.id)}
            className="flex flex-1 items-center gap-3 py-3 pr-4 text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors min-w-0"
          >
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-mono text-white ${node.rule.module ? "bg-blue-500 dark:bg-blue-700" : "bg-accent-500 dark:bg-stone-700 dark:text-accent-400"}`}>
              {node.rule.section}
            </span>
            {node.rule.module && (
              <span className="shrink-0 rounded bg-blue-500/20 px-1 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400">
                {node.rule.module === "war" ? "WaR" : node.rule.module}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <span className="font-medium">{node.rule.title}</span>
            </div>
            {hasChildren && (
              <span className="shrink-0 text-xs text-stone-400">
                {node.children.length}
              </span>
            )}
          </button>
        </div>
      </li>

      {/* Children */}
      {hasChildren && isExpanded &&
        node.children.map((child) => (
          <TreeRow
            key={child.rule.id}
            node={child}
            depth={depth + 1}
            expanded={expanded}
            onToggle={onToggle}
            onOpen={onOpen}
          />
        ))}
    </>
  );
}
