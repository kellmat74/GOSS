export interface ScenarioDef {
  id: string;
  label: string;
}

/** Standard vs. Advanced game complexity level. */
export type ComplexityLevel = "standard" | "advanced";

/**
 * A single optional rule that players can toggle on/off before a game.
 * Used in OptionsPanel and to gate SoP/Learn content via optionGate.
 */
export interface OptionalRuleEntry {
  id: string;
  label: string;
  section: string;           // rule reference, e.g. "13.1"
  description: string;
  vpCost?: { side: string; cost: number }; // e.g. { side: "US/ROC", cost: 5 }
  source: "standard" | "advanced" | "supplement";
  supplementId?: string;     // which supplement, if source === "supplement"
  default?: boolean;         // pre-selected by default
}

/**
 * A supplement rulebook that adds optional rules across all modules
 * (e.g. Next War Supplement #1–4).
 */
export interface SupplementConfig {
  id: string;                // "supplement-1"
  label: string;             // "Next War: Supplement #1"
  shortLabel: string;        // "Supp 1"
  description: string;
  optionalRules?: OptionalRuleEntry[];
  data?: {
    rules?: () => Promise<{ default: unknown }>;
  };
}

export interface ModuleConfig {
  id: string;            // "war", "taiwan"
  label: string;         // "Wacht am Rhein", "Taiwan"
  shortLabel: string;    // "WaR", "TW"
  scenarios: ScenarioDef[];
  data: {
    rules: () => Promise<{ default: unknown }>;
    sequenceOverlay?: () => Promise<{ default: unknown }>;
    oob?: () => Promise<{ default: unknown }>;
    learnOverlay?: () => Promise<{ default: unknown }>;
    /** Advanced Game sequence overlay (replaces sequenceOverlay when complexity === "advanced") */
    advancedSequenceOverlay?: () => Promise<{ default: unknown }>;
    /** Advanced Game module-specific rules (appended to base advanced rules) */
    advancedRules?: () => Promise<{ default: unknown }>;
  };
}

export interface GameSystemConfig {
  id: string;            // "goss", "next-war"
  name: string;          // "GOSS 2020", "Next War Series"
  shortName: string;     // "GOSS", "Next War"
  subtitle: string;
  draft?: boolean;       // true = hidden unless ?draft=true

  features: {
    flowchart: boolean;
    oob: boolean;
    quickRef: boolean;
    ask: boolean;
    learn?: boolean;
    options?: boolean;   // optional rules panel
  };

  /** If set, game supports multiple complexity levels (Standard/Advanced). */
  complexityLevels?: ComplexityLevel[];

  /** Base optional rules shared across all modules (standard + advanced). */
  optionalRules?: OptionalRuleEntry[];

  /** Supplement rulebooks — each adds its own pool of optional rules. */
  supplements?: SupplementConfig[];

  modules: ModuleConfig[];

  baseData: {
    rules: () => Promise<{ default: unknown }>;
    sequence: () => Promise<{ default: unknown }>;
    quickRef?: () => Promise<{ default: unknown }>;
    learn?: () => Promise<{ default: unknown }>;
    /** Advanced Game system rules (appended to standard rules when complexity === "advanced") */
    advancedRules?: () => Promise<{ default: unknown }>;
    /** Advanced Game sequence (replaces standard sequence when complexity === "advanced") */
    advancedSequence?: () => Promise<{ default: unknown }>;
    /** Advanced Game learn content (replaces/augments base learn when complexity === "advanced") */
    advancedLearn?: () => Promise<{ default: unknown }>;
  };

  askConfig: {
    workerUrl: string;
    systemPromptPreamble: string;
    exampleQuestions: string[];
  };
}
