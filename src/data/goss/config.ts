import type { GameSystemConfig, ErrataFile } from "../../types/platform";

type ErrataLoader = () => Promise<{ default: ErrataFile }>;
const errata = (load: () => Promise<unknown>): ErrataLoader =>
  load as ErrataLoader;

export const gossConfig: GameSystemConfig = {
  id: "goss",
  name: "GOSS 2020",
  shortName: "GOSS",
  subtitle: "Grand Operational Simulation Series",
  features: {
    flowchart: false,  // deprecated — content not kept up to date
    oob: true,
    quickRef: true,
    ask: true,
    learn: true,
  },
  modules: [
    {
      id: "war",
      label: "Wacht am Rhein",
      shortLabel: "WaR",
      scenarios: [
        { id: "all", label: "All Scenarios" },
        { id: "dec16-valkyries", label: "1: Ride of the Valkyries (6th Pz)" },
        { id: "dec16-egg", label: "2: An Egg is Laid (St. Vith)" },
        { id: "dec16-skyline", label: "3: A Beautiful Skyline (47th Pz)" },
        { id: "dec16-hard-left", label: "4: A Hard Left (7th Army)" },
        { id: "dec16-meuse", label: "5: March to the Meuse (Full)" },
        { id: "dec21-group", label: "Dec 21+ Scenario Group" },
        { id: "dec21-sauer", label: "A: Sparring on the Sauer" },
      ],
      data: {
        rules: () => import("./war/rules.json"),
        sequenceOverlay: () => import("./war/sequence-overlay.json"),
        oob: () => import("./war/oob.json"),
        learnOverlay: () => import("./war/learn-overlay.json"),
      },
    },
    {
      id: "hurtgen",
      label: "Hurtgen",
      shortLabel: "HHF",
      scenarios: [
        { id: "all", label: "All Scenarios" },
        { id: "bloody-bucket", label: "1: Bloody Bucket (Learning)" },
        { id: "september-rush", label: "2: September Rush" },
        { id: "october", label: "3: October Trick or Treat" },
        { id: "november", label: "4: November's Turkey Shoot" },
        { id: "campaign", label: "Campaign: Hell's Forest" },
      ],
      data: {
        rules: () => import("./hurtgen/rules.json"),
        sequenceOverlay: () => import("./hurtgen/sequence-overlay.json"),
        oob: () => import("./hurtgen/oob.json"),
        learnOverlay: () => import("./hurtgen/learn-overlay.json"),
      },
    },
    {
      id: "atlantic-wall",
      label: "Atlantic Wall",
      shortLabel: "AW",
      scenarios: [
        { id: "all", label: "All Scenarios" },
        { id: "aw-intro", label: "Introductory Scenarios (1-3)" },
        { id: "aw-goodwood", label: "1: Operation Goodwood" },
        { id: "aw-epsom", label: "2: Operation Epsom" },
        { id: "aw-cherbourg", label: "3: Battle for Cherbourg" },
        { id: "aw-hedgerows", label: "4: Battle of the Hedgerows" },
        { id: "aw-cobra", label: "5: Cobra" },
        { id: "aw-dday", label: "6: D-Day, The Sixth of June" },
        { id: "aw-campaign", label: "Campaign Game" },
      ],
      data: {
        rules: () => import("./atlantic-wall/rules.json"),
        sequenceOverlay: () => import("./atlantic-wall/sequence-overlay.json"),
        oob: () => import("./atlantic-wall/oob.json"),
        learnOverlay: () => import("./atlantic-wall/learn-overlay.json"),
      },
    },
    {
      id: "lucky-forward",
      label: "Lucky Forward",
      shortLabel: "LF",
      scenarios: [
        { id: "all", label: "All Scenarios" },
        { id: "gremercy-forest", label: "Intro: Gremercy Forest" },
        { id: "september", label: "September" },
        { id: "october", label: "October (Extended Sep)" },
        { id: "november", label: "November" },
        { id: "december", label: "December" },
        { id: "campaign", label: "Campaign" },
      ],
      data: {
        rules: () => import("./lucky-forward/rules.json"),
        sequenceOverlay: () => import("./lucky-forward/sequence-overlay.json"),
        oob: () => import("./lucky-forward/oob.json"),
        learnOverlay: () => import("./lucky-forward/learn-overlay.json"),
      },
    },
  ],
  baseData: {
    rules: () => import("./rules.json"),
    sequence: () => import("./sequence.json"),
    quickRef: () => import("./quick-ref.json"),
    learn: () => import("./learn.json"),
    errata: errata(() => import("./errata.json")),
  },
  askConfig: {
    workerUrl: "https://goss-ask-proxy.kellmat.workers.dev",
    systemPromptPreamble:
      "You are a rules expert for GOSS (Grand Operational Simulation Series) 2020, a tabletop wargame system.",
    exampleQuestions: [
      "How does supply work?",
      "What happens when a unit is out of ammo?",
      "How do ZOCs affect movement?",
      "Explain the ground assault procedure",
      "What are the stacking limits?",
      "How does weather affect combat?",
    ],
  },
};
