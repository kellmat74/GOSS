import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useRules } from "../../context/RulesContext";
import { useTables } from "../../context/TablesContext";
import { GlossaryHighlighter } from "../GlossaryHighlighter";
import { parseRuleRefNodes } from "../../utils/parseRuleRefs";

export function RuleModal() {
  const { activeRule, history, closeRule, goBack, goNext, goPrev, openRule, getRuleBySection, getRulesForSection, hasNext, hasPrev, getErrataForSection, getModuleLabel, getForumMentions } = useRules();
  const { openTable, tables } = useTables();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation: Escape, Left/Right arrows
  useEffect(() => {
    if (!activeRule) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (history.length > 0) goBack();
        else closeRule();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        goPrev();
      } else if (e.key === "ArrowRight" && hasNext) {
        goNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeRule, history, closeRule, goBack, goNext, goPrev, hasNext, hasPrev]);

  // Scroll to top when rule changes
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [activeRule]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) closeRule();
    },
    [closeRule]
  );

  if (!activeRule) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-150"
    >
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-4 dark:border-stone-700">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={goBack}
                  className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-200 transition-colors"
                  title="Go back"
                >
                  ←
                </button>
              )}
              <span className="rounded bg-accent-500/20 px-2 py-0.5 font-mono text-sm text-accent-700 dark:text-accent-400">
                §{activeRule.section}
              </span>
              {activeRule.legacyRef && (
                <span
                  className="font-mono text-xs text-stone-400 dark:text-stone-500"
                  title="Original rulebook section (BWN: 2020 edition)"
                >
                  (orig §{activeRule.legacyRef})
                </span>
              )}
              {activeRule.tableRef && tables[activeRule.tableRef] && (
                <button
                  onClick={() => openTable(activeRule.tableRef!)}
                  className="flex items-center gap-1 rounded bg-teal-500/20 px-2 py-0.5 text-xs font-medium text-teal-700 hover:bg-teal-500/30 dark:text-teal-400 dark:hover:bg-teal-500/20 transition-colors"
                  title="View table"
                >
                  <span>⊞</span>
                  <span>Table</span>
                </button>
              )}
            </div>
            <h2 className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100">
              {activeRule.title}
            </h2>
          </div>
          <button
            onClick={closeRule}
            className="ml-4 rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-4">
          <ModalBody
            activeRule={activeRule}
            getRulesForSection={getRulesForSection}
            getRuleBySection={getRuleBySection}
            openRule={openRule}
            getErrataForSection={getErrataForSection}
            getModuleLabel={getModuleLabel}
            getForumMentions={getForumMentions}
          />
        </div>

        {/* Footer with prev/next navigation */}
        <div className="flex items-center justify-between border-t border-stone-200 px-4 py-2 dark:border-stone-700">
          <button
            onClick={goPrev}
            disabled={!hasPrev}
            className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-30 disabled:pointer-events-none dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            ← Prev
          </button>
          <div className="text-xs text-stone-400 dark:text-stone-500">
            {history.length > 0
              ? `${history.length} in history · Esc to go back`
              : "Esc to close"}
          </div>
          <button
            onClick={goNext}
            disabled={!hasNext}
            className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-30 disabled:pointer-events-none dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function formatErrataDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

