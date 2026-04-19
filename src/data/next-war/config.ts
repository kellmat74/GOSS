import type { GameSystemConfig, ErrataFile, TablesFile } from "../../types/platform";
import { taiwanOptionalRules } from "./taiwan/optional-rules";

type ErrataLoader = () => Promise<{ default: ErrataFile }>;
const errata = (load: () => Promise<unknown>): ErrataLoader =>
  load as ErrataLoader;

type TablesLoader = () => Promise<{ default: TablesFile }>;
const tables = (load: () => Promise<unknown>): TablesLoader =>
  load as TablesLoader;

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

  // Series-wide optional rules (from Errata/Clarifications doc)
  optionalRules: [
    {
      id: "trading-space-for-time",
      label: "Trading Space for Time",
      section: "9.7.1",
      description:
        "When conducting combat, rather than taking step losses a defending stack may choose to retreat one additional hex per step loss (minimum one step loss if odds were 11-13+). For each step loss converted to a retreat hex, the attacker reduces his losses by one. Defenders cannot Voluntarily Ignore a Retreat when using this option.",
      source: "standard",
      default: false,
    },
  ],

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
        // Standard Scenarios (GSR §18.2)
        { id: "target-kaohsiung",  label: "18.2.1: Target Kaohsiung",          complexity: "standard" },
        { id: "target-taichung",   label: "18.2.2: Target Taichung",           complexity: "standard" },
        { id: "target-taipei",     label: "18.2.3: Target Taipei",             complexity: "standard" },
        { id: "red-dragon-rising", label: "18.2.4: Red Dragon Rising",         complexity: "standard" },
        // Advanced Scenarios (GSR §18.3)
        { id: "walkin-on-the-sun", label: "18.3.4: Strategic Surprise — Walkin' on the Sun", complexity: "advanced" },
        { id: "island-in-the-sun", label: "18.3.5: Tactical Surprise — Island in the Sun",   complexity: "advanced" },
        { id: "black-hole-sun",    label: "18.3.6: Extended Buildup — Black Hole Sun",        complexity: "advanced" },
      ],
      optionalRules: taiwanOptionalRules,
      data: {
        rules: () => import("./taiwan/rules.json"),
        sequenceOverlay: () => import("./taiwan/sequence-overlay.json"),
        learnOverlay: () => import("./taiwan/learn-overlay.json"),
        errata: errata(() => import("./taiwan/errata.json")),
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
    errata: errata(() => import("./errata.json")),
    tables: tables(() => import("./tables.json")),
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
