import { useEffect, useMemo, useRef } from "react";
import { useRules } from "../../context/RulesContext";

/**
 * Renders pre-rendered HTML (from `marked`) but wires up clickable rule refs.
 * At render time, regex-rewrites any `(X.Y)` / `(X.Y.Z)` / `(X.Y.Z, A.B)` etc.
 * found in the HTML into a `<button class="rule-ref-inline">`. A delegated
 * click handler on the container catches those and dispatches to
 * `openRule()` from RulesContext.
 *
 * Used by ActionsPanel (procedure steps, play-aid blocks, intro/outro
 * prose) and by TableModal (compiled play-aid pages). Keep in one place
 * so all HTML surfaces share the same rule-ref behavior.
 */
export function RuleAwareHtml({ html, className }: { html: string; className?: string }) {
  const { openRule } = useRules();
  const ref = useRef<HTMLDivElement>(null);

  const processed = useMemo(() => {
    // Mirrors src/utils/parseRuleRefs.tsx: find a parenthesized group that
    // STARTS with a digit, then wrap each individual section ref inside it
    // separately so comma-separated lists like (5.2.1, 7.3) yield two
    // independent clickable links.
    const SECTION_RE = /\d+\.\d+(?:\.\d+(?:\.\d+)?)?(?:[a-z])?/g;
    const GROUP_RE = /\((\d[^)]{0,200})\)/g;

    return html.replace(GROUP_RE, (_full, inner) => {
      const wrapped = inner.replace(
        SECTION_RE,
        (refStr: string) =>
          `<button type="button" class="rule-ref-inline" data-rule="${refStr}">${refStr}</button>`
      );
      return `(${wrapped})`;
    });
  }, [html]);

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

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}
