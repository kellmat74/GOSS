import type { Phase } from "../../types/goss";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";
import { RuleInlineText } from "../RulesReference/RuleInlineText";
import { SoPMarkdown } from "../SequenceOfPlay/SoPMarkdown";

export type NodeDetail = {
  name: string;
  ruleRef?: string;
  description: string;
  content?: string;
  notes: string[];
  checklist: string[];
  timing?: string;
  player: string;
};

interface NodeDetailPanelProps {
  detail: NodeDetail;
  onClose: () => void;
}

export function NodeDetailPanel({ detail, onClose }: NodeDetailPanelProps) {
  return (
    <div className="absolute right-0 top-0 z-50 h-full w-80 overflow-y-auto border-l border-stone-700 bg-stone-900 p-4 shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-100">{detail.name}</h3>
          {detail.ruleRef && (
            <RuleRefBadge ruleRef={detail.ruleRef} className="mt-0.5" />
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 rounded p-1 text-stone-400 hover:bg-stone-700 hover:text-stone-200"
        >
          ✕
        </button>
      </div>

      {/* Timing & Player badges */}
      <div className="mb-3 flex flex-wrap gap-2">
        {detail.timing && detail.timing !== "every-turn" && (
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {detail.timing.replace(/-/g, " ").toUpperCase()}
          </span>
        )}
        {detail.player !== "both" && (
          <span className="rounded bg-stone-200 px-1.5 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-700 dark:text-stone-300">
            {detail.player}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-stone-300">
        <RuleInlineText text={detail.description} />
      </p>

      {/* Content — verbatim PAC markdown */}
      {detail.content && (
        <div className="mb-4">
          <SoPMarkdown content={detail.content} />
        </div>
      )}

      {/* Notes */}
      {detail.notes.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
            Notes
          </h4>
          <ul className="space-y-1.5">
            {detail.notes.map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-stone-400"
              >
                <span className="mt-0.5 text-stone-600">&bull;</span>
                <RuleInlineText text={note} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Checklist */}
      {detail.checklist.length > 0 && (
        <div>
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
            Checklist
          </h4>
          <ul className="space-y-1.5">
            {detail.checklist.map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-stone-300"
              >
                <span className="mt-0.5 text-stone-500">☐</span>
                <RuleInlineText text={item} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Look up phase/subphase detail by ruleRef from sequence data (recursive) */
export function findDetailByRuleRef(
  phases: Phase[],
  ruleRef: string
): NodeDetail | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function search(items: any[]): NodeDetail | null {
    for (const item of items) {
      if (item.ruleRef === ruleRef) {
        return {
          name: item.name,
          ruleRef: item.ruleRef,
          description: item.description,
          content: item.content,
          notes: item.notes ?? [],
          checklist: item.checklist ?? [],
          timing: item.timing,
          player: item.player,
        };
      }
      if (item.subPhases) {
        const found = search(item.subPhases);
        if (found) return found;
      }
    }
    return null;
  }
  return search(phases);
}
