import { useEffect, useMemo, useRef } from "react";
import type { LearnChapter } from "../../types/learn";
import type { Phase, SoPProgress, SubPhase } from "../../types/goss";
import { DecisionCard } from "./DecisionCard";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";
import { RuleInlineText } from "../RulesReference/RuleInlineText";

interface LearnPanelProps {
  chapters: LearnChapter[];
  /** Full phases tree — needed to resolve a chapter's phaseRef into SoP indices. */
  phases: Phase[];
  /** Current SoP position — drives which chapter is shown. */
  currentPhase: Phase | null;
  currentSubPhase: SubPhase | null;
  currentSegment: SubPhase | null;
  /** Shared with Stepper. Learn's own buttons use chapter-level navigation. */
  progress: SoPProgress;
  totalPhases: number;
  onAdvanceTurn: () => void;
  /** Indices-based jump. Learn's Next/Prev compute these from the target chapter. */
  onGoToPhase: (phaseIndex: number, subPhaseIndex?: number, segmentIndex?: number) => void;
}

/**
 * Learn panel — a pedagogical companion distinct from the verbatim Rules/SoP.
 *
 * The sidebar (shared with Steps tab) drives which chapter is shown. We match
 * the current SoP position to a chapter via `phaseRef`, bubbling up from
 * segment → sub-phase → phase, and normalizing allied-/axis- prefixes so
 * one chapter can cover both sides' mirrored player turns.
 */
export function LearnPanel({
  chapters,
  phases,
  currentPhase,
  currentSubPhase,
  currentSegment,
  progress,
  totalPhases: _totalPhases,
  onAdvanceTurn,
  onGoToPhase,
}: LearnPanelProps) {
  const activeChapter = useMemo(
    () => findChapterForPosition(chapters, currentPhase, currentSubPhase, currentSegment),
    [chapters, currentPhase, currentSubPhase, currentSegment],
  );

  // Find the decision that best matches the current segment.
  // Matches when the decision's ruleRefs include the segment's ruleRef.
  const activeDecisionId = useMemo(
    () => findActiveDecisionId(activeChapter, currentSegment, currentSubPhase),
    [activeChapter, currentSegment, currentSubPhase],
  );

  // Scroll the matched decision into view when the selection changes.
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activeDecisionId) {
      // No specific decision matched — scroll to top of chapter instead
      const main = containerRef.current?.closest("main");
      if (main) main.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(decisionAnchor(activeDecisionId));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeDecisionId, activeChapter?.id]);

  // Chapter-level navigation: Next/Prev "page turn" between Learn chapters.
  // We compute the adjacent chapters by walking the SoP tree forward/backward
  // from the user's current position (not by array index), so chapter order
  // in the merged data file doesn't matter.
  const currentSopId =
    currentSegment?.id ?? currentSubPhase?.id ?? currentPhase?.id ?? "";
  const nextChapter = useMemo(
    () => findAdjacentChapter(chapters, phases, currentSopId, activeChapter?.id, "next"),
    [chapters, phases, currentSopId, activeChapter?.id],
  );
  const prevChapter = useMemo(
    () => findAdjacentChapter(chapters, phases, currentSopId, activeChapter?.id, "prev"),
    [chapters, phases, currentSopId, activeChapter?.id],
  );

  const isAtEnd = !nextChapter;
  const isAtStart = !prevChapter;

  const handleNext = () => {
    if (!nextChapter) {
      if (isAtEnd) onAdvanceTurn();
      return;
    }
    jumpToChapter(nextChapter, phases, progress, onGoToPhase);
  };

  const handlePrev = () => {
    if (!prevChapter) return;
    jumpToChapter(prevChapter, phases, progress, onGoToPhase);
  };

  if (chapters.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-stone-400">
        <p>No Learn content available for this module yet.</p>
      </div>
    );
  }

  const navBar = (
    <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4 dark:border-stone-700">
      <button
        onClick={handlePrev}
        disabled={isAtStart}
        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
        title={prevChapter ? `Previous: ${prevChapter.title}` : undefined}
      >
        &larr; {prevChapter ? prevChapter.title : "Previous"}
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
          onClick={handleNext}
          className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700"
          title={nextChapter ? `Next: ${nextChapter.title}` : undefined}
        >
          {nextChapter ? nextChapter.title : "Next"} &rarr;
        </button>
      )}
    </div>
  );

  if (!activeChapter) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-wide text-accent-500 dark:text-accent-400">
          Learn
        </div>
        <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 px-6 py-12 text-center dark:border-stone-700 dark:bg-stone-800/50">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            No Learn content for the current SoP position yet.
          </p>
          <p className="mt-2 text-xs text-stone-400">
            Pick a different phase or segment in the sidebar — Learn covers{" "}
            {chapters.length} chapters.
          </p>
        </div>
        {navBar}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mx-auto max-w-3xl">
      {/* Chapter header */}
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-accent-500 dark:text-accent-400">
          Learn
        </div>
        <h2 className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-bold text-stone-800 dark:text-stone-100">
          {activeChapter.title}
          {activeChapter.ruleRef && <RuleRefBadge ruleRef={activeChapter.ruleRef} />}
        </h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          <RuleInlineText text={activeChapter.intro} />
        </p>
      </div>

      {/* Scenario gate for chapter */}
      {activeChapter.scenarioGate && (
        <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-2">
            {activeChapter.scenarioModule && (
              <span className="mt-0.5 shrink-0 rounded bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white">
                {activeChapter.scenarioModule}
              </span>
            )}
            <span className="text-sm text-blue-800 dark:text-blue-300">
              <RuleInlineText text={activeChapter.scenarioGate} />
            </span>
          </div>
        </div>
      )}

      {/* Decision cards */}
      <div className="space-y-6">
        {activeChapter.decisions.map((d) => (
          <DecisionCard
            key={d.id}
            decision={d}
            anchorId={decisionAnchor(d.id)}
            active={d.id === activeDecisionId}
          />
        ))}
      </div>

      {navBar}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Chapter matching logic
