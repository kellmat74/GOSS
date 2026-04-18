export interface ScenarioDef {
  id: string;
  label: string;
}

export interface ModuleConfig {
  id: string;            // "war", "hurtgen"
  label: string;         // "Wacht am Rhein"
  shortLabel: string;    // "WaR"
  scenarios: ScenarioDef[];
  data: {
    rules: () => Promise<{ default: unknown }>;
    sequenceOverlay?: () => Promise<{ default: unknown }>;
    oob?: () => Promise<{ default: unknown }>;
    learnOverlay?: () => Promise<{ default: unknown }>;
  };
}

export interface GameSystemConfig {
  id: string;            // "goss"
  name: string;          // "GOSS 2020"
  shortName: string;     // "GOSS"
  subtitle: string;      // "Grand Operational Simulation Series"
  draft?: boolean;       // true = hidden unless draft mode active
  features: {
    flowchart: boolean;
    oob: boolean;
    quickRef: boolean;
    ask: boolean;
    learn?: boolean;
  };
  modules: ModuleConfig[];
  baseData: {
    rules: () => Promise<{ default: unknown }>;
    sequence: () => Promise<{ default: unknown }>;
    quickRef?: () => Promise<{ default: unknown }>;
    learn?: () => Promise<{ default: unknown }>;
  };
  askConfig: {
    workerUrl: string;
    systemPromptPreamble: string;
    exampleQuestions: string[];
  };
}
