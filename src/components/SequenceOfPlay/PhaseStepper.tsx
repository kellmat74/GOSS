import type { Phase, SubPhase, SoPProgress, TimeOfDay } from "../../types/goss";
import { Breadcrumb, type BreadcrumbItem } from "../Breadcrumb";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";
import { RuleInlineText } from "../RulesReference/RuleInlineText";
import { isActiveForTimeOfDay } from "../../utils/timingFilter";

interface PhaseStepperProps {
  phase: Phase | null;
  subPhase: SubPhase | null;
  progress: SoPProgress;
  totalPhases: number;
  onNext: () => void;
  onPrev: () => void;
  onToggleChecklist: (key: string) => void;
  onClearChecklist: () => void;
  onAdvanceTurn: () => void;
  onGoToPhase: (phaseIndex: number, subPhaseIndex?: number) => void;
  timeOfDay: TimeOfDay;
}

export function PhaseStepper({
  phase,
  subPhase,
  progress,
  totalPhases,
  onNext,
  onPrev,
  onToggleChecklist,
  onClearChecklist,
  onAdvanceTurn,
  onGoToPhase,
  timeOfDay,
}: PhaseStepperProps) {
  if (!phase) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-stone-400">
        <p>No phases loaded.</p>
      </div>
    );
  }

  const isLastPhase = progress.currentPhaseIndex === totalPhases - 1;
  const isLastSubPhase =
    progress.currentSubPhaseIndex === phase.subPhases.length - 1 ||
    (phase.subPhases.length === 0 && progress.currentSubPhaseIndex === -1);
  const isAtEnd = isLastPhase && isLastSubPhase;

  const active = subPhase ?? phase;
  const checklistItems = subPhase?.checklist ?? [];

  // Build breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Game Turn",
    },
    {
      label: phase.name,
      ruleRef: phase.ruleRef,
      onClick: subPhase
        ? () => onGoToPhase(progress.currentPhaseIndex)
        : undefined,
    },
  ];
  if (subPhase) {
    breadcrumbItems.push({
      label: subPhase.name,
      ruleRef: subPhase.ruleRef,
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumb items={breadcrumbItems} />

      {/* Phase header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-stone-400">
          <span>
            Phase {progress.currentPhaseIndex + 1} of {totalPhases}
          </span>
          {phase.timing && phase.timing !== "every-turn" && (
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {phase.timing.replace("-", " ").toUpperCase()}
            </span>
          )}
          {phase.player !== "both" && (
            <span className="rounded bg-stone-200 px-1.5 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-700 dark:text-stone-300">
              {phase.player}
            </span>
          )}
        </div>
        <h2 className="mt-1 text-2xl font-bold">{phase.name}</h2>
        {phase.ruleRef && (
          <RuleRefBadge ruleRef={phase.ruleRef} className="mt-0.5" />
        )}
      </div>

      {/* Sub-phase indicator */}
      {subPhase && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
            Sub-Phase
          </div>
          <div className="mt-0.5 text-lg font-semibold text-amber-900 dark:text-amber-200">
            {subPhase.name}
          </div>
          {subPhase.ruleRef && (
            <RuleRefBadge ruleRef={subPhase.ruleRef} className="mt-0.5" />
          )}
        </div>
      )}

      {/* Skipped banner */}
      {!isActiveForTimeOfDay(active === subPhase ? subPhase?.timing : phase.timing, timeOfDay) && (
        <div className="mb-4 rounded-lg border border-stone-300 bg-stone-100 p-3 text-center text-sm text-stone-500 dark:border-stone-600 dark:bg-stone-800">
          ⏭ This {subPhase ? "sub-phase" : "phase"} is skipped during{" "}
          <span className="font-semibold">{timeOfDay}</span> turns
        </div>
      )}

      {/* Description */}
      <p className="mb-4 leading-relaxed text-stone-600 dark:text-stone-300">
        <RuleInlineText text={active.description} />
      </p>

      {/* Notes */}
      {active.notes.length > 0 && (
        <ul className="mb-4 space-y-1.5">
          {active.notes.map((note, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm text-stone-500 dark:text-stone-400"
            >
              <span className="mt-0.5 text-stone-300">&bull;</span>
              <RuleInlineText text={note} />
            </li>
          ))}
        </ul>
      )}

      {/* Checklist */}
      {checklistItems.length > 0 && (
        <div className="mb-6 rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-800">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
              Checklist
            </h3>
            <button
              onClick={onClearChecklist}
              className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              Reset
            </button>
          </div>
          <ul className="space-y-2">
            {checklistItems.map((item, i) => {
              const key = `${phase.id}.${subPhase?.id ?? "main"}.${i}`;
              const checked = progress.completedChecklist[key] ?? false;
              return (
                <li key={i}>
                  <label className="flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleChecklist(key)}
                      className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <RuleInlineText
                      text={item}
                      className={
                        checked
                          ? "text-stone-400 line-through"
                          : "text-stone-700 dark:text-stone-200"
                      }
                    />
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-stone-200 pt-4 dark:border-stone-700">
        <button
          onClick={onPrev}
          disabled={
            progress.currentPhaseIndex === 0 &&
            progress.currentSubPhaseIndex <= -1
          }
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
        >
          &larr; Previous
        </button>

        {isAtEnd ? (
          <button
            onClick={onAdvanceTurn}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Next Turn &rarr;
          </button>
        ) : (
          <button
            onClick={onNext}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
