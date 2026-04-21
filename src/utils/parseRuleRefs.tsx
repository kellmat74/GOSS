/**
 * Shared rule-reference parser.
 *
 * Handles the full range of reference formats found in SoP and rule text:
 *   (7.2)              — simple single ref
 *   (7.2.1/7.2.2)      — slash-separated dual refs
 *   (11.0, 19.5)       — comma-separated multi-refs
 *   (22.6.2 #5)        — hash sub-item (links section, shows "#5" as text)
 *   (20.1.2 – 20.2.4)  — range (links start, shows rest as text)
 *   (6.1 and ...)      — mixed (links section, shows trailing text)
 *   [8.2.4, 8.5]       — square-bracket section refs
 *   [NWT2E 13.2]       — Taiwan GSR ref → clickable if found, else badge
 *   [GSR 5.5.1]        — GSR ref → clickable if found, else badge
 *   [NWK 5.1]          — other game-prefix refs → non-clickable badge
 */
import React from "react";

interface ParseOptions {
  getRuleBySection: (s: string) => unknown;
  openRule: (s: string) => void;
  keyPrefix?: string;
}

/**
 * Parse a plain (non-bold) text segment and return React nodes with
 * section refs linked and game-prefix refs badged.
 */
export function parseRuleRefNodes(
  text: string,
  { getRuleBySection, openRule, keyPrefix = "r" }: ParseOptions
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let remaining = text;
  let idx = 0;

  // Master regex — three alternatives in priority order:
  //   1. [NWT2E X.Y] or [GSR X.Y] — GSR refs, clickable if rule found
  //   2. [NW...]                   — other game-prefix refs, non-clickable badge
  //   3. (...) or [...] starting with digit — numeric section ref group
  const MASTER =
    /\[NWT2E\s+(?:GSR\s+)?(\d[\d.a-z]{0,40})\]|\[GSR\s+(\d[\d.a-z]{0,40})\]|\[NW[^\]]{1,120}\]|[\(\[](\d[^\)\]]{0,120})[\)\]]/;

  while (remaining.length > 0) {
    const m = remaining.match(MASTER);
    if (!m || m.index === undefined) {
      nodes.push(<span key={`${keyPrefix}-e${idx++}`}>{remaining}</span>);
      break;
    }

    // Text before the match
    if (m.index > 0) {
      nodes.push(
        <span key={`${keyPrefix}-t${idx++}`}>{remaining.slice(0, m.index)}</span>
      );
    }

    const fullMatch = m[0];

    if (m[1] !== undefined || m[2] !== undefined) {
      // ── GSR ref: [NWT2E X.Y] or [GSR X.Y] ───────────────────────────────
      const rawSection = (m[1] ?? m[2]).trim();
      const gsrSection = `GSR.${rawSection}`;
      const hasRule = !!getRuleBySection(gsrSection);

      if (hasRule) {
        nodes.push(
          <span
            key={`${keyPrefix}-gsr${idx++}`}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              openRule(gsrSection);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openRule(gsrSection);
              }
            }}
            className="mx-0.5 inline-block cursor-pointer rounded bg-teal-100 px-1 py-0.5 font-mono text-[10px] text-teal-700 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50"
          >
            {fullMatch}
          </span>
        );
      } else {
        // Section not found — render as plain badge
        nodes.push(
          <span
            key={`${keyPrefix}-gsr${idx++}`}
            className="mx-0.5 inline-block rounded bg-stone-200 px-1 py-0.5 font-mono text-[10px] text-stone-500 dark:bg-stone-700 dark:text-stone-400"
          >
            {fullMatch}
          </span>
        );
      }
    } else if (fullMatch.startsWith("[NW")) {
      // ── Other game-prefix badge (non-clickable) ───────────────────────────
      nodes.push(
        <span
          key={`${keyPrefix}-gp${idx++}`}
          className="mx-0.5 inline-block rounded bg-stone-200 px-1 py-0.5 font-mono text-[10px] text-stone-500 dark:bg-stone-700 dark:text-stone-400"
        >
          {fullMatch}
        </span>
      );
    } else {
      // ── Numeric section-ref group ─────────────────────────────────────────
      const inner = m[3]; // captured inner content (starts with a digit)
      const openBracket = fullMatch[0];
      const closeBracket = fullMatch[fullMatch.length - 1];

      const sectionRe = /\d+\.\d+(?:\.\d+(?:\.\d+)?)?(?:[a-z])?/g;

      const innerNodes: React.ReactNode[] = [
        <span key={`${keyPrefix}-ob${idx}`}>{openBracket}</span>,
      ];
      let cursor = 0;
      let si = 0;
      let sm: RegExpExecArray | null;

      while ((sm = sectionRe.exec(inner)) !== null) {
        if (sm.index > cursor) {
          innerNodes.push(
            <span key={`${keyPrefix}-it${idx}-${si}`}>
              {inner.slice(cursor, sm.index)}
            </span>
          );
        }
        innerNodes.push(
          renderSectionRef(sm[0], `${keyPrefix}-ir${idx}-${si}`, getRuleBySection, openRule)
        );
        cursor = sm.index + sm[0].length;
        si++;
      }

      if (cursor < inner.length) {
        innerNodes.push(
          <span key={`${keyPrefix}-tail${idx}`}>{inner.slice(cursor)}</span>
        );
      }

      innerNodes.push(
        <span key={`${keyPrefix}-cb${idx}`}>{closeBracket}</span>
      );

      nodes.push(
        <React.Fragment key={`${keyPrefix}-g${idx++}`}>
          {innerNodes}
        </React.Fragment>
      );
    }

    remaining = remaining.slice(m.index + fullMatch.length);
  }

  return nodes;
}

/** Renders a bare section number as a clickable link or plain span. */
function renderSectionRef(
  section: string,
  key: string | number,
  getRuleBySection: (s: string) => unknown,
  openRule: (s: string) => void
): React.ReactNode {
  const hasRule = !!getRuleBySection(section);
  if (!hasRule) {
    return <span key={key}>{section}</span>;
  }
  return (
    <span
      key={key}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        openRule(section);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openRule(section);
        }
      }}
      className="cursor-pointer font-mono text-accent-700 hover:text-accent-500 hover:underline dark:text-accent-400 dark:hover:text-accent-300"
    >
      {section}
    </span>
  );
}
