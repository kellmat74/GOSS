import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRules } from "../../context/RulesContext";

export function RuleModal() {
  const { activeRule, history, closeRule, goBack, openRule, getRuleBySection, getRulesForSection } = useRules();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Escape to close
  useEffect(() => {
    if (!activeRule) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (history.length > 0) goBack();
        else closeRule();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeRule, history, closeRule, goBack]);

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
          />
        </div>

        {/* Footer with history indicator */}
        {history.length > 0 && (
          <div className="border-t border-stone-200 px-6 py-2 text-xs text-stone-500 dark:border-stone-700">
            {history.length} rule{history.length !== 1 ? "s" : ""} in history · Press Esc to go back
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Combined view: base rule + scenario overlays + cross-refs */
function ModalBody({
  activeRule,
  getRulesForSection,
  getRuleBySection,
  openRule,
}: {
  activeRule: import("../../types/goss").RuleEntry;
  getRulesForSection: (section: string) => import("../../types/goss").RuleEntry[];
  getRuleBySection: (section: string) => import("../../types/goss").RuleEntry | undefined;
  openRule: (sectionOrId: string) => void;
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

  return (
    <>
      {/* Base rule text */}
      {baseRule && (
        <RuleText text={baseRule.text} onRuleClick={openRule} />
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
  // Check if this is a list (lines starting with bullet markers)
  const lines = text.split("\n");
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

  // Check if it starts with numbered items (1), 2), etc.)
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

  return (
    <p>
      <InlineText text={text} onRuleClick={onRuleClick} />
    </p>
  );
}

/** Render rule refs inside already-bold text (no bold parsing to avoid recursion) */
function InlineRefs({ text, onRuleClick }: { text: string; onRuleClick: (ref: string) => void }) {
  const parts: (string | { ref: string })[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const parenMatch = remaining.match(/\((\d+\.\d+(?:\.\d+)?(?:[a-z])?)\)/);
    const bareMatch = remaining.match(/(?<![.\d])(\d+\.\d+\.\d+(?:[a-z])?)(?![.\d])/);
    const parenIdx = parenMatch?.index ?? Infinity;
    const bareIdx = bareMatch?.index ?? Infinity;
    const minIdx = Math.min(parenIdx, bareIdx);

    if (minIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (parenIdx <= bareIdx && parenMatch) {
      parts.push(remaining.slice(0, parenIdx));
      parts.push({ ref: parenMatch[1] });
      remaining = remaining.slice(parenIdx + parenMatch[0].length);
    } else if (bareMatch) {
      parts.push(remaining.slice(0, bareIdx));
      parts.push({ ref: bareMatch[1] });
      remaining = remaining.slice(bareIdx + bareMatch[0].length);
    }
  }

  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onRuleClick(part.ref); }}
            className="font-mono text-accent-700 hover:text-accent-500 hover:underline dark:text-accent-400 dark:hover:text-accent-300"
          >
            ({part.ref})
          </button>
        )
      )}
    </>
  );
}

/** Render inline text with bold markers and rule references */
function InlineText({ text, onRuleClick }: { text: string; onRuleClick: (ref: string) => void }) {
  // Parse **bold**, *Important:*, and (X.Y.Z) rule references
  const parts: (string | { type: "bold"; text: string } | { type: "ref"; ref: string })[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Find next special token
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Match (X.Y.Z) in parens OR bare X.Y.Z preceded by word boundary (not mid-number)
    const parenRefMatch = remaining.match(/\((\d+\.\d+(?:\.\d+)?(?:[a-z])?)\)/);
    // Bare refs require 3-part (X.Y.Z) to avoid false positives on "1.5 miles" etc.
    const bareRefMatch = remaining.match(/(?<![.\d])(\d+\.\d+\.\d+(?:[a-z])?)(?![.\d])/);

    const boldIdx = boldMatch?.index ?? Infinity;
    const parenRefIdx = parenRefMatch?.index ?? Infinity;
    const bareRefIdx = bareRefMatch?.index ?? Infinity;

    // Pick the earliest match
    const minIdx = Math.min(boldIdx, parenRefIdx, bareRefIdx);

    if (minIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIdx === minIdx && boldMatch) {
      parts.push(remaining.slice(0, boldIdx));
      parts.push({ type: "bold", text: boldMatch[1] });
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    } else if (parenRefIdx === minIdx && parenRefMatch) {
      parts.push(remaining.slice(0, parenRefIdx));
      parts.push({ type: "ref", ref: parenRefMatch[1] });
      remaining = remaining.slice(parenRefIdx + parenRefMatch[0].length);
    } else if (bareRefMatch) {
      parts.push(remaining.slice(0, bareRefIdx));
      parts.push({ type: "ref", ref: bareRefMatch[1] });
      remaining = remaining.slice(bareRefIdx + bareRefMatch[0].length);
    }
  }

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === "string") return <span key={i}>{part}</span>;
        if (part.type === "bold")
          return (
            <strong key={i} className="font-semibold text-stone-900 dark:text-stone-100">
              <InlineRefs text={part.text} onRuleClick={onRuleClick} />
            </strong>
          );
        if (part.type === "ref")
          return (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                onRuleClick(part.ref);
              }}
              className="font-mono text-accent-700 hover:text-accent-500 hover:underline dark:text-accent-400 dark:hover:text-accent-300"
            >
              ({part.ref})
            </button>
          );
        return null;
      })}
    </>
  );
}
