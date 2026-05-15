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
  tableRefs?: string[];  // IDs of associated tables in the game's tables.json
  // Scenario overlay annotations (populated by mergeSequence)
  scenarioGate?: string;
  appendedContent?: string;
  appendedNotes?: string[];
  scenarioModule?: string;
  // Optional rules gate: hide this item unless ALL listed option IDs are active
  optionGate?: string[];
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
  tableRefs?: string[];  // IDs of associated tables in the game's tables.json
  // Scenario overlay annotations (populated by mergeSequence)
  scenarioGate?: string;
  appendedContent?: string;
  appendedNotes?: string[];
  scenarioModule?: string;
  // Optional rules gate: hide this item unless ALL listed option IDs are active
  optionGate?: string[];
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

/** A section-scoped clarification or designer note attached to a rule. */
export interface ClarificationEntry {
  source: "qa" | "errata" | "designer-note"; // "qa" = e.g. BWN designer Q&A
  text: string;
  citation?: string; // e.g. "QA v2.0, p. 5"
}

export interface RuleEntry {
  id: string;
  section: string;
  title: string;
  summary: string;
  text: string;
  crossRefs: string[];
  module?: string;    // undefined = base system rule, "war" = WaR-specific, etc.
  tableRef?: string;  // ID of an associated table in the game's tables.json
  /** Pointer to the original rulebook's section number (e.g. for BWN: original 2020 section). Shown muted in modal header. */
  legacyRef?: string;
  /** Section-scoped designer Q&A / clarifications. Shown in modal under a "Designer Q&A" divider. */
  clarifications?: ClarificationEntry[];
}

// ---------------------------------------------------------------------------
// Card-driven games (Blue Water Navy and similar)
// ---------------------------------------------------------------------------

export type CardSide = "soviet" | "nato" | "neutral";

export type CardType =
  | "operations-event"
  | "reaction-event"
  | "use-when-active"
  | "use-anytime";

/** A single game card (event card, action card, etc.) */
export interface GameCard {
  id: string;             // e.g. "sov-3"
  cardNumber: string;     // e.g. "3" or "3/53" (when duplicates exist)
  side: CardSide;
  title: string;          // e.g. "Stealthy Approach"
  type: CardType;
  text?: string;          // full card body text (empty until scanned in)
  clarification?: string; // designer clarification, e.g. from a clarifications doc
  cost?: number;          // OPS cost if applicable
  ruleRefs?: string[];    // section IDs the card cross-references
}

/** A group of cards (e.g. Soviet Event Cards, NATO Event Cards). */
export interface CardCategory {
  id: string;             // e.g. "events-soviet"
  label: string;          // e.g. "Soviet Event Cards"
  cards: GameCard[];
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
  insertBeforePhase?: string; // for "add": insert as top-level phase before this phase id
}

export interface SoPProgress {
  currentPhaseIndex: number;
  currentSubPhaseIndex: number;
  currentSegmentIndex: number; // -1 means at subPhase level, not in a segment
  completedChecklist: Record<string, boolean>; // key = "phaseId.subPhaseId.segmentId.checklistIndex"
  gameTurn: GameTurn;
}
