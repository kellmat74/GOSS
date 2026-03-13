export interface SubPhase {
  id: string;
  name: string;
  ruleRef?: string;
  timing?: PhaseTiming;
  player: Player;
  description: string;
  notes: string[];
  checklist: string[];
}

export interface Phase {
  id: string;
  name: string;
  ruleRef?: string;
  timing?: PhaseTiming;
  player: Player;
  description: string;
  notes: string[];
  subPhases: SubPhase[];
}

export interface SequenceOfPlay {
  phases: Phase[];
}

export type Player =
  | "both"
  | "phasing"
  | "non-phasing"
  | "attacker"
  | "defender";

export type PhaseTiming =
  | "every-turn"
  | "am-only"
  | "pm-only"
  | "night-only"
  | "am-pm-only"
  | "conditional";

export interface GameTurn {
  turnNumber: number;
  date: string;
  timeOfDay: "AM" | "PM" | "Night";
}

export interface RuleEntry {
  id: string;
  section: string;
  title: string;
  summary: string;
  text: string;
  crossRefs: string[];
  module?: string; // undefined = GOSS system rule, "war" = WaR-specific, etc.
}

export interface SoPProgress {
  currentPhaseIndex: number;
  currentSubPhaseIndex: number;
  completedChecklist: Record<string, boolean>; // key = "phaseId.subPhaseId.checklistIndex"
  gameTurn: GameTurn;
}
