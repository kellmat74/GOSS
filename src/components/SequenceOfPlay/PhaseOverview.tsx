import type { Phase, Player } from "../../types/goss";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";

interface PhaseOverviewProps {
  phases: Phase[];
  currentPhaseIndex: number;
  currentSubPhaseIndex: number;
  currentSegmentIndex: number;
  onSelectPhase: (phaseIndex: number, subPhaseIndex?: number, segmentIndex?: number) => void;
}

const logisticsIds = new Set([
  "joint-logistics-phase",
  "truck-point-assignment-segment",
  "supply-interdiction-segment",
  "ammo-delivery-segment",
  "fuel-delivery-segment",
  "depot-placement-segment",
  "replacement-point-segment",
  "joint-fuel-value-determination-phase",
]);

function playerDot(player: Player, id: string) {
  if (logisticsIds.has(id)) return "bg-purple-500";
  if (player === "phasing") return "bg-green-500";
  if (player === "non-phasing") return "bg-red-500";
  return null;
}

function Dot({ player, id }: { player: Player; id: string }) {
  const color = playerDot(player, id);
  if (!color) return null;
  return <span className={`ml-1.5 inline-block h-2 w-2 rounded-sm ${color}`} />;
}

export function PhaseOverview({
  phases,
  currentPhaseIndex,
  currentSubPhaseIndex,
  currentSegmentIndex,
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
                    const segments = sub.subPhases ?? [];

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
                          <Dot player={sub.player} id={sub.id} />
                        </button>

                        {/* Show segments if this subPhase is current and has segments */}
                        {isSubCurrent && segments.length > 0 && (
                          <ol className="ml-5 mt-0.5 space-y-0.5">
                            {segments.map((seg, sgi) => {
                              const isSegCurrent =
                                isSubCurrent && sgi === currentSegmentIndex;
                              const isSegPast =
                                isSubCurrent && sgi < currentSegmentIndex;

                              return (
                                <li key={seg.id}>
                                  <button
                                    onClick={() => onSelectPhase(pi, si, sgi)}
                                    className={`w-full rounded px-2 py-0.5 text-left text-[11px] transition-colors ${
                                      isSegCurrent
                                        ? "bg-accent-50/50 font-semibold text-accent-700 dark:bg-accent-900/10 dark:text-accent-400"
                                        : isSegPast
                                        ? "text-stone-400 dark:text-stone-500"
                                        : "text-stone-400 hover:bg-stone-200 dark:text-stone-500 dark:hover:bg-stone-700"
                                    }`}
                                  >
                                    <span className="mr-1 text-stone-400">
                                      {isSegPast ? "\u2713" : "\u2023"}
                                    </span>
                                    {seg.name}
                                    <Dot player={seg.player} id={seg.id} />
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
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
