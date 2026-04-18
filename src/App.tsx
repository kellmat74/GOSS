import { useState, useEffect, useMemo } from "react";
import { AppShell } from "./components/Layout/AppShell";
import { PhaseOverview } from "./components/SequenceOfPlay/PhaseOverview";
import { PhaseStepper } from "./components/SequenceOfPlay/PhaseStepper";
import { GameSelector } from "./components/Layout/GameSelector";
import { RulesSearch } from "./components/RulesReference/RulesSearch";
import { RuleModal } from "./components/RulesReference/RuleModal";
import { AskPanel } from "./components/Ask/AskPanel";
import { LearnPanel } from "./components/Learn/LearnPanel";
import { SoPFlowchart } from "./components/Flowchart/SoPFlowchart";
import { InfoPanel } from "./components/InfoPanel";
import { QuickRefBar } from "./components/QuickRef/QuickRefBar";
import { RulesProvider } from "./context/RulesContext";
import { GlossaryProvider } from "./context/GlossaryContext";
import { useSoPProgress } from "./hooks/useSoPProgress";
import { mergeRules } from "./utils/mergeRules";
import { mergeSequence } from "./utils/mergeSequence";
import { mergeLearn } from "./utils/mergeLearn";
import { getVisibleGames, getGameById } from "./data/registry";
import type { Phase, RuleEntry, SequenceOverlay } from "./types/goss";
import type { LearnData, LearnOverlay } from "./types/learn";
import type { GameSystemConfig, ModuleConfig } from "./types/platform";

type View = "sop" | "flowchart" | "rules" | "ask" | "learn" | "info";

