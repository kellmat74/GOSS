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

/** Reference to a play-aid block inlined inside a procedure step. */
export interface ProcedureBlockRef {
  /** e.g. "pa3:submarine-vs-task-force" */
  slug: string;
  /** Human-readable label captured in the action markdown placeholder. */
  label: string;
}

/** One step in an Action's procedure list. */
export interface ProcedureStep {
  /** Step text (markdown source, kept for search). */
  text: string;
  /** Pre-rendered HTML of the step text (placeholders stripped). */
  html: string;
  /** Play-aid blocks referenced by this step. */
  blocks: ProcedureBlockRef[];
}

/** See-Also content parsed from the action markdown. */
export interface ActionSeeAlso {
  /** Cross-linked sibling actions. */
  actions: { id: string; title: string }[];
  /** Rule section refs that complement the action. */
  ruleRefs: string[];
}

/** Rich per-action content (BWN merge output). Optional — legacy games may omit. */
export interface ActionContent {
  whenItComesUp?: string;
  whenItComesUpHtml?: string;
  procedure?: ProcedureStep[];
  seeAlso?: ActionSeeAlso;
  whyAndWatchFor?: string;
  whyAndWatchForHtml?: string;
}

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
  /** Action menu placement: "action" (costs OPS), "active" (free when active), "anytime" (reaction). BWN-specific. */
  usage?: "action" | "active" | "anytime";
  /** Sub-grouping verb inside a category (BWN actions): setup / move / attack / detect / patrol-react / special. */
  verb?: "setup" | "move" | "attack" | "detect" | "patrol-react" | "special";
  /** Rich per-action content from BWN merge pipeline. */
  content?: ActionContent;
}

/** Map of pa<N>:<slug> → play-aid block content (pre-rendered HTML). */
export interface PlayAidBlock {
  paNumber: number;
  title: string;
  body: string;        // markdown source
  html: string;        // pre-rendered HTML
  sourceFile: string;
}

export type PlayAidBlocksMap = Record<string, PlayAidBlock>;

/** A group of cards (e.g. Soviet Event Cards, NATO Event Cards). */
export interface CardCategory {
  id: string;             // e.g. "events-soviet"
  label: string;          // e.g. "Soviet Event Cards"
  cards: GameCard[];
}

/**
 * One half of a physical card. Cards have two: Operations Event (top) and
 * Reaction Event (bottom). Each carries its own title, cost, and body text.
 */
export interface CardEvent {
  title: string;
  type: CardType;
  cost?: number;
  text: string;
  /** Total number of physical cards in the deck that print this exact event in this slot. */
  frequency: number;
  /** Designer clarification (e.g. from a Q&A doc), if any. */
  clarification?: string;
  /** Section IDs this event references. */
  ruleRefs?: string[];
  /** OCR / transcription notes for this event. */
  notes?: string;
}

/**
 * A physical card in the deck. Each game card has two events; both are
 * always present in the data (a card with a blank slot is rendered with an
 * empty title, e.g. "None").
 */
export interface PhysicalCard {
  id: string;             // e.g. "soviet-1"
  cardNumber: string;     // "1" through "55"
  side: CardSide;
  ops: CardEvent;
  reaction: CardEvent;
}

// ---------------------------------------------------------------------------
// Scenario content (rich per-scenario data, BWN-style)
// ---------------------------------------------------------------------------

export type ScenarioSide = "nato" | "soviet";

/** A sub-scenario or rule alteration (e.g. "Yankee Hunting" on top of Boomer Bastion). */
export interface ScenarioAlteration {
  id: string;                   // kebab-case slug
  title: string;                // display title, e.g. "Scenario 1a: Yankee Hunting"
  description: string;          // verbatim text of the alteration
}

/** A start-type variant for a scenario (Campaign Game: Strategic / Tactical / Extended Build-up). */
export interface ScenarioStartType {
  id: string;                   // "strategic-surprise" | "tactical-surprise" | "extended-buildup"
  label: string;
  /** Optional narrative description (omit when only the verbatim specialRules is available). */
  description?: string;
  specialRules?: string;
}

/** A row in the start-type scaling table — shows how a value differs across start types. */
export interface ScenarioStartTypeScaling {
  /** Setup procedure step reference, e.g. "NATO #2", "Soviet #5a". */
  step?: string;
  label: string;
  strategic?: string;
  tactical?: string;
  extended?: string;
}

/** An era / year variant — what changes when the campaign is played in a different year. */
export interface ScenarioYearVariant {
  year: number;
  notes: string;
}

/**
 * Rich content for one scenario in a scenario book.
 *
 * Note: Unit setup tables and reinforcement schedules are intentionally
 * NOT modeled here — that level of detail belongs in the physical scenario
 * book the player owns. The app surfaces rules-relevant context (briefing,
 * victory conditions, special rules, alterations, start-type variants).
 */
export interface ScenarioContent {
  id: string;                     // kebab-case slug
  number: number;                 // 1, 2, 3 ...
  title: string;
  year?: number | string;
  briefing: string;
  victoryConditions: string;
  opsPerDay?: { nato: number; soviet: number };
  turns?: number;
  specialRules?: string;
  firstStrike?: number | null;
  /** Inline note about which OPS Track (1-5 small or full 1-10) the scenario uses. */
  opsTrackNote?: string;
  /** Sub-scenarios / variants stacked on top of this scenario. */
  alterations?: ScenarioAlteration[];
  /** Start-type variants (Campaign Game: Strategic / Tactical / Extended Build-up). */
  startTypes?: ScenarioStartType[];
  /** Scaled-value comparison table across start types. */
  startTypeScaling?: ScenarioStartTypeScaling[];
  /** Era variants (Campaign Game: 1983 / 1985 / 1989). */
  yearVariants?: ScenarioYearVariant[];
  notes?: string[];
}

/** Top-level structure of a scenario book. */
export interface ScenarioBook {
  scenarios: ScenarioContent[];
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
