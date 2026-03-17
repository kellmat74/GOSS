export interface SubPhase {
  id: string;
  name: string;
  ruleRef?: string;
  timing?: PhaseTiming;
  player: Player;
  description: string;
  content?: string;
  notes: string[];
  checklist: string[];
  subPhases?: SubPhase[];
  // Scenario overlay annotations (populated by mergeSequence)
  scenarioGate?: string;
  appendedContent?: string;
  appendedNotes?: string[];
  scenarioModule?: string;
}

export interface Phase {
  id: string;
  name: string;
  ruleRef?: string;
  timing?: PhaseTiming;
  player: Player;
  description: string;
  content?: string;
  notes: string[];
  subPhases: SubPhase[];
  // Scenario overlay annotations (populated by mergeSequence)
  scenarioGate?: string;
  appendedContent?: string;
  appendedNotes?: string[];
  scenarioModule?: string;
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

export type TimeOfDay = "AM" | "PM" | "Night" | "ENA";

export interface GameTurn {
  timeOfDay: TimeOfDay;
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

// Scenario overlay fields added to SubPhase/Phase after merge
export interface ScenarioAnnotation {
  gate?: string;           // callout banner text (e.g., "HHF: ENA always available")
  appendedContent?: string; // scenario content shown below base content
  appendedNotes?: string[]; // scenario tips appended to base tips
  scenarioModule?: string;  // source module label (e.g., "HHF", "WaR")
}

export interface SequenceOverlay {
  module: string;           // e.g., "hurtgen", "war"
  moduleLabel: string;      // e.g., "HHF", "WaR"
  modifications: SequenceModification[];
  scenarioOverrides?: Record<string, ScenarioOverride>; // keyed by scenario id
}

export interface ScenarioOverride {
  label: string;            // display name
  modifications: SequenceModification[]; // additional mods for this scenario
}

export interface SequenceModification {
  target: string;           // item id, e.g., "joint-command-phase"
  action: "modify" | "add" | "remove" | "gate";
  gate?: string;            // for "gate": callout banner text
  patch?: {
    appendContent?: string;
    appendNotes?: string[];
  };
  item?: SubPhase;          // for "add": full item to insert
  insertAfter?: string;     // for "add": id of sibling (null = prepend)
}

export interface SoPProgress {
  currentPhaseIndex: number;
  currentSubPhaseIndex: number;
  currentSegmentIndex: number; // -1 means at subPhase level, not in a segment
  completedChecklist: Record<string, boolean>; // key = "phaseId.subPhaseId.segmentId.checklistIndex"
  gameTurn: GameTurn;
}