const THEME_KEY = "wc-theme";
const GAME_SYSTEM_KEY = "wc-game-system";
const MODULE_KEY = "wc-module";
const SCENARIO_KEY = "wc-scenario";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      // Migrate old key
      const old = localStorage.getItem("goss-theme");
      if (old === "light" || old === "dark") {
        localStorage.setItem(THEME_KEY, old);
        localStorage.removeItem("goss-theme");
        return old;
      }
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch { /* ignore */ }
    return "dark";
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return { theme, toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

function useGameSelection() {
  const visibleGames = useMemo(() => getVisibleGames(), []);

  const [gameSystemId, setGameSystemId] = useState<string>(() => {
    try {
      // Migrate old key
      const oldModule = localStorage.getItem("goss-game-module");
      if (oldModule) {
        localStorage.setItem(MODULE_KEY, oldModule);
        localStorage.removeItem("goss-game-module");
      }
      const oldScenario = localStorage.getItem("goss-scenario");
      if (oldScenario) {
        localStorage.setItem(SCENARIO_KEY, oldScenario);
        localStorage.removeItem("goss-scenario");
      }
      return localStorage.getItem(GAME_SYSTEM_KEY) || visibleGames[0]?.id || "goss";
    } catch { return visibleGames[0]?.id || "goss"; }
  });

  const [moduleId, setModuleId] = useState<string | null>(() => {
    try { return localStorage.getItem(MODULE_KEY) || null; } catch { return null; }
  });

  const [scenario, setScenario] = useState<string | null>(() => {
    try { return localStorage.getItem(SCENARIO_KEY) || null; } catch { return null; }
  });

  const gameConfig = useMemo(() => getGameById(gameSystemId) ?? visibleGames[0], [gameSystemId, visibleGames]);

  useEffect(() => { localStorage.setItem(GAME_SYSTEM_KEY, gameSystemId); }, [gameSystemId]);
  useEffect(() => { moduleId ? localStorage.setItem(MODULE_KEY, moduleId) : localStorage.removeItem(MODULE_KEY); }, [moduleId]);
  useEffect(() => { scenario ? localStorage.setItem(SCENARIO_KEY, scenario) : localStorage.removeItem(SCENARIO_KEY); }, [scenario]);

  const changeGameSystem = (id: string) => {
    setGameSystemId(id);
    setModuleId(null);
    setScenario(null);
  };

  const changeModule = (id: string | null) => {
    setModuleId(id);
    setScenario(null);
  };

  return { visibleGames, gameConfig, gameSystemId, moduleId, scenario, changeGameSystem, changeModule, setScenario };
}

// Static imports for GOSS (the only game system currently).
// When adding a second game, these move to dynamic import() in each game's config.ts.
import gossSequence from "./data/goss/sequence.json";
import gossRulesData from "./data/goss/rules.json";
import warRulesData from "./data/goss/war/rules.json";
import hurtgenRulesData from "./data/goss/hurtgen/rules.json";
import lfRulesData from "./data/goss/lucky-forward/rules.json";
import awRulesData from "./data/goss/atlantic-wall/rules.json";
import warOverlayData from "./data/goss/war/sequence-overlay.json";
import hurtgenOverlayData from "./data/goss/hurtgen/sequence-overlay.json";
import lfOverlayData from "./data/goss/lucky-forward/sequence-overlay.json";
import awOverlayData from "./data/goss/atlantic-wall/sequence-overlay.json";
import gossLearnData from "./data/goss/learn.json";
import hurtgenLearnOverlayData from "./data/goss/hurtgen/learn-overlay.json";

const GOSS_BASE_RULES = gossRulesData as RuleEntry[];
const GOSS_BASE_PHASES = gossSequence.phases as Phase[];
const GOSS_MODULE_RULES: Record<string, RuleEntry[]> = {
  war: warRulesData as RuleEntry[],
  hurtgen: hurtgenRulesData as RuleEntry[],
  "lucky-forward": lfRulesData as RuleEntry[],
  "atlantic-wall": awRulesData as RuleEntry[],
};
const GOSS_MODULE_OVERLAYS: Record<string, SequenceOverlay> = {
  war: warOverlayData as SequenceOverlay,
  hurtgen: hurtgenOverlayData as SequenceOverlay,
  "lucky-forward": lfOverlayData as SequenceOverlay,
  "atlantic-wall": awOverlayData as SequenceOverlay,
};
const GOSS_BASE_LEARN = gossLearnData as LearnData;
const GOSS_MODULE_LEARN_OVERLAYS: Record<string, LearnOverlay> = {
  hurtgen: hurtgenLearnOverlayData as LearnOverlay,
};

/** Returns base + module data for the selected game. Currently only GOSS. */
function useGameData(_gameConfig: GameSystemConfig | undefined, moduleId: string | null) {
  // TODO: When adding a second game, switch on gameConfig.id and use dynamic imports
  return {
    baseRules: GOSS_BASE_RULES,
    basePhases: GOSS_BASE_PHASES,
    moduleRules: moduleId ? GOSS_MODULE_RULES[moduleId] ?? [] : [],
    moduleOverlay: moduleId ? GOSS_MODULE_OVERLAYS[moduleId] ?? null : null,
    baseLearn: GOSS_BASE_LEARN,
    moduleLearnOverlay: moduleId ? GOSS_MODULE_LEARN_OVERLAYS[moduleId] ?? null : null,
  };
}

function App() {
  const [view, setView] = useState<View>("sop");
  const { theme, toggleTheme } = useTheme();
  const {
    visibleGames, gameConfig, gameSystemId, moduleId, scenario,
    changeGameSystem, changeModule, setScenario,
  } = useGameSelection();

  const { baseRules, basePhases, moduleRules, moduleOverlay, baseLearn, moduleLearnOverlay } = useGameData(gameConfig, moduleId);

  const allRules = useMemo(() => mergeRules(baseRules, moduleRules), [baseRules, moduleRules]);
  const phases = useMemo(() => mergeSequence(basePhases, moduleOverlay, scenario), [basePhases, moduleOverlay, scenario]);
  const learnChapters = useMemo(() => mergeLearn(baseLearn, moduleLearnOverlay, scenario), [baseLearn, moduleLearnOverlay, scenario]);

  const {
    progress, currentPhase, currentSubPhase, currentSegment,
    goToPhase, nextStep, prevStep, toggleChecklist, clearChecklist, resetProgress,
  } = useSoPProgress(phases);

  // Build tabs from game features
  const tabs = useMemo(() => {
    const t = [{ key: "sop", label: "SoP" }];
    if (gameConfig?.features.learn) t.push({ key: "learn", label: "Learn" });
    if (gameConfig?.features.flowchart) t.push({ key: "flowchart", label: "Flowchart" });
    t.push({ key: "rules", label: "Rules" });
    if (gameConfig?.features.ask) t.push({ key: "ask", label: "Ask" });
    t.push({ key: "info", label: "Info" });
    return t;
  }, [gameConfig]);

  const handleSidebarSelect = (phaseIndex: number, subPhaseIndex?: number, segmentIndex?: number) => {
    // Steps and Learn both consume progress state — stay put on those.
    // Other tabs (Rules/Ask/Flowchart/Info) don't, so bounce back to Steps.
    if (view !== "sop" && view !== "learn") setView("sop");
    goToPhase(phaseIndex, subPhaseIndex, segmentIndex);
  };

  // Get current module config for scenario label lookup
  const currentModule: ModuleConfig | undefined = gameConfig?.modules.find((m) => m.id === moduleId);
  const scenarioLabel = scenario
    ? (currentModule?.scenarios.find((s) => s.id === scenario)?.label ?? "All Scenarios")
    : "All Scenarios";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-3 pt-3 pb-1">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Index
        </div>
      </div>
      <PhaseOverview
        phases={phases}
        currentPhaseIndex={progress.currentPhaseIndex}
        currentSubPhaseIndex={progress.currentSubPhaseIndex}
        currentSegmentIndex={progress.currentSegmentIndex}
        onSelectPhase={handleSidebarSelect}
      />
    </div>
  );

  return (
    <GlossaryProvider>
    <RulesProvider rules={allRules}>
      <AppShell
        sidebar={sidebar}
        gameSelector={
          <GameSelector
            games={visibleGames}
            gameSystemId={gameSystemId}
            onGameSystemChange={changeGameSystem}
            moduleId={moduleId}
            onModuleChange={changeModule}
            scenario={scenario}
            onScenarioChange={setScenario}
          />
        }
        tabs={tabs}
        activeTab={view}
        onTabChange={(key) => setView(key as View)}
        theme={theme}
        onToggleTheme={toggleTheme}
        title={gameConfig ? `${gameConfig.shortName} Assistant` : "Wargame Companion"}
        subtitle={gameConfig?.subtitle ?? ""}
      >
        {view === "sop" && (
          <PhaseStepper
            phase={currentPhase}
            subPhase={currentSubPhase}
            segment={currentSegment}
            progress={progress}
            totalPhases={phases.length}
            onNext={nextStep}
            onPrev={prevStep}
            onToggleChecklist={toggleChecklist}
            onClearChecklist={clearChecklist}
            onAdvanceTurn={resetProgress}
            onGoToPhase={goToPhase}
          />
        )}
        {view === "flowchart" && gameConfig?.features.flowchart && <SoPFlowchart />}
        {view === "rules" && <RulesSearch rules={allRules} />}
        {view === "learn" && gameConfig?.features.learn && (
          <LearnPanel
            chapters={learnChapters}
            phases={phases}
            currentPhase={currentPhase}
            currentSubPhase={currentSubPhase}
            currentSegment={currentSegment}
            progress={progress}
            totalPhases={phases.length}
            onAdvanceTurn={resetProgress}
            onGoToPhase={goToPhase}
          />
        )}
        {view === "ask" && gameConfig?.features.ask && (
          <AskPanel
            rules={allRules}
            phases={phases}
            workerUrl={gameConfig.askConfig.workerUrl}
            systemPromptPreamble={gameConfig.askConfig.systemPromptPreamble}
            exampleQuestions={gameConfig.askConfig.exampleQuestions}
          />
        )}
        {view === "info" && <InfoPanel />}
      </AppShell>
      <RuleModal />
      <QuickRefBar
        gameModule={moduleId}
        scenario={scenario ?? "all"}
        scenarioLabel={scenarioLabel}
        oobModules={gameConfig ? buildOobModules(gameConfig) : {}}
      />
    </RulesProvider>
    </GlossaryProvider>
  );
}

/** Build OOB lazy-load map from game config */
function buildOobModules(config: GameSystemConfig): Record<string, () => Promise<{ default: unknown }>> {
  const map: Record<string, () => Promise<{ default: unknown }>> = {};
  for (const mod of config.modules) {
    if (mod.data.oob) {
      map[mod.id] = mod.data.oob;
    }
  }
  return map;
}

export default App;
