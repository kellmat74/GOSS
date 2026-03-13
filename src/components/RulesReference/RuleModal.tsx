import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRules } from "../../context/RulesContext";

export function RuleModal() {
  const { activeRule, history, closeRule, goBack, openRule } = useRules();
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
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-stone-700 bg-stone-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-700 px-6 py-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={goBack}
                  className="rounded p-1 text-stone-400 hover:bg-stone-700 hover:text-stone-200 transition-colors"
                  title="Go back"
                >
                  ←
                </button>
              )}
              <span className="rounded bg-amber-600/20 px-2 py-0.5 font-mono text-sm text-amber-400">
                §{activeRule.section}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-stone-100">
              {activeRule.title}
            </h2>
            {activeRule.summary && (
              <p className="mt-1 text-sm text-stone-400">{activeRule.summary}</p>
            )}
          </div>
          <button
            onClick={closeRule}
            className="ml-4 rounded p-1.5 text-stone-400 hover:bg-stone-700 hover:text-stone-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-4">
          <RuleText text={activeRule.text} onRuleClick={openRule} />

          {/* Cross-references */}
          {activeRule.crossRefs.length > 0 && (
            <div className="mt-6 border-t border-stone-700 pt-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                See Also
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeRule.crossRefs.map((ref) => (
                  <button
                    key={ref}
                    onClick={() => openRule(ref)}
                    className="rounded bg-stone-800 px-2 py-1 text-xs font-mono text-amber-400 hover:bg-stone-700 hover:text-amber-300 transition-colors"
                  >
                    §{ref}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with history indicator */}
        {history.length > 0 && (
          <div className="border-t border-stone-700 px-6 py-2 text-xs text-stone-500">
            {history.length} rule{history.length !== 1 ? "s" : ""} in history · Press Esc to go back
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Render rule text with basic formatting */
function RuleText({ text, onRuleClick }: { text: string; onRuleClick: (ref: string) => void }) {
  // Split into paragraphs
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-stone-300">
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

/** Render inline text with bold markers and rule references */
function InlineText({ text, onRuleClick }: { text: string; onRuleClick: (ref: string) => void }) {
  // Parse **bold**, *Important:*, and (X.Y.Z) rule references
  const parts: (string | { type: "bold"; text: string } | { type: "ref"; ref: string })[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Find next special token
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const refMatch = remaining.match(/\((\d+\.\d+(?:\.\d+)?(?:[a-z])?)\)/);

    const boldIdx = boldMatch?.index ?? Infinity;
    const refIdx = refMatch?.index ?? Infinity;

    if (boldIdx === Infinity && refIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIdx <= refIdx && boldMatch) {
      parts.push(remaining.slice(0, boldIdx));
      parts.push({ type: "bold", text: boldMatch[1] });
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    } else if (refMatch) {
      parts.push(remaining.slice(0, refIdx));
      parts.push({ type: "ref", ref: refMatch[1] });
      remaining = remaining.slice(refIdx! + refMatch[0].length);
    }
  }

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === "string") return <span key={i}>{part}</span>;
        if (part.type === "bold")
          return (
            <strong key={i} className="font-semibold text-stone-100">
              {part.text}
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
              className="font-mono text-amber-400 hover:text-amber-300 hover:underline"
            >
              ({part.ref})
            </button>
          );
        return null;
      })}
    </>
  );
}
