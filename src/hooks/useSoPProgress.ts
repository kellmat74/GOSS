import { useState, useEffect, useCallback } from "react";
import type { SoPProgress, Phase, GameTurn, TimeOfDay } from "../types/goss";

const STORAGE_KEY = "goss-sop-progress";

const defaultTurn: GameTurn = {
  timeOfDay: "AM",
};

const defaultProgress: SoPProgress = {
  currentPhaseIndex: 0,
  currentSubPhaseIndex: -1, // -1 means at the phase level, not in a sub-phase
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
      return parsed;
    }
  } catch {
    // ignore
  }
  return defaultProgress;
}

export function useSoPProgress(phases: Phase[]) {
  const [progress, setProgress] = useState<SoPProgress>(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const currentPhase = phases[progress.currentPhaseIndex] ?? null;
  const currentSubPhase =
    progress.currentSubPhaseIndex >= 0
      ? currentPhase?.subPhases[progress.currentSubPhaseIndex] ?? null
      : null;

  const goToPhase = useCallback(
    (phaseIndex: number, subPhaseIndex = -1) => {
      setProgress((p) => ({
        ...p,
        currentPhaseIndex: phaseIndex,
        currentSubPhaseIndex: subPhaseIndex,
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

      // If we're at phase level and there are sub-phases, go to first sub-phase
      if (p.currentSubPhaseIndex === -1 && phase.subPhases.length > 0) {
        return { ...p, completedChecklist: cleaned, currentSubPhaseIndex: 0 };
      }

      // If we're in a sub-phase and there are more, go to next
      if (p.currentSubPhaseIndex < phase.subPhases.length - 1) {
        return { ...p, completedChecklist: cleaned, currentSubPhaseIndex: p.currentSubPhaseIndex + 1 };
      }

      // Move to next phase
      if (p.currentPhaseIndex < phases.length - 1) {
        return {
          ...p,
          completedChecklist: cleaned,
          currentPhaseIndex: p.currentPhaseIndex + 1,
          currentSubPhaseIndex: -1,
        };
      }

      return p; // at the end
    });
  }, [phases]);

  const prevStep = useCallback(() => {
    setProgress((p) => {
      const cleaned = clearCurrentChecklist(p);

      // If in a sub-phase, go back
      if (p.currentSubPhaseIndex > 0) {
        return { ...p, completedChecklist: cleaned, currentSubPhaseIndex: p.currentSubPhaseIndex - 1 };
      }
      if (p.currentSubPhaseIndex === 0) {
        return { ...p, completedChecklist: cleaned, currentSubPhaseIndex: -1 };
      }

      // Go to previous phase's last sub-phase
      if (p.currentPhaseIndex > 0) {
        const prevPhase = phases[p.currentPhaseIndex - 1];
        return {
          ...p,
          completedChecklist: cleaned,
          currentPhaseIndex: p.currentPhaseIndex - 1,
          currentSubPhaseIndex: prevPhase
            ? prevPhase.subPhases.length - 1
            : -1,
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
