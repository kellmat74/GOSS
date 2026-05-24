import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRules } from "../../context/RulesContext";
import { useGlossary } from "../../context/GlossaryContext";
import type { GlossaryEntry } from "../../data/glossary";

/**
 * Renders pre-rendered HTML (from `marked`) but wires up:
 *   - clickable rule refs like (X.Y.Z) — opens the RuleModal
 *   - glossary-term tooltips for acronyms/keywords — hover or tap
 *
 * Both passes operate on the HTML string at render time. To avoid mangling
 * tag attributes, the glossary replacement splits the HTML into alternating
 * tag and text segments and only processes the text segments. Tooltips are
 * managed by React via a single portal driven by delegated pointer events
 * on the container.
 *
 * Used by ActionsPanel (procedure steps, play-aid blocks, intro/outro
 * prose) and by TableModal (compiled play-aid pages).
 */
export function RuleAwareHtml({ html, className }: { html: string; className?: string }) {
  const { openRule } = useRules();
  const { getEntry, regex: glossaryRegex } = useGlossary();
  const ref = useRef<HTMLDivElement>(null);

  // Active glossary term tooltip state
  const [active, setActive] = useState<
    | { entry: GlossaryEntry; x: number; y: number; above: boolean }
    | null
  >(null);

  const processed = useMemo(() => {
    // 1) Wrap (X.Y.Z) and (5.2.1, 7.3) into clickable rule-ref buttons.
    const SECTION_RE = /\d+\.\d+(?:\.\d+(?:\.\d+)?)?(?:[a-z])?/g;
    const GROUP_RE = /\((\d[^)]{0,200})\)/g;
    let result = html.replace(GROUP_RE, (_full, inner) => {
      const wrapped = inner.replace(
        SECTION_RE,
        (refStr: string) =>
          `<button type="button" class="rule-ref-inline" data-rule="${refStr}">${refStr}</button>`
      );
      return `(${wrapped})`;
    });

    // 2) Wrap glossary terms. Split on tags so we only touch text segments,
    //    preventing accidental matches inside attributes like class="..."
    //    or data-rule="...".
    const parts = result.split(/(<[^>]+>)/g);
    const escape = (s: string) =>
      s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
    for (let i = 0; i < parts.length; i++) {
      // Even indices are text; odd indices are tags.
      if (i % 2 === 1) continue;
      // Reset state on each segment
      glossaryRegex.lastIndex = 0;
      parts[i] = parts[i].replace(glossaryRegex, (match, term) => {
        if (!getEntry(term)) return match;
        return `<span class="glossary-term-inline" data-term="${escape(term)}">${escape(match)}</span>`;
      });
    }
    return parts.join("");
  }, [html, glossaryRegex, getEntry]);

  // Rule-ref click delegation
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t && t.classList.contains("rule-ref-inline")) {
        e.preventDefault();
        e.stopPropagation();
        const r = t.getAttribute("data-rule");
        if (r) openRule(r);
      }
    };
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [openRule, processed]);

  // Glossary tooltip event delegation: hover (desktop) + tap (touch)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const computePosition = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect();
      const above = rect.top > 200;
      const halfWidth = 180;
      const margin = 8;
      const x = Math.max(
        halfWidth + margin,
        Math.min(rect.left + rect.width / 2, window.innerWidth - halfWidth - margin)
      );
      return { x, y: above ? rect.top - 8 : rect.bottom + 8, above };
    };

    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const t = e.target as HTMLElement;
      if (!t.classList.contains("glossary-term-inline")) return;
      const term = t.getAttribute("data-term");
      if (!term) return;
      const entry = getEntry(term);
      if (!entry) return;
      const pos = computePosition(t);
      setActive({ entry, ...pos });
    };

    const onPointerOut = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const t = e.target as HTMLElement;
      if (!t.classList.contains("glossary-term-inline")) return;
      setActive(null);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      const t = e.target as HTMLElement;
      if (!t.classList.contains("glossary-term-inline")) return;
      e.preventDefault();
      e.stopPropagation();
      const term = t.getAttribute("data-term");
      if (!term) return;
      const entry = getEntry(term);
      if (!entry) return;
      setActive((cur) => {
        if (cur?.entry.term === entry.term) return null;
        const pos = computePosition(t);
        return { entry, ...pos };
      });
    };

    el.addEventListener("pointerover", onPointerOver);
    el.addEventListener("pointerout", onPointerOut);
    el.addEventListener("pointerdown", onPointerDown);
    return () => {
      el.removeEventListener("pointerover", onPointerOver);
      el.removeEventListener("pointerout", onPointerOut);
      el.removeEventListener("pointerdown", onPointerDown);
    };
  }, [getEntry, processed]);

  // Dismiss touch tooltip on outside tap
  useEffect(() => {
    if (!active) return;
    const handler = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.classList?.contains("glossary-term-inline")) return; // handled above
      if (t.closest("[data-glossary-tooltip]")) return;
      setActive(null);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [active]);

  return (
    <>
      <div
        ref={ref}
        className={className}
        dangerouslySetInnerHTML={{ __html: processed }}
      />
      {active &&
        createPortal(
          <div
            data-glossary-tooltip
            style={{
              position: "fixed",
              left: `${active.x}px`,
              top: `${active.y}px`,
              transform: active.above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
              zIndex: 150,
              maxWidth: "min(360px, 90vw)",
            }}
            className="rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 text-sm shadow-lg dark:border-stone-600 dark:bg-stone-800"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {active.entry.term}
              </span>
              {active.entry.abbr && (
                <span className="rounded bg-accent-600 px-1.5 py-0.5 text-xs font-mono text-white">
                  {active.entry.abbr}
                </span>
              )}
              {active.entry.ruleRef && (
                <span className="text-xs font-mono text-accent-700 dark:text-accent-400">
                  §{active.entry.ruleRef}
                </span>
              )}
              {active.entry.custom && (
                <span className="text-[10px] italic text-stone-400 dark:text-stone-500">
                  quick ref
                </span>
              )}
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-snug">
              {active.entry.definition}
            </p>
          </div>,
          document.body
        )}
    </>
  );
}
