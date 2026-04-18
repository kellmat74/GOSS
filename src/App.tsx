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
import { OptionsPanel } from "./components/Options/OptionsPanel";
import { QuickRefBar } from "./components/QuickRef/QuickRefBar";
import { RulesProvider } from "./context/RulesContext";
import { GlossaryProvider } from "./context/GlossaryContext";
import { useSoPProgress } from "./hooks/useSoPProgress";
import { useOptionalRules } from "./hooks/useOptionalRules";
import { mergeRules } from "./utils/mergeRules";
import { mergeSequence } from "./utils/mergeSequence";
import { mergeLearn } from "./utils/mergeLearn";
import { getVisibleGames, getGameById } from "./data/registry";
import type { Phase, RuleEntry, SequenceOverlay } from "./types/goss";
import type { LearnData, LearnOverlay } from "./types/learn";
import type { GameSystemConfig, ModuleConfig, ComplexityLevel } from "./types/platform";

type View = "sop" | "flowchart" | "rules" | "ask" | "learn" | "options" | "info";

const THEME_KEY = "wc-theme";
const GAME_SYSTEM_KEY = "wc-game-system";
const MODULE_KEY = "wc-module";
const SCENARIO_KEY = "wc-scenario";
const COMPLEXITY_KEY = "wc-complexity";

// ---------------------------------------------------------------------------
// Theme hook
// ---------------------------------------------------------------------------

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
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

// ---------------------------------------------------------------------------
// Game selection hook
// ---------------------------------------------------------------------------

function useGameSelection() {
  const visibleGames = useMemo(() => getVisibleGames(), []);

  const [gameSystemId, setGameSystemId] = useState<string>(() => {
    try {
      const oldModule = localStorage.getItem("goss-game-module");
      if (oldModule) { localStorage.setItem(MODULE_KEY, oldModule); localStorage.removeItem("goss-game-module"); }
      const oldScenario = localStorage.getItem("goss-scenario");
      if (oldScenario) { localStorage.setItem(SCENARIO_KEY, oldScenario); localStorage.removeItem("goss-scenario"); }
      return localStorage.getItem(GAME_SYSTEM_KEY) || visibleGames[0]?.id || "goss";
    } catch { return visibleGames[0]?.id || "goss"; }
  });

  const [moduleId, setModuleId] = useState<string | null>(() => {
    try { return localStorage.getItem(MODULE_KEY) || null; } catch { return null; }
  });

  const [scenario, setScenario] = useState<string | null>(() => {
    try { return localStorage.getItem(SCENARIO_KEY) || null; } catch { return null; }
  });

  const [complexity, setComplexity] = useState<ComplexityLevel>(() => {
    try {
      const saved = localStorage.getItem(COMPLEXITY_KEY);
      if (saved === "standard" || saved === "advanced") return saved;
    } catch { /* ignore */ }
    return "standard";
  });

  const gameConfig = useMemo(
    () => getGameById(gameSystemId) ?? visibleGames[0],
    [gameSystemId, visibleGames],
  );

  useEffect(() => { localStorage.setItem(GAME_SYSTEM_KEY, gameSystemId); }, [gameSystemId]);
  useEffect(() => { moduleId ? localStorage.setItem(MODULE_KEY, moduleId) : localStorage.removeItem(MODULE_KEY); }, [moduleId]);
  useEffect(() => { scenario ? localStorage.setItem(SCENARIO_KEY, scenario) : localStorage.removeItem(SCENARIO_KEY); }, [scenario]);
  useEffect(() => { localStorage.setItem(COMPLEXITY_KEY, complexity); }, [complexity]);

  const changeGameSystem = (id: string) => {
    setGameSystemId(id);
    setModuleId(null);
    setScenario(null);
    setComplexity("standard");
  };

  const changeModule = (id: string | null) => {
    setModuleId(id);
    setScenario(null);
  };

  const changeComplexity = (c: ComplexityLevel) => {
    // Only allow if game supports it
    if (gameConfig?.complexityLevels?.includes(c)) {
      setComplexity(c);
    }
  };

  return {
    visibleGames, gameConfig, gameSystemId, moduleId, scenario, complexity,
    changeGameSystem, changeModule, setScenario, changeComplexity,
  };
}

