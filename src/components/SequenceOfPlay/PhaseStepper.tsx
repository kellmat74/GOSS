import { useEffect, useRef } from "react";
import type { Phase, SubPhase, SoPProgress } from "../../types/goss";
import { Breadcrumb, type BreadcrumbItem } from "../Breadcrumb";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";
import { RuleInlineText } from "../RulesReference/RuleInlineText";
import { SoPMarkdown } from "./SoPMarkdown";
import { useTables } from "../../context/TablesContext";

interface PhaseStepperProps {
  phase: Phase | null;
  subPhase: SubPhase | null;
  segment: SubPhase | null;
  progress: SoPProgress;
  totalPhases: number;
  onNext: () => void;
  onPrev: () => void;
  onToggleChecklist: (key: string) => void;
  onClearChecklist: () => void;
  onAdvanceTurn: () => void;
  onGoToPhase: (phaseIndex: number, subPhaseIndex?: number, segmentIndex?: number) => void;
}

export function PhaseStepper({
  phase,
  subPhase,
  segment,
  progress,
  totalPhases,
  onNext,
  onPrev,
  onToggleChecklist,
  onClearChecklist,
  onAdvanceTurn,
  onGoToPhase,
}: PhaseStepperProps) {
  if (!phase) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-stone-400">
        <p>No phases loaded.</p>
      </div>
    );
  }

  const { openTable, tables } = useTables();
  const topRef = useRef<HTMLDivElement>(null);

  // Scroll the main container to top when step changes (shows header bar)
  useEffect(() => {
    const main = topRef.current?.closest("main");
    if (main) {
      main.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [progress.currentPhaseIndex, progress.currentSubPhaseIndex, progress.currentSegmentIndex]);

  const isLastPhase = progress.currentPhaseIndex === totalPhases - 1;
  const isLastSubPhase =
    progress.currentSubPhaseIndex === phase.subPhases.length - 1 ||
    (phase.subPhases.length === 0 && progress.currentSubPhaseIndex === -1);
  const segments = subPhase?.subPhases ?? [];
  const isLastSegment =
    progress.currentSegmentIndex === segments.length - 1 ||
    (segments.length === 0 && progress.currentSegmentIndex === -1);
  const isAtEnd = isLastPhase && isLastSubPhase && isLastSegment;

  const active = segment ?? subPhase ?? phase;
  const activeSubPhase = segment ?? subPhase;
  const checklistItems = activeSubPhase?.checklist ?? [];

  // Checklist key includes segment when present
  const checklistKeyPrefix = segment
    ? `${phase.id}.${subPhase!.id}.${segment.id}`
    : `${phase.id}.${subPhase?.id ?? "main"}`;

  // Build breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Game Turn" },
    {
      label: phase.name,
      ruleRef: phase.ruleRef,
      onClick: (subPhase || segment)
        ? () => onGoToPhase(progress.currentPhaseIndex)
        : undefined,
    },
  ];
  if (subPhase) {
    breadcrumbItems.push({
      label: subPhase.name,
      ruleRef: subPhase.ruleRef,
      onClick: segment
        ? () => onGoToPhase(progress.currentPhaseIndex, progress.currentSubPhaseIndex)
        : undefined,
    });
  }
  if (segment) {
    breadcrumbItems.push({
      label: segment.name,
      ruleRef: segment.ruleRef,
    });
  }

  return (
    <div ref={topRef} className="mx-auto max-w-2xl">
      <Breadcrumb items={breadcrumbItems} />

      {/* Phase header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-stone-400">
          <span>
            Phase {progress.currentPhaseIndex + 1} of {totalPhases}
          </span>
          {phase.timing && phase.timing !== "every-turn" && (
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {phase.timing.replace(/-/g, " ").toUpperCase()}
            </span>
          )}
          {phase.player !== "both" && !phase.id.endsWith("-player-turn") && (
            <span className="rounded bg-stone-200 px-1.5 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-700 dark:text-stone-300">
              {phase.player}
            </span>
          )}
        </div>
        <h2 className="mt-1 text-2xl font-bold">{phase.name}</h2>
        <div className="mt-0.5 flex items-center gap-2">
          {phase.ruleRef && <RuleRefBadge ruleRef={phase.ruleRef} />}
          {phase.tableRefs?.map((id) => tables[id] && (
            <TableRefButton key={id} id={id} label={tables[id].title} onOpen={openTable} />
          ))}
        </div>
      </div>

      {/* Sub-phase indicator */}
      {subPhase && (
        <div className="mb-4 rounded-lg border border-accent-300 bg-accent-500 p-3 dark:border-accent-800 dark:bg-accent-900/20">
          <div className="text-xs font-medium uppercase tracking-wide text-accent-200 dark:text-accent-400">
            Sub-Phase
          </div>
          <div className="mt-0.5 text-lg font-semibold text-white dark:text-accent-200">
            {subPhase.name}
          </div>
          <div className="mt-1 flex items-center gap-2">
            {subPhase.ruleRef && <RuleRefBadge ruleRef={subPhase.ruleRef} />}
            {subPhase.tableRefs?.map((id) => tables[id] && (
              <TableRefButton key={id} id={id} label={tables[id].title} onOpen={openTable} />
            ))}
            {subPhase.timing && subPhase.timing !== "every-turn" && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {subPhase.timing.replace(/-/g, " ").toUpperCase()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Segment indicator */}
      {segment && (
        <div className="mb-4 ml-4 rounded-lg border border-stone-300 bg-stone-100 p-3 dark:border-stone-600 dark:bg-stone-800">
          <div className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Step
          </div>
          <div className="mt-0.5 text-base font-semibold text-stone-800 dark:text-stone-200">
            {segment.name}
          </div>
          <div className="mt-1 flex items-center gap-2">
            {segment.ruleRef && <RuleRefBadge ruleRef={segment.ruleRef} />}
            {segment.tableRefs?.map((id) => tables[id] && (
              <TableRefButton key={id} id={id} label={tables[id].title} onOpen={openTable} />
            ))}
            {segment.timing && segment.timing !== "every-turn" && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {segment.timing.replace(/-/g, " ").toUpperCase()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Scenario gate banner */}
      {active.scenarioGate && (
        <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-center gap-2">
            {active.scenarioModule && (
              <span className="shrink-0 rounded bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white">
                {active.scenarioModule}
              </span>
            )}
            <span className="text-sm text-blue-800 dark:text-blue-300">
              <RuleInlineText text={active.scenarioGate} />
            </span>
          </div>
        </div>
      )}

      {/* Description — AI-generated synopsis; content below is verbatim */}
      <p className="mb-4 italic leading-relaxed text-stone-600 dark:text-stone-300">
        <RuleInlineText text={active.description} />
      </p>

      {/* Content — verbatim PAC markdown */}
      {active.content && (
        <div className="mb-4 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/50">
          <SoPMarkdown content={active.content} />
        </div>
      )}

      {/* Scenario appended content */}
      {active.appendedContent && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 border-t-2 border-blue-400 pt-2 dark:border-blue-700">
            {active.scenarioModule && (
              <span className="rounded bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white">
                {active.scenarioModule}
              </span>
            )}
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Scenario Rules
            </span>
          </div>
          <SoPMarkdown content={active.appendedContent} />
        </div>
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
              const key = `${checklistKeyPrefix}.${i}`;
              const checked = progress.completedChecklist[key] ?? false;
              return (
                <li key={i}>
                  <label className="flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleChecklist(key)}
                      className="mt-0.5 h-4 w-4 rounded border-stone-300 text-accent-600 focus:ring-accent-500"
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
            progress.currentSubPhaseIndex <= -1 &&
            progress.currentSegmentIndex <= -1
          }
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
        >
          &larr; Previous
        </button>

        {isAtEnd ? (
          <button
            onClick={onAdvanceTurn}
            className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700"
          >
            Next Turn &rarr;
          </button>
        ) : (
          <button
            onClick={onNext}
            className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700"
          >
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}

function TableRefButton({
  id,
  label,
  onOpen,
}: {
  id: string;
  label: string;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onOpen(id)}
      className="flex items-center gap-1 rounded bg-teal-500/20 px-2 py-0.5 text-xs font-medium text-teal-700 hover:bg-teal-500/30 dark:text-teal-400 dark:hover:bg-teal-500/20 transition-colors"
      title={`View ${label} table`}
    >
      <span>⊞</span>
      <span>{label}</span>
    </button>
  );
}
