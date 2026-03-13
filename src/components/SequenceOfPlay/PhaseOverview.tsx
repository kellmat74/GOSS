import type { Phase } from "../../types/goss";

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
                    ? "bg-amber-100 font-semibold text-amber-900 dark:bg-amber-900/30 dark:text-amber-200"
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
                  <span className="ml-1 text-xs text-stone-400">
                    ({phase.ruleRef})
                  </span>
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
                              ? "bg-amber-50 font-semibold text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
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