// ---------------------------------------------------------------------------
// Async game data hook — loads from config's dynamic import() loaders
// ---------------------------------------------------------------------------

interface GameData {
  baseRules: RuleEntry[];
  basePhases: Phase[];
  baseLearn: LearnData;
  moduleRules: RuleEntry[];
  moduleOverlay: SequenceOverlay | null;
  moduleLearnOverlay: LearnOverlay | null;
}

const EMPTY_LEARN: LearnData = { chapters: [] };

function useGameData(
  gameConfig: GameSystemConfig | undefined,
  moduleId: string | null,
  complexity: ComplexityLevel,
) {
  const [data, setData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameConfig) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let cancelled = false;

    const moduleConfig = moduleId
      ? gameConfig.modules.find((m) => m.id === moduleId) ?? null
      : null;

    const isAdvanced = complexity === "advanced";

    Promise.all([
      // Base rules (standard always; advanced appended on top)
      gameConfig.baseData.rules(),
      isAdvanced && gameConfig.baseData.advancedRules
        ? gameConfig.baseData.advancedRules()
        : Promise.resolve(null),
      // Sequence (advanced replaces standard when available)
      isAdvanced && gameConfig.baseData.advancedSequence
        ? gameConfig.baseData.advancedSequence()
        : gameConfig.baseData.sequence(),
      // Learn
      isAdvanced && gameConfig.baseData.advancedLearn
        ? gameConfig.baseData.advancedLearn()
        : (gameConfig.baseData.learn ? gameConfig.baseData.learn() : Promise.resolve(null)),
      // Module rules
      moduleConfig?.data.rules ? moduleConfig.data.rules() : Promise.resolve(null),
      isAdvanced && moduleConfig?.data.advancedRules
        ? moduleConfig.data.advancedRules()
        : Promise.resolve(null),
      // Module sequence overlay
      isAdvanced && moduleConfig?.data.advancedSequenceOverlay
        ? moduleConfig.data.advancedSequenceOverlay()
        : (moduleConfig?.data.sequenceOverlay ? moduleConfig.data.sequenceOverlay() : Promise.resolve(null)),
      // Module learn overlay
      moduleConfig?.data.learnOverlay ? moduleConfig.data.learnOverlay() : Promise.resolve(null),
    ]).then((results) => {
      if (cancelled) return;
      const [
        baseRulesRaw, advRulesRaw, seqRaw, learnRaw,
        modRulesRaw, modAdvRulesRaw, overlayRaw, learnOverlayRaw,
      ] = results;

      const baseRules: RuleEntry[] = [
        ...((baseRulesRaw as any)?.default ?? []),
        ...((advRulesRaw as any)?.default ?? []),
      ];
      const basePhases: Phase[] =
        (seqRaw as any)?.default?.phases ?? [];
      const baseLearn: LearnData =
        (learnRaw as any)?.default ?? EMPTY_LEARN;
      const moduleRules: RuleEntry[] = [
        ...((modRulesRaw as any)?.default ?? []),
        ...((modAdvRulesRaw as any)?.default ?? []),
      ];
      const moduleOverlay: SequenceOverlay | null =
        (overlayRaw as any)?.default ?? null;
      const moduleLearnOverlay: LearnOverlay | null =
        (learnOverlayRaw as any)?.default ?? null;

      setData({ baseRules, basePhases, baseLearn, moduleRules, moduleOverlay, moduleLearnOverlay });
      setLoading(false);
    }).catch((err) => {
      if (!cancelled) {
        console.error("Failed to load game data:", err);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [gameConfig?.id, moduleId, complexity]);

  return { data, loading };
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

function App() {
  const [view, setView] = useState<View>("sop");
  const { theme, toggleTheme } = useTheme();
  const {
    visibleGames, gameConfig, gameSystemId, moduleId, scenario, complexity,
    changeGameSystem, changeModule, setScenario, changeComplexity,
  } = useGameSelection();

  const { data, loading } = useGameData(gameConfig, moduleId, complexity);

  const allRules = useMemo(
    () => mergeRules(data?.baseRules ?? [], data?.moduleRules ?? []),
    [data?.baseRules, data?.moduleRules],
  );

  const {
    activeOptions, allRules: allOptionalRules, toggleOption, resetToDefaults,
  } = useOptionalRules(
    gameSystemId,
    moduleId,
    gameConfig?.optionalRules ?? [],
    gameConfig?.supplements ?? [],
  );

  const phases = useMemo(
    () => mergeSequence(data?.basePhases ?? [], data?.moduleOverlay ?? null, scenario, activeOptions),
    [data?.basePhases, data?.moduleOverlay, scenario, activeOptions],
  );

  const learnChapters = useMemo(
    () => mergeLearn(data?.baseLearn ?? EMPTY_LEARN, data?.moduleLearnOverlay ?? null, scenario, activeOptions),
    [data?.baseLearn, data?.moduleLearnOverlay, scenario, activeOptions],
  );

  const {
    progress, currentPhase, currentSubPhase, currentSegment,
    goToPhase, nextStep, prevStep, toggleChecklist, clearChecklist, resetProgress,
  } = useSoPProgress(phases);

  // Build tabs from game features
  const tabs = useMemo(() => {
    const t = [{ key: "sop", label: "SoP" }];
    if (gameConfig?.features.learn) t.push({ key: "learn", label: "AI Coach" });
    if (gameConfig?.features.flowchart) t.push({ key: "flowchart", label: "Flowchart" });
    t.push({ key: "rules", label: "Rules" });
    if (gameConfig?.features.ask) t.push({ key: "ask", label: "Ask" });
    if (gameConfig?.features.options) t.push({ key: "options", label: "Options" });
    t.push({ key: "info", label: "Info" });
    return t;
  }, [gameConfig]);

  const handleSidebarSelect = (phaseIndex: number, subPhaseIndex?: number, segmentIndex?: number) => {
    if (view !== "sop" && view !== "learn") setView("sop");
    goToPhase(phaseIndex, subPhaseIndex, segmentIndex);
  };

  const currentModule: ModuleConfig | undefined = gameConfig?.modules.find((m) => m.id === moduleId);
  const scenarioLabel = scenario
    ? (currentModule?.scenarios.find((s) => s.id === scenario)?.label ?? "All Scenarios")
    : "All Scenarios";

  // Loading screen
  if (loading && !data) {
    return (
      <div className={`flex h-screen items-center justify-center ${theme === "dark" ? "bg-stone-900" : "bg-white"}`}>
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-accent-500" />
          <p className="text-sm text-stone-400">Loading {gameConfig?.name ?? "game data"}…</p>
        </div>
      </div>
    );
  }

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
            complexity={complexity}
            onComplexityChange={changeComplexity}
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
        {view === "options" && gameConfig?.features.options && (
          <OptionsPanel
            allRules={allOptionalRules}
            supplements={gameConfig.supplements ?? []}
            activeOptions={activeOptions}
            onToggle={toggleOption}
            onResetToDefaults={resetToDefaults}
          />
        )}
        {view === "info" && <InfoPanel gameConfig={gameConfig} />}
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

function buildOobModules(
  config: GameSystemConfig,
): Record<string, () => Promise<{ default: unknown }>> {
  const map: Record<string, () => Promise<{ default: unknown }>> = {};
  for (const mod of config.modules) {
    if (mod.data.oob) {
      map[mod.id] = mod.data.oob;
    }
  }
  return map;
}

export default App;
