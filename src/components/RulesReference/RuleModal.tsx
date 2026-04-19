import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRules } from "../../context/RulesContext";
import { useTables } from "../../context/TablesContext";
import { GlossaryHighlighter } from "../GlossaryHighlighter";
import { parseRuleRefNodes } from "../../utils/parseRuleRefs";

export function RuleModal() {
  const { activeRule, history, closeRule, goBack, goNext, goPrev, openRule, getRuleBySection, getRulesForSection, hasNext, hasPrev, getErrataForSection } = useRules();
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

/** Combined view: base rule + errata + scenario overlays + cross-refs */
function ModalBody({
  activeRule,
  getRulesForSection,
  getRuleBySection,
  openRule,
  getErrataForSection,
}: {
  activeRule: import("../../types/goss").RuleEntry;
  getRulesForSection: (section: string) => import("../../types/goss").RuleEntry[];
  getRuleBySection: (section: string) => import("../../types/goss").RuleEntry | undefined;
  openRule: (sectionOrId: string) => void;
  getErrataForSection: (section: string) => import("../../context/RulesContext").ErrataForSection | null;
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
              {rule.module === "war" ? "Wacht am Rhein" : rule.module === "hurtgen" ? "Hurtgen" : rule.module === "lucky-forward" ? "Lucky Forward" : rule.module === "atlantic-wall" ? "Atlantic Wall" : rule.module}
            </span>
            {rule.title !== baseRule?.title && (
              <span className="text-xs text-stone-500">{rule.title}</span>
            )}
          </div>
          <RuleText text={rule.text} onRuleClick={openRule} />
        </div>
      ))}

      {/* If no base rule (scenario-only section), nothing extra to show */}

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
