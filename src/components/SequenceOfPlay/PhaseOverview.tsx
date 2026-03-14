import type { Phase } from "../../types/goss";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";

interface PhaseOverviewProps {
  phases: Phase[];
  currentPhaseIndex: number;
  currentSubPhaseIndex: number;
  onSelectPhase: (phaseIndex: number, subPhaseIndex?: number) => void;
}

export function PhaseOverview({
  phases,
  currentPhaseIndex,
  currentSubPhaseIndex,
  onSelectPhase,
}: PhaseOverviewProps) {
  return (
    <nav className="p-2">
      <ol className="space-y-0.5">
        {phases.map((phase, pi) => {
          const isCurrent = pi === currentPhaseIndex;
          const isPast = pi < currentPhaseIndex;

          return (
            <li key={phase.id}>
              <button
                onClick={() => onSelectPhase(pi)}
                className={`w-full rounded px-2 py-1.5 text-left text-sm transition-colors ${
                  isCurrent
                    ? "bg-accent-100 font-semibold text-accent-900 dark:bg-accent-900/30 dark:text-accent-200"
                    : isPast
                    ? "text-stone-400 dark:text-stone-500"
                    : "text-stone-600 hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-700"
                }`}
              >
                <span className="mr-1.5 text-xs text-stone-400">
                  {isPast ? "\u2713" : `${pi + 1}.`}
                </span>
                {phase.name}
                {phase.ruleRef && (
                  <RuleRefBadge ruleRef={phase.ruleRef} className="ml-1" />
                )}
              </button>

              {/* Show sub-phases if this is the current phase */}
              {isCurrent && phase.subPhases.length > 0 && (
                <ol className="ml-5 mt-0.5 space-y-0.5">
                  {phase.subPhases.map((sub, si) => {
                    const isSubCurrent =
                      isCurrent && si === currentSubPhaseIndex;
                    const isSubPast = isCurrent && si < currentSubPhaseIndex;

                    return (
                      <li key={sub.id}>
                        <button
                          onClick={() => onSelectPhase(pi, si)}
                          className={`w-full rounded px-2 py-1 text-left text-xs transition-colors ${
                            isSubCurrent
                              ? "bg-accent-50 font-semibold text-accent-800 dark:bg-accent-900/20 dark:text-accent-300"
                              : isSubPast
                              ? "text-stone-400 dark:text-stone-500"
                              : "text-stone-500 hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-700"
                          }`}
                        >
                          <span className="mr-1 text-stone-400">
                            {isSubPast ? "\u2713" : "\u2022"}
                          </span>
                          {sub.name}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
