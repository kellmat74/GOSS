/**
 * Types for "Learn" mode — a pedagogical companion distinct from the
 * verbatim Rules/SoP/PAC content. Authored content is free to explain
 * the *why* and interactions, not just recite rules. Each decision point
 * links back to the authoritative rule refs via (X.Y.Z) inline text.
 */

/** A Learn chapter groups decisions for one phase or concept. */
export interface LearnChapter {
  id: string;                       // "logistics", "air-allocation"
  title: string;                    // "Logistics Phase"
  phaseRef?: string;                // SoP phase id (e.g., "joint-logistics-phase")
  ruleRef?: string;                 // Primary rule section (e.g., "16.0")
  intro: string;                    // 1-3 sentence overview shown at chapter top
  decisions: LearnDecision[];
  // Scenario overlay annotations populated by mergeLearn()
  scenarioGate?: string;
  scenarioModule?: string;
}

/**
 * A decision point — the pedagogical unit. Frames a choice the player
 * faces, explains the mechanism, gives the "why", and links back to rules.
 */
export interface LearnDecision {
  id: string;                       // "adv-cascade"
  title: string;                    // "Distributing ADV to Your Corps"
  when: string;                     // "You're in the Fuel Delivery Segment (16.4.0)"
  // Ordered content blocks — each renders as a distinct visual section
  blocks: LearnBlock[];
  // Primary rule refs — shown as link chips in header
  ruleRefs?: string[];
  // Scenario overlay annotations populated by mergeLearn()
  scenarioGate?: string;
  appendedBlocks?: LearnBlock[];
  scenarioModule?: string;
}

/**
 * Content block kinds. `prose` supports inline (X.Y.Z) refs and bold.
 * `diagram` names a registered SVG component.
 */
export type LearnBlock =
  | { kind: "prose"; text: string }
  | { kind: "diagram"; name: DiagramName; caption?: string }
  | { kind: "ask"; items: string[] }          // "Ask yourself" checklist
  | { kind: "callout"; variant: CalloutVariant; text: string }
  | { kind: "rule"; ruleRef: string; text: string }; // inline rule + why

export type CalloutVariant = "why" | "caution" | "tip" | "gotcha";

/** Registered diagram names (rendered by Diagrams/index.tsx dispatcher). */
export type DiagramName =
  | "adv-cascade-pipeline";

// -----------------------------------------------------------------------------
// Overlay types (parallel to SequenceOverlay)
// -----------------------------------------------------------------------------

export interface LearnOverlay {
  module: string;                   // "hurtgen"
  moduleLabel: string;              // "HHF"
  modifications: LearnModification[];
  scenarioOverrides?: Record<string, LearnScenarioOverride>;
}

export interface LearnScenarioOverride {
  label: string;
  modifications: LearnModification[];
}

export interface LearnModification {
  target: string;                   // chapter id or "chapterId.decisionId"
  action: "modify" | "add" | "remove" | "gate";
  gate?: string;                    // for "gate": callout banner text
  patch?: {
    appendBlocks?: LearnBlock[];
  };
  // for "add": full chapter or decision to insert
  chapter?: LearnChapter;
  decision?: LearnDecision;
  insertAfter?: string;
}

export interface LearnData {
  chapters: LearnChapter[];
}
