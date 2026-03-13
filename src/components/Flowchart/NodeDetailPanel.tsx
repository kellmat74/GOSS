import type { Phase } from "../../types/goss";

export type NodeDetail = {
  name: string;
  ruleRef?: string;
  description: string;
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
            <span className="inline-block mt-0.5 rounded bg-stone-700 px-1.5 py-0.5 text-xs text-stone-400">
              Rule {detail.ruleRef}
            </span>
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
        {detail.description}
      </p>

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
                <span>{note}</span>
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
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Look up phase/subphase detail by ruleRef from sequence data */
export function findDetailByRuleRef(
  phases: Phase[],
  ruleRef: string
): NodeDetail | null {
  for (const phase of phases) {
    if (phase.ruleRef === ruleRef) {
      return {
        name: phase.name,
        ruleRef: phase.ruleRef,
        description: phase.description,
        notes: phase.notes,
        checklist: [],
        timing: phase.timing,
        player: phase.player,
      };
    }
    for (const sub of phase.subPhases) {
      if (sub.ruleRef === ruleRef) {
        return {
          name: sub.name,
          ruleRef: sub.ruleRef,
          description: sub.description,
          notes: sub.notes,
          checklist: sub.checklist,
          timing: sub.timing,
          player: sub.player,
        };
      }
    }
  }
  return null;
}
