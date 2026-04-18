import type { LearnDecision, LearnBlock, CalloutVariant } from "../../types/learn";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";
import { RuleInlineText } from "../RulesReference/RuleInlineText";
import { SoPMarkdown } from "../SequenceOfPlay/SoPMarkdown";
import { Diagram } from "./Diagrams";

interface DecisionCardProps {
  decision: LearnDecision;
  /** Highlight this card as matching the current SoP segment. */
  active?: boolean;
  /** DOM id so LearnPanel can scrollIntoView. */
  anchorId?: string;
}

/**
 * Renders a single decision point — the pedagogical unit.
 * Header: title + "when" context + rule ref chips.
 * Body: ordered LearnBlocks (prose, diagram, ask, callout, rule).
 * Footer: appended scenario blocks if any.
 */
export function DecisionCard({ decision, active = false, anchorId }: DecisionCardProps) {
  return (
    <section
      id={anchorId}
      className={`rounded-xl border bg-white p-5 shadow-sm transition-[box-shadow,border-color] dark:bg-stone-800 ${
        active
          ? "border-accent-500 ring-2 ring-accent-500/30 dark:border-accent-400"
          : "border-stone-200 dark:border-stone-700"
      }`}
    >
      {/* Header */}
      <div className="mb-3 border-b border-stone-100 pb-3 dark:border-stone-700">
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
          {decision.title}
        </h3>
        <div className="mt-1 text-sm italic text-stone-500 dark:text-stone-400">
          <RuleInlineText text={decision.when} />
        </div>
        {decision.ruleRefs && decision.ruleRefs.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {decision.ruleRefs.map((ref) => (
              <RuleRefBadge key={ref} ruleRef={ref} />
            ))}
          </div>
        )}
      </div>

      {/* Scenario gate for this decision */}
      {decision.scenarioGate && (
        <div className="mb-3 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-2">
            {decision.scenarioModule && (
              <span className="mt-0.5 shrink-0 rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {decision.scenarioModule}
              </span>
            )}
            <span className="text-sm text-blue-800 dark:text-blue-300">
              <RuleInlineText text={decision.scenarioGate} />
            </span>
          </div>
        </div>
      )}

      {/* Body blocks */}
      <div>
        {decision.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>

      {/* Scenario-appended blocks */}
      {decision.appendedBlocks && decision.appendedBlocks.length > 0 && (
        <div className="mt-4 border-t-2 border-blue-400 pt-3 dark:border-blue-700">
          <div className="mb-2 flex items-center gap-2">
            {decision.scenarioModule && (
              <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {decision.scenarioModule}
              </span>
            )}
            <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Scenario Specifics
            </span>
          </div>
          {decision.appendedBlocks.map((block, i) => (
            <BlockRenderer key={`s-${i}`} block={block} />
          ))}
        </div>
      )}
    </section>
  );
}

// -----------------------------------------------------------------------------

function BlockRenderer({ block }: { block: LearnBlock }) {
  switch (block.kind) {
    case "prose":
      return (
        <div className="my-3 leading-relaxed text-stone-700 dark:text-stone-200">
          <SoPMarkdown content={block.text} />
        </div>
      );

    case "diagram":
      return (
        <figure className="my-3">
          <Diagram name={block.name} />
          {block.caption && (
            <figcaption className="mt-1 text-center text-xs italic text-stone-500 dark:text-stone-400">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "ask":
      return (
        <div className="my-3 rounded-lg border-l-4 border-accent-500 bg-accent-50/40 px-4 py-3 dark:bg-accent-900/10">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
            Ask Yourself
          </h4>
          <ul className="space-y-1.5">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-stone-700 dark:text-stone-200"
              >
                <span className="mt-0.5 shrink-0 text-accent-500">→</span>
                <span className="leading-relaxed">
                  <RuleInlineText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "callout":
      return <Callout variant={block.variant} text={block.text} />;

    case "rule":
      return (
        <div className="my-3 rounded-lg bg-stone-100 px-4 py-2 text-sm dark:bg-stone-700/50">
          <div className="flex items-center gap-2">
            <RuleRefBadge ruleRef={block.ruleRef} />
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Reference
            </span>
          </div>
          <p className="mt-1.5 leading-relaxed text-stone-600 dark:text-stone-300">
            <RuleInlineText text={block.text} />
          </p>
        </div>
      );
  }
}

// -----------------------------------------------------------------------------

function Callout({ variant, text }: { variant: CalloutVariant; text: string }) {
  const styles: Record<
    CalloutVariant,
    { border: string; bg: string; label: string; labelColor: string; icon: string }
  > = {
    why: {
      border: "border-l-4 border-indigo-500",
      bg: "bg-indigo-50/50 dark:bg-indigo-900/10",
      label: "Why",
      labelColor: "text-indigo-600 dark:text-indigo-400",
      icon: "◆",
    },
    tip: {
      border: "border-l-4 border-amber-500",
      bg: "bg-amber-50/50 dark:bg-amber-900/10",
      label: "Tip",
      labelColor: "text-amber-600 dark:text-amber-400",
      icon: "💡",
    },
    caution: {
      border: "border-l-4 border-rose-500",
      bg: "bg-rose-50/50 dark:bg-rose-900/10",
      label: "Caution",
      labelColor: "text-rose-600 dark:text-rose-400",
      icon: "!",
    },
    gotcha: {
      border: "border-l-4 border-orange-500",
      bg: "bg-orange-50/50 dark:bg-orange-900/10",
      label: "Gotcha",
      labelColor: "text-orange-600 dark:text-orange-400",
      icon: "⚠",
    },
  };
  const s = styles[variant];
  return (
    <div className={`my-3 rounded-lg px-4 py-2.5 ${s.border} ${s.bg}`}>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm ${s.labelColor}`}>{s.icon}</span>
        <span className={`text-xs font-semibold uppercase tracking-wide ${s.labelColor}`}>
          {s.label}
        </span>
      </div>
      <p className="mt-1 leading-relaxed text-stone-700 dark:text-stone-200">
        <RuleInlineText text={text} />
      </p>
    </div>
  );
}