/** Combined view: base rule + errata + scenario overlays + hive mind + cross-refs */
function ModalBody({
  activeRule,
  getRulesForSection,
  getRuleBySection,
  openRule,
  getErrataForSection,
  getModuleLabel,
  getForumMentions,
}: {
  activeRule: import("../../types/goss").RuleEntry;
  getRulesForSection: (section: string) => import("../../types/goss").RuleEntry[];
  getRuleBySection: (section: string) => import("../../types/goss").RuleEntry | undefined;
  openRule: (sectionOrId: string) => void;
  getErrataForSection: (section: string) => import("../../context/RulesContext").ErrataForSection | null;
  getModuleLabel: (moduleId: string) => string;
  getForumMentions: (section: string) => import("../../context/RulesContext").ForumMention[] | null;
}) {
  // Get all rules for this section (base + scenario overlays)
  const allForSection = getRulesForSection(activeRule.section);
  // If the active rule is a scenario rule, show it alone first, then base
  // If the active rule is a base rule, show it first, then scenario overlays
  const baseRule = allForSection.find((r) => !r.module);
  const scenarioRules = allForSection.filter((r) => r.module);

  // Collect all cross-refs from all versions
  const allRefs = new Set<string>();
  for (const r of allForSection) {
    for (const ref of r.crossRefs) allRefs.add(ref);
  }

  const errata = getErrataForSection(activeRule.section);

  const TYPE_LABEL: Record<string, string> = {
    correction: "correction",
    clarification: "clarification",
    addition: "addition",
    removal: "removal",
  };

  return (
    <>
      {/* Base rule text */}
      {baseRule && (
        <RuleText text={baseRule.text} onRuleClick={openRule} />
      )}

      {/* Designer Q&A clarifications — section-scoped notes from a Q&A doc */}
      <DesignerQABlock
        clarifications={baseRule?.clarifications ?? activeRule.clarifications ?? []}
        onRuleClick={openRule}
      />

      {/* Errata callout — amber, between base rule and scenario overlays */}
      {errata && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 border-t-2 border-amber-400 pt-2 dark:border-amber-600">
            <span className="rounded bg-amber-500 px-1.5 py-0.5 text-xs font-bold text-white">
              ERRATA
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              as of {formatErrataDate(errata.asOf)}
            </span>
          </div>
          <div className="space-y-2">
            {errata.entries.map((entry, i) => (
              <div key={i} className="rounded-md bg-amber-50 p-3 dark:bg-amber-900/20">
                <span className="mb-1 inline-block rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
                  {TYPE_LABEL[entry.type] ?? entry.type}
                </span>
                <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                  {entry.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scenario overlays */}
      {scenarioRules.map((rule) => (
        <div key={rule.id} className="mt-4">
          <div className="mb-3 flex items-center gap-2 border-t border-blue-200 pt-3 dark:border-blue-800">
            <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
              {rule.module ? getModuleLabel(rule.module) : ""}
            </span>
            {rule.title !== baseRule?.title && (
              <span className="text-xs text-stone-500">{rule.title}</span>
            )}
          </div>
          <RuleText text={rule.text} onRuleClick={openRule} />
        </div>
      ))}

      {/* If no base rule (scenario-only section), nothing extra to show */}

      {/* BGG Hive Mind — Tier 1 designer-canonical posts referencing this rule */}
      <HiveMindBlock section={activeRule.section} getForumMentions={getForumMentions} />

      {/* Cross-references */}
      {allRefs.size > 0 && (
        <div className="mt-6 border-t border-stone-200 pt-4 dark:border-stone-700">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            See Also
          </h4>
          <div className="flex flex-col gap-1.5">
            {Array.from(allRefs).map((ref) => {
              const refRule = getRuleBySection(ref);
              return (
                <button
                  key={ref}
                  onClick={() => openRule(ref)}
                  className="flex items-baseline gap-2 rounded bg-stone-100 px-2 py-1.5 text-left text-xs hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
                >
                  <span className="shrink-0 font-mono text-accent-700 dark:text-accent-400">§{ref}</span>
                  {refRule && (
                    <span className="text-stone-500 dark:text-stone-400">{refRule.title}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

/** Designer Q&A — collapsible block of section-scoped clarifications from the
 *  designer Q&A PDF. Renders nothing if there are no clarifications. */
function DesignerQABlock({
  clarifications,
  onRuleClick,
}: {
  clarifications: { text: string; citation?: string }[];
  onRuleClick: (ref: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  if (clarifications.length === 0) return null;
  return (
    <div className="mt-4 border-t-2 border-teal-400 pt-3 dark:border-teal-700">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mb-2 flex w-full items-center gap-2 text-left"
      >
        <span className="rounded bg-teal-500 px-1.5 py-0.5 text-xs font-bold text-white">
          DESIGNER Q&amp;A
        </span>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {clarifications.length} clarification{clarifications.length === 1 ? "" : "s"}
        </span>
        <span className="ml-auto text-xs text-stone-400">{expanded ? "▾" : "▸"}</span>
      </button>
      {expanded && (
        <div className="space-y-2">
          {clarifications.map((c, i) => (
            <div key={i} className="rounded-md bg-teal-50 p-3 dark:bg-teal-900/20">
              <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                <InlineText text={c.text} onRuleClick={onRuleClick} />
              </p>
              {c.citation && (
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  — {c.citation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** "BGG Hive Mind" — collapsible list of designer-canonical forum posts that
 *  reference this rule section. Renders nothing if there are no mentions. */
function HiveMindBlock({
  section,
  getForumMentions,
}: {
  section: string;
  getForumMentions: (section: string) => import("../../context/RulesContext").ForumMention[] | null;
}) {
  const mentions = getForumMentions(section);
  const [expanded, setExpanded] = useState(false);
  if (!mentions || mentions.length === 0) return null;

  return (
    <div className="mt-6 border-t-2 border-purple-400 pt-3 dark:border-purple-700">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mb-2 flex w-full items-center gap-2 text-left"
      >
        <span className="rounded bg-purple-500 px-1.5 py-0.5 text-xs font-bold text-white">
          BGG HIVE MIND
        </span>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {mentions.length} designer post{mentions.length === 1 ? "" : "s"} on BGG reference this rule
        </span>
        <span className="ml-auto text-xs text-stone-400">{expanded ? "▾" : "▸"}</span>
      </button>
      {expanded && (
        <div className="space-y-2">
          {mentions.map((m, i) => {
            const date = m.createdAt ? m.createdAt.slice(0, 10) : "";
            const linkUrl = m.postUrl ?? m.threadUrl;
            return (
              <div key={i} className="rounded-md bg-purple-50 p-3 text-sm dark:bg-purple-900/20">
                <div className="mb-1 flex flex-wrap items-baseline gap-2 text-xs">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    @{m.author}
                  </span>
                  {date && <span className="text-stone-500">{date}</span>}
                  {m.threadTitle && (
                    <span className="italic text-stone-500 dark:text-stone-400">
                      — "{m.threadTitle}"
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                  {m.snippet}
                  {m.snippet.length >= 240 && "…"}
                </p>
                {linkUrl && (
                  <a
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block text-xs text-purple-700 underline hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Read full post on BGG ↗
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Render rule text with basic formatting */
function RuleText({ text, onRuleClick }: { text: string; onRuleClick: (ref: string) => void }) {
  // Split into paragraphs
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
      {paragraphs.map((para, i) => (
        <RuleParagraph key={i} text={para} onRuleClick={onRuleClick} />
      ))}
    </div>
  );
}

function RuleParagraph({ text, onRuleClick }: { text: string; onRuleClick: (ref: string) => void }) {
  const lines = text.split("\n");

  // Markdown pipe table: every non-empty line is a pipe-row, with a separator row second.
  const nonEmpty = lines.filter((l) => l.trim() !== "");
  const isTable =
    nonEmpty.length >= 2 &&
    nonEmpty.every((l) => l.trim().startsWith("|")) &&
    /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(nonEmpty[1]);

  if (isTable) {
    return <RuleTable rows={nonEmpty} onRuleClick={onRuleClick} />;
  }

  // Pure list: every non-empty line starts with • or -
  const isList = lines.every(
    (l) => l.trim().startsWith("•") || l.trim().startsWith("-") || l.trim() === ""
  );

  if (isList) {
    return (
      <ul className="ml-4 space-y-1 list-disc">
        {lines
          .filter((l) => l.trim())
          .map((l, i) => (
            <li key={i}>
              <InlineText
                text={l.replace(/^[\s•-]+/, "")}
                onRuleClick={onRuleClick}
              />
            </li>
          ))}
      </ul>
    );
  }

  // Pure numbered/lettered list
  const isNumberedList = lines.every(
    (l) => /^\s*\d+\)/.test(l) || /^\s*[a-z]\)/.test(l) || l.trim() === ""
  );

  if (isNumberedList) {
    return (
      <ol className="ml-4 space-y-1 list-decimal">
        {lines
          .filter((l) => l.trim())
          .map((l, i) => (
            <li key={i}>
              <InlineText
                text={l.replace(/^\s*[\da-z]\)\s*/, "")}
                onRuleClick={onRuleClick}
              />
            </li>
          ))}
      </ol>
    );
  }

  // Mixed content: has bullets/indented items mixed with prose — render line-by-line
  const hasStructuredLines = lines.some(
    (l) => l.trim().startsWith("•") || l.trim().startsWith("-") || /^\s{2,}/.test(l)
  );

  if (hasStructuredLines && lines.length > 1) {
    return (
      <div className="space-y-1">
        {lines.filter((l) => l.trim()).map((l, i) => {
          const indent = l.match(/^(\s*)/)?.[1].length ?? 0;
          const isBullet = l.trim().startsWith("•") || l.trim().startsWith("-");
          const mlClass = indent >= 4 ? "ml-8" : indent >= 2 ? "ml-4" : "";
          return (
            <p key={i} className={mlClass}>
              {isBullet && <span className="mr-1">•</span>}
              <InlineText
                text={isBullet ? l.replace(/^[\s•-]+/, "") : l.trimStart()}
                onRuleClick={onRuleClick}
              />
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <p>
      <InlineText text={text} onRuleClick={onRuleClick} />
    </p>
  );
}

/** Render inline text with bold markers and rule references */
function InlineText({ text, onRuleClick }: { text: string; onRuleClick: (ref: string) => void }) {
  // Wrap onRuleClick to match parseRuleRefNodes signature (openRule)
  const getRuleBySection = useRules().getRuleBySection;

  // Split on **bold** first; delegate ref parsing to the shared utility
  const boldParts = text.split(/(\*\*(?:[^*]|\*(?!\*))+\*\*)/g);

  return (
    <GlossaryHighlighter>
      <>
        {boldParts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            const inner = part.slice(2, -2);
            return (
              <strong key={i} className="font-semibold text-stone-900 dark:text-stone-100">
                {parseRuleRefNodes(inner, {
                  getRuleBySection,
                  openRule: onRuleClick,
                  keyPrefix: `m-b${i}`,
                })}
              </strong>
            );
          }
          return part ? (
            <React.Fragment key={i}>
              {parseRuleRefNodes(part, {
                getRuleBySection,
                openRule: onRuleClick,
                keyPrefix: `m-t${i}`,
              })}
            </React.Fragment>
          ) : null;
        })}
      </>
    </GlossaryHighlighter>
  );
}

/** Parse a markdown pipe row into trimmed cell strings. */
function parsePipeRow(line: string): string[] {
  // Strip leading/trailing pipe + whitespace, then split on |
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

/** Render a markdown pipe table as a styled HTML table. */
function RuleTable({
  rows,
  onRuleClick,
}: {
  rows: string[];
  onRuleClick: (ref: string) => void;
}) {
  if (rows.length < 2) return null;
  const headerCells = parsePipeRow(rows[0]);
  // rows[1] is the separator (---|---), skip it
  const bodyRows = rows.slice(2).map(parsePipeRow);

  return (
    <div className="overflow-x-auto">
      <table className="my-1 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-stone-300 dark:border-stone-600">
            {headerCells.map((cell, i) => (
              <th
                key={i}
                className="px-2 py-1.5 text-left font-semibold text-stone-700 dark:text-stone-200"
              >
                <InlineText text={cell} onRuleClick={onRuleClick} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((cells, ri) => (
            <tr
              key={ri}
              className="border-b border-stone-200 last:border-b-0 dark:border-stone-700"
            >
              {cells.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-2 py-1 align-top text-stone-600 dark:text-stone-300"
                >
                  <InlineText text={cell} onRuleClick={onRuleClick} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