// -----------------------------------------------------------------------------

/** Strip allied-/axis- prefix and turn-context suffix for cross-side matching. */
function normalizeRef(id: string): string {
  return id
    .replace(/^(allied|axis|enemy)-/, "")
    .replace(/-in-(allied|axis)-turn$/, "")
    .replace(/-phase$/, "")
    .replace(/-segment$/, "");
}

/** True if a chapter's phaseRef matches the given sop id (with normalization). */
function chapterMatches(chapter: LearnChapter, sopId: string): boolean {
  if (!chapter.phaseRef) return false;
  if (chapter.phaseRef === sopId) return true;
  return normalizeRef(chapter.phaseRef) === normalizeRef(sopId);
}

/**
 * Find the chapter that best matches the current SoP position.
 * Order: segment id → sub-phase id → phase id. First match wins.
 * Returns null if nothing matches.
 */
function findChapterForPosition(
  chapters: LearnChapter[],
  phase: Phase | null,
  subPhase: SubPhase | null,
  segment: SubPhase | null,
): LearnChapter | null {
  const tryIds = [segment?.id, subPhase?.id, phase?.id].filter(Boolean) as string[];
  for (const id of tryIds) {
    const match = chapters.find((c) => chapterMatches(c, id));
    if (match) return match;
  }
  return null;
}

/** DOM id for a decision card — used for scrollIntoView. */
function decisionAnchor(decisionId: string): string {
  return `learn-decision-${decisionId}`;
}

/**
 * Navigate SoP state to the given Learn chapter. Tries the chapter's exact
 * phaseRef first; if the user is currently inside a mirrored player turn
 * (allied/axis), prefers the same side's mirror. Falls back to the chapter's
 * declared phaseRef if no side-aware mirror exists.
 */
