import { useState, useEffect, useCallback, useRef } from "react";
import type { SoPProgress, Phase, SubPhase, GameTurn, TimeOfDay } from "../types/goss";

const STORAGE_KEY = "goss-sop-progress";

const defaultTurn: GameTurn = {
  timeOfDay: "AM",
};

const defaultProgress: SoPProgress = {
  currentPhaseIndex: 0,
  currentSubPhaseIndex: -1,
  currentSegmentIndex: -1,
  completedChecklist: {},
  gameTurn: defaultTurn,
};

function loadProgress(): SoPProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old format: strip turnNumber/date if present
      if (parsed.gameTurn && ("turnNumber" in parsed.gameTurn || "date" in parsed.gameTurn)) {
        parsed.gameTurn = { timeOfDay: parsed.gameTurn.timeOfDay ?? "AM" };
      }
      // Migrate: add currentSegmentIndex if missing
      if (parsed.currentSegmentIndex === undefined) {
        parsed.currentSegmentIndex = -1;
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return defaultProgress;
}

function getSegments(sub: SubPhase | null): SubPhase[] {
  return sub?.subPhases ?? [];
}

export function useSoPProgress(phases: Phase[]) {
  const [progress, setProgress] = useState<SoPProgress>(loadProgress);
  const prevPhasesRef = useRef(phases);

  // Reset progress when phases array changes (scenario switch may alter structure)
  useEffect(() => {
    if (prevPhasesRef.current !== phases) {
      prevPhasesRef.current = phases;
      // Clamp indices to valid range to prevent stale references
      setProgress((p) => {
        const phaseIdx = Math.min(p.currentPhaseIndex, phases.length - 1);
        const phase = phases[phaseIdx];
        const subIdx = phase && p.currentSubPhaseIndex >= 0
          ? Math.min(p.currentSubPhaseIndex, phase.subPhases.length - 1)
          : p.currentSubPhaseIndex;
        return { ...p, currentPhaseIndex: phaseIdx, currentSubPhaseIndex: subIdx, currentSegmentIndex: -1 };
      });
    }
  }, [phases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const currentPhase = phases[progress.currentPhaseIndex] ?? null;
  const currentSubPhase =
    progress.currentSubPhaseIndex >= 0
      ? currentPhase?.subPhases[progress.currentSubPhaseIndex] ?? null
      : null;
  const currentSegment =
    progress.currentSegmentIndex >= 0
      ? getSegments(currentSubPhase)[progress.currentSegmentIndex] ?? null
      : null;

  const goToPhase = useCallback(
    (phaseIndex: number, subPhaseIndex = -1, segmentIndex = -1) => {
      setProgress((p) => ({
        ...p,
        currentPhaseIndex: phaseIndex,
        currentSubPhaseIndex: subPhaseIndex,
        currentSegmentIndex: segmentIndex,
      }));
    },
    []
  );

  // Helper: clear checklist keys for a given phase/subphase
  const clearCurrentChecklist = (p: SoPProgress): Record<string, boolean> => {
    const phase = phases[p.currentPhaseIndex];
    if (!phase) return p.completedChecklist;
    const prefix = `${phase.id}.`;
    const cleaned: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(p.completedChecklist)) {
      if (!k.startsWith(prefix)) cleaned[k] = v;
    }
    return cleaned;
  };

  const nextStep = useCallback(() => {
    setProgress((p) => {
      const phase = phases[p.currentPhaseIndex];
      if (!phase) return p;
      const cleaned = clearCurrentChecklist(p);

      // At phase level — enter first subPhase if any
      if (p.currentSubPhaseIndex === -1) {
        if (phase.subPhases.length > 0) {
          return { ...p, completedChecklist: cleaned, currentSubPhaseIndex: 0, currentSegmentIndex: -1 };
        }
        // No subPhases, go to next phase
        if (p.currentPhaseIndex < phases.length - 1) {
          return { ...p, completedChecklist: cleaned, currentPhaseIndex: p.currentPhaseIndex + 1, currentSubPhaseIndex: -1, currentSegmentIndex: -1 };
        }
        return p;
      }

      const sub = phase.subPhases[p.currentSubPhaseIndex];
      const segments = getSegments(sub);

      // At subPhase level — enter first segment if any
      if (p.currentSegmentIndex === -1 && segments.length > 0) {
        return { ...p, completedChecklist: cleaned, currentSegmentIndex: 0 };
      }

      // In a segment — go to next segment
      if (p.currentSegmentIndex >= 0 && p.currentSegmentIndex < segments.length - 1) {
        return { ...p, completedChecklist: cleaned, currentSegmentIndex: p.currentSegmentIndex + 1 };
      }

      // Segments exhausted (or none) — go to next subPhase
      if (p.currentSubPhaseIndex < phase.subPhases.length - 1) {
        return { ...p, completedChecklist: cleaned, currentSubPhaseIndex: p.currentSubPhaseIndex + 1, currentSegmentIndex: -1 };
      }

      // SubPhases exhausted — go to next phase
      if (p.currentPhaseIndex < phases.length - 1) {
        return { ...p, completedChecklist: cleaned, currentPhaseIndex: p.currentPhaseIndex + 1, currentSubPhaseIndex: -1, currentSegmentIndex: -1 };
      }

      return p; // at the end
    });
  }, [phases]);

  const prevStep = useCallback(() => {
    setProgress((p) => {
      const cleaned = clearCurrentChecklist(p);

      // In a segment — go back
      if (p.currentSegmentIndex > 0) {
        return { ...p, completedChecklist: cleaned, currentSegmentIndex: p.currentSegmentIndex - 1 };
      }
      // At first segment — go back to subPhase level
      if (p.currentSegmentIndex === 0) {
        return { ...p, completedChecklist: cleaned, currentSegmentIndex: -1 };
      }

      // At subPhase level — go back
      if (p.currentSubPhaseIndex > 0) {
        const prevSub = phases[p.currentPhaseIndex]?.subPhases[p.currentSubPhaseIndex - 1];
        const prevSegments = getSegments(prevSub);
        return {
          ...p,
          completedChecklist: cleaned,
          currentSubPhaseIndex: p.currentSubPhaseIndex - 1,
          currentSegmentIndex: prevSegments.length > 0 ? prevSegments.length - 1 : -1,
        };
      }
      // At first subPhase — go to phase level
      if (p.currentSubPhaseIndex === 0) {
        return { ...p, completedChecklist: cleaned, currentSubPhaseIndex: -1, currentSegmentIndex: -1 };
      }

      // At phase level — go to previous phase's last subPhase's last segment
      if (p.currentPhaseIndex > 0) {
        const prevPhase = phases[p.currentPhaseIndex - 1];
        if (!prevPhase || prevPhase.subPhases.length === 0) {
          return { ...p, completedChecklist: cleaned, currentPhaseIndex: p.currentPhaseIndex - 1, currentSubPhaseIndex: -1, currentSegmentIndex: -1 };
        }
        const lastSubIdx = prevPhase.subPhases.length - 1;
        const lastSub = prevPhase.subPhases[lastSubIdx];
        const lastSegments = getSegments(lastSub);
        return {
          ...p,
          completedChecklist: cleaned,
          currentPhaseIndex: p.currentPhaseIndex - 1,
          currentSubPhaseIndex: lastSubIdx,
          currentSegmentIndex: lastSegments.length > 0 ? lastSegments.length - 1 : -1,
        };
      }

      return p;
    });
  }, [phases]);

  const toggleChecklist = useCallback((key: string) => {
    setProgress((p) => ({
      ...p,
      completedChecklist: {
        ...p.completedChecklist,
        [key]: !p.completedChecklist[key],
      },
    }));
  }, []);

  const clearChecklist = useCallback(() => {
    setProgress((p) => ({ ...p, completedChecklist: clearCurrentChecklist(p) }));
  }, [phases]);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  const setTimeOfDay = useCallback((tod: TimeOfDay) => {
    setProgress((p) => ({
      ...p,
      gameTurn: { timeOfDay: tod },
    }));
  }, []);

  const advanceTurn = useCallback(() => {
    setProgress((p) => {
      const tod = p.gameTurn.timeOfDay;
      const next: TimeOfDay =
        tod === "AM" ? "PM" : tod === "PM" ? "Night" : "AM";
      return {
        ...defaultProgress,
        gameTurn: { timeOfDay: next },
      };
    });
  }, []);

  return {
    progress,
    currentPhase,
    currentSubPhase,
    currentSegment,
    goToPhase,
    nextStep,
    prevStep,
    toggleChecklist,
    clearChecklist,
    resetProgress,
    setTimeOfDay,
    advanceTurn,
  };
}
