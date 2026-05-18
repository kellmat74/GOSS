import type {
  GameSystemConfig,
  QuickRefButtonDef,
  TablesFile,
} from "../../types/platform";
import { bwnGlossaryConfig } from "./glossary-config";
import { bwnSearchConfig } from "./search-config";

type TablesLoader = () => Promise<{ default: TablesFile }>;
const tables = (load: () => Promise<unknown>): TablesLoader => load as TablesLoader;

// QuickRef buttons for Blue Water Navy — all "table" kind (image play aids).
// Note: the Action & Turn Sequence play-aid page (formerly the "Turn" button)
// is no longer surfaced as an image — its content is being decomposed into
// the SoP tab (turn sequence) and the Actions tab (per-action workflows).
const bwnQuickRefButtons: QuickRefButtonDef[] = [
  { id: "units",       label: "Units", icon: "🎖",  title: "How to Read Air & Naval Units",      kind: "table", tableId: "unit-id-guide"     },
  { id: "subs",        label: "Subs",  icon: "🌊", title: "Attacks on & by Submarines (ASW)",   kind: "table", tableId: "sub-attacks"       },
  { id: "task-force",  label: "TF",    icon: "🚢", title: "Task Force Detection, Missiles, Damage", kind: "table", tableId: "task-force-combat" },
  { id: "fighters",    label: "Air",   icon: "✈",  title: "Fighters (CAP & Interception)",       kind: "table", tableId: "fighter-combat"    },
  { id: "land",        label: "Land",  icon: "💥", title: "Attacking Land Targets",             kind: "table", tableId: "land-attacks"      },
  { id: "convoys",     label: "Misc",  icon: "📦", title: "Convoys, Mines, War Tracks, Nukes",  kind: "table", tableId: "convoys-misc"      },
  { id: "soviet",      label: "Sov",   icon: "☭",  title: "Soviet Specific Rules",              kind: "table", tableId: "soviet-specific"   },
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
    cards: true,   // Event Cards browser tab
  },
  quickRefButtons: bwnQuickRefButtons,
  glossaryConfig: bwnGlossaryConfig,
  searchConfig: bwnSearchConfig,

  modules: [
    {
      id: "atlantic",
      label: "Atlantic",
      shortLabel: "BWN-A",
      scenarios: [{ id: "all", label: "All Scenarios" }],
      data: {
        // BWN has a single rulebook — rules load from baseData.rules below.
        // Module data only holds module-specific extras (actions, cards, future scenario overlays).
        rules: () => Promise.resolve({ default: [] }),
        actions: () => import("./actions.json"),
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
