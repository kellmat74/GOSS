import type { GameSystemConfig } from "../../types/platform";

export const nextWarConfig: GameSystemConfig = {
  id: "next-war",
  name: "Next War Series",
  shortName: "Next War",
  subtitle: "Modern Operational Wargames",
  draft: true, // Hidden until content is ready

  features: {
    flowchart: false,
    oob: false,
    quickRef: false,
    ask: false,    // Enable once rules are extracted
    learn: false,  // Enable once AI Coach content is authored
    options: true, // Optional rules panel — available from day one
  },

  complexityLevels: ["standard", "advanced"],

  // Optional rules will be populated as rules are extracted from PDFs
  optionalRules: [],

  // Supplements — populated once PDFs are available
  supplements: [
    {
      id: "supplement-1",
      label: "Next War: Supplement #1",
      shortLabel: "Supp 1",
      description: "Additional optional rules and scenarios for the Next War series.",
      optionalRules: [],
    },
    {
      id: "supplement-2",
      label: "Next War: Supplement #2",
      shortLabel: "Supp 2",
      description: "Additional optional rules and scenarios for the Next War series.",
      optionalRules: [],
    },
    {
      id: "supplement-3",
      label: "Next War: Supplement #3",
      shortLabel: "Supp 3",
      description: "Additional optional rules and scenarios for the Next War series.",
      optionalRules: [],
    },
    {
      id: "supplement-4",
      label: "Next War: Supplement #4",
      shortLabel: "Supp 4",
      description: "Additional optional rules and scenarios for the Next War series.",
      optionalRules: [],
    },
  ],

  modules: [
    {
      id: "taiwan",
      label: "Taiwan",
      shortLabel: "NW:TW",
      scenarios: [
        { id: "all", label: "All Scenarios" },
        // Scenarios populated once Taiwan GSR is extracted
      ],
      data: {
        rules: () => import("./taiwan/rules.json"),
        sequenceOverlay: () => import("./taiwan/sequence-overlay.json"),
        learnOverlay: () => import("./taiwan/learn-overlay.json"),
        // oob, advancedRules, advancedSequenceOverlay added once PDFs arrive
      },
    },
    // Additional titles (Korea, Poland, India-Pakistan, Iran, Vietnam) added as PDFs arrive
  ],

  baseData: {
    rules: () => import("./rules.json"),
    sequence: () => import("./sequence.json"),
    advancedRules: () => import("./advanced-rules.json"),
    advancedSequence: () => import("./advanced-sequence.json"),
    learn: () => import("./learn.json"),
  },

  askConfig: {
    workerUrl: "", // Populated once worker is set up for Next War
    systemPromptPreamble:
      "You are a rules expert for the Next War Series (GMT Games), a series of operational wargames covering modern near-future conflicts.",
    exampleQuestions: [
      "How does the Initiative system work?",
      "What are the differences between Standard and Advanced game?",
      "How does Air Superiority affect combat?",
      "Explain the ZOC rules",
      "How do optional rules affect VP costs?",
      "What is the difference between Overcast and Storm weather?",
    ],
  },
};
