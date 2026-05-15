import type {
  GameSystemConfig,
  QuickRefButtonDef,
  TablesFile,
} from "../../types/platform";

type TablesLoader = () => Promise<{ default: TablesFile }>;
const tables = (load: () => Promise<unknown>): TablesLoader => load as TablesLoader;

// QuickRef buttons for Blue Water Navy — all "table" kind (image play aids).
// Mapping refined once PNGs are extracted from the play-aids PDF.
const bwnQuickRefButtons: QuickRefButtonDef[] = [
  { id: "turn-summary",  label: "Turn",  icon: "🔄", title: "Turn Summary",       kind: "table", tableId: "turn-summary"  },
  { id: "actions-chart", label: "Acts",  icon: "📋", title: "Actions Chart",      kind: "table", tableId: "actions-chart" },
  { id: "combat-chart",  label: "Cbt",   icon: "⚔",  title: "Combat Tables",      kind: "table", tableId: "combat-chart"  },
  { id: "asw-chart",     label: "ASW",   icon: "🐟", title: "ASW Charts",         kind: "table", tableId: "asw-chart"     },
  { id: "weather",       label: "Wx",    icon: "🌧",  title: "Weather Effects",    kind: "table", tableId: "weather-chart" },
];

export const blueWaterNavyConfig: GameSystemConfig = {
  id: "blue-water-navy",
  name: "Blue Water Navy",
  shortName: "BWN",
  subtitle: "Compass Games · 1980s NATO/Soviet naval conflict",
  draft: true, // Hidden unless ?draft=true

  features: {
    flowchart: false,
    oob: false,
    quickRef: true,
    ask: false,    // Deferred
    learn: false,  // Deferred (AI Coach content authoring is a separate sprint)
    options: false,
    actions: true, // Card-driven game — Actions tab enabled
  },
  quickRefButtons: bwnQuickRefButtons,

  modules: [
    {
      id: "atlantic",
      label: "Atlantic",
      shortLabel: "BWN-A",
      scenarios: [{ id: "all", label: "All Scenarios" }],
      data: {
        rules: () => import("./rules.json"),
        cards: () => import("./cards.json"),
      },
    },
    // Future: Pacific module added when Compass releases the game.
  ],

  baseData: {
    rules: () => import("./rules.json"),
    sequence: () => import("./sequence.json"),
    tables: tables(() => import("./tables.json")),
  },

  askConfig: {
    workerUrl: "https://goss-ask-proxy.kellmat74.workers.dev",
    systemPromptPreamble:
      "You are a rules expert for Blue Water Navy, a card-driven naval wargame by Compass Games set in a hypothetical 1980s NATO vs Soviet North Atlantic conflict.",
    exampleQuestions: [
      "How do I detect a task force?",
      "What's the ASW procedure?",
      "How do missile attacks work?",
      "Can a submarine escort a task force?",
      "How does bad weather affect movement?",
    ],
  },
};