function jumpToChapter(
  chapter: LearnChapter,
  phases: Phase[],
  progress: SoPProgress,
  onGoToPhase: (phaseIndex: number, subPhaseIndex?: number, segmentIndex?: number) => void,
) {
  if (!chapter.phaseRef) return;
  const currentPhaseId = phases[progress.currentPhaseIndex]?.id ?? "";
  const currentSide: "allied" | "axis" | null = currentPhaseId.startsWith("allied-")
    ? "allied"
    : currentPhaseId.startsWith("axis-")
      ? "axis"
      : null;

  // Candidate phaseRefs in priority order
  const candidates: string[] = [chapter.phaseRef];
  if (currentSide) {
    // Swap allied-/axis- prefix to stay on the user's current side
    if (chapter.phaseRef.startsWith("allied-") && currentSide === "axis") {
      candidates.unshift(chapter.phaseRef.replace(/^allied-/, "axis-"));
    } else if (chapter.phaseRef.startsWith("axis-") && currentSide === "allied") {
      candidates.unshift(chapter.phaseRef.replace(/^axis-/, "allied-"));
    }
  }

  for (const ref of candidates) {
    const pos = findSopIndices(phases, ref);
    if (pos) {
      onGoToPhase(pos[0], pos[1], pos[2]);
      return;
    }
  }
}

/**
 * Flatten the SoP tree into an ordered list of ids (phases, sub-phases, and
 * segments, in SoP order). This is the "reading order" used for chapter-level
 * Next/Prev navigation on the Learn tab.
 */
function flattenSopIds(phases: Phase[]): string[] {
  const out: string[] = [];
  for (const phase of phases) {
    out.push(phase.id);
    for (const sub of phase.subPhases) {
      out.push(sub.id);
      for (const seg of sub.subPhases ?? []) {
        out.push(seg.id);
      }
    }
  }
  return out;
}

/**
 * Walk the SoP tree forward or backward from `currentId`; return the first
 * chapter whose phaseRef matches a visited position AND isn't the chapter
 * the user is already on. Returns null if none found (end of sequence).
 */
function findAdjacentChapter(
  chapters: LearnChapter[],
  phases: Phase[],
  currentId: string,
  currentChapterId: string | undefined,
  direction: "next" | "prev",
): LearnChapter | null {
  if (!currentId) return null;
  const positions = flattenSopIds(phases);
  const idx = positions.indexOf(currentId);
  if (idx < 0) return null;
  const step = direction === "next" ? 1 : -1;
  for (let i = idx + step; i >= 0 && i < positions.length; i += step) {
    const match = chapters.find((c) => chapterMatches(c, positions[i]));
    if (match && match.id !== currentChapterId) return match;
  }
  return null;
}

/** Locate a SoP id within the phases tree. Returns [pi, si?, segi?] or null. */
function findSopIndices(
  phases: Phase[],
  id: string,
): [number, number?, number?] | null {
  for (let pi = 0; pi < phases.length; pi++) {
    if (phases[pi].id === id) return [pi];
    const subs = phases[pi].subPhases;
    for (let si = 0; si < subs.length; si++) {
      if (subs[si].id === id) return [pi, si];
      const segs = subs[si].subPhases ?? [];
      for (let gi = 0; gi < segs.length; gi++) {
        if (segs[gi].id === id) return [pi, si, gi];
      }
    }
  }
  return null;
}

/**
 * Within the active chapter, find the decision that maps to the current
 * segment. Heuristic: decision.ruleRefs contains the segment's ruleRef
 * (or the sub-phase's ruleRef when there's no segment selected).
 * If nothing matches, returns null → LearnPanel scrolls to top.
 */
function findActiveDecisionId(
  chapter: LearnChapter | null,
  segment: SubPhase | null,
  subPhase: SubPhase | null,
): string | null {
  if (!chapter) return null;
  const targetRef = segment?.ruleRef;
  if (!targetRef) return null;
  // Strict: decision ruleRefs includes this exact ref
  const strict = chapter.decisions.find((d) =>
    (d.ruleRefs ?? []).includes(targetRef),
  );
  if (strict) return strict.id;
  // Looser: any decision ruleRef starts with targetRef (e.g., 20.1 matches 20.1.1)
  const prefix = chapter.decisions.find((d) =>
    (d.ruleRefs ?? []).some(
      (r) => r.startsWith(`${targetRef}.`) || targetRef.startsWith(`${r}.`),
    ),
  );
  if (prefix) return prefix.id;
  // Loosest: segment's ruleRef appears in the decision's `when` text
  const inWhen = chapter.decisions.find((d) => d.when.includes(`(${targetRef})`));
  if (inWhen) return inWhen.id;
  // Nothing matches — don't highlight; user sees full chapter
  // (subPhase arg intentionally unused for now; kept in signature for future heuristics)
  void subPhase;
  return null;
}
