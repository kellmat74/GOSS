import { useState, useEffect, useCallback } from "react";
import type { SoPProgress, Phase, GameTurn } from "../types/goss";

const STORAGE_KEY = "goss-sop-progress";

const defaultTurn: GameTurn = {
  turnNumber: 1,
  date: "Dec 16, 1944",
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
    if (saved) return JSON.parse(saved);
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

  const nextStep = useCallback(() => {
    setProgress((p) => {
      const phase = phases[p.currentPhaseIndex];
      if (!phase) return p;

      // If we're at phase level and there are sub-phases, go to first sub-phase
      if (p.currentSubPhaseIndex === -1 && phase.subPhases.length > 0) {
        return { ...p, currentSubPhaseIndex: 0 };
      }

      // If we're in a sub-phase and there are more, go to next
      if (p.currentSubPhaseIndex < phase.subPhases.length - 1) {
        return { ...p, currentSubPhaseIndex: p.currentSubPhaseIndex + 1 };
      }

      // Move to next phase
      if (p.currentPhaseIndex < phases.length - 1) {
        return {
          ...p,
          currentPhaseIndex: p.currentPhaseIndex + 1,
          currentSubPhaseIndex: -1,
        };
      }

      return p; // at the end
    });
  }, [phases]);

  const prevStep = useCallback(() => {
    setProgress((p) => {
      // If in a sub-phase, go back
      if (p.currentSubPhaseIndex > 0) {
        return { ...p, currentSubPhaseIndex: p.currentSubPhaseIndex - 1 };
      }
      if (p.currentSubPhaseIndex === 0) {
        return { ...p, currentSubPhaseIndex: -1 };
      }

      // Go to previous phase's last sub-phase
      if (p.currentPhaseIndex > 0) {
        const prevPhase = phases[p.currentPhaseIndex - 1];
        return {
          ...p,
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

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  const advanceTurn = useCallback(() => {
    setProgress((p) => {
      const t = p.gameTurn;
      let next: GameTurn;
      if (t.timeOfDay === "AM") {
        next = { ...t, timeOfDay: "PM" };
      } else if (t.timeOfDay === "PM") {
        next = { ...t, timeOfDay: "Night" };
      } else {
        next = {
          turnNumber: t.turnNumber + 1,
          date: t.date, // user can update manually
          timeOfDay: "AM",
        };
      }
      return {
        ...defaultProgress,
        gameTurn: next,
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
    resetProgress,
    advanceTurn,
  };
}
