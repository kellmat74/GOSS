import { useState, useEffect, useMemo } from "react";
import { AppShell } from "./components/Layout/AppShell";
import { PhaseOverview } from "./components/SequenceOfPlay/PhaseOverview";
import { PhaseStepper } from "./components/SequenceOfPlay/PhaseStepper";
import { GameSelector, type GameModule, GAME_SCENARIOS } from "./components/Layout/GameSelector";
import { RulesSearch } from "./components/RulesReference/RulesSearch";
import { RuleModal } from "./components/RulesReference/RuleModal";
import { AskPanel } from "./components/Ask/AskPanel";
import { SoPFlowchart } from "./components/Flowchart/SoPFlowchart";
import { InfoPanel } from "./components/InfoPanel";
import { QuickRefBar } from "./components/QuickRef/QuickRefBar";
import { RulesProvider } from "./context/RulesContext";
import { GlossaryProvider } from "./context/GlossaryContext";
import { useSoPProgress } from "./hooks/useSoPProgress";
import { mergeRules } from "./utils/mergeRules";
import { mergeSequence } from "./utils/mergeSequence";
import sequenceData from "./data/goss/sequence.json";
import gossRules from "./data/goss/rules.json";
import warRules from "./data/war/rules.json";
import hurtgenRules from "./data/hurtgen/rules.json";
import lfRules from "./data/lucky-forward/rules.json";
import awRules from "./data/atlantic-wall/rules.json";
import hurtgenSeqOverlay from "./data/hurtgen/sequence-overlay.json";
import lfSeqOverlay from "./data/lucky-forward/sequence-overlay.json";
import warSeqOverlay from "./data/war/sequence-overlay.json";
import awSeqOverlay from "./data/atlantic-wall/sequence-overlay.json";
import type { Phase, RuleEntry, SequenceOverlay } from "./types/goss";

const basePhases = sequenceData.phases as Phase[];
const baseRules = gossRules as RuleEntry[];
const scenarioRuleSets: Record<string, RuleEntry[]> = {
  war: warRules as RuleEntry[],
  hurtgen: hurtgenRules as RuleEntry[],
  "lucky-forward": lfRules as RuleEntry[],
  "atlantic-wall": awRules as RuleEntry[],
};
const scenarioSeqOverlays: Record<string, SequenceOverlay> = {
  war: warSeqOverlay as SequenceOverlay,
  hurtgen: hurtgenSeqOverlay as SequenceOverlay,
  "lucky-forward": lfSeqOverlay as SequenceOverlay,
  "atlantic-wall": awSeqOverlay as SequenceOverlay,
};

const SCENARIO_KEY = "goss-scenario";

type View = "sop" | "flowchart" | "rules" | "ask" | "info";

const THEME_KEY = "goss-theme";
const GAME_KEY = "goss-game-module";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
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

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}

function useGameModule() {
  const [gameModule, setGameModule] = useState<GameModule>(() => {
    try {
      const saved = localStorage.getItem(GAME_KEY);
      if (saved && saved in scenarioRuleSets) return saved as GameModule;
    } catch { /* ignore */ }
    return null;
  });

  const [scenario, setScenario] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SCENARIO_KEY) || null;
    } catch { /* ignore */ }
    return null;
  });

  useEffect(() => {
    if (gameModule) {
      localStorage.setItem(GAME_KEY, gameModule);
    } else {
      localStorage.removeItem(GAME_KEY);
    }
  }, [gameModule]);

  useEffect(() => {
    if (scenario) {
      localStorage.setItem(SCENARIO_KEY, scenario);
    } else {
      localStorage.removeItem(SCENARIO_KEY);
    }
  }, [scenario]);

  return { gameModule, setGameModule, scenario, setScenario };
}

function App() {
  const [view, setView] = useState<View>("sop");
  const { theme, toggleTheme } = useTheme();
  const { gameModule, setGameModule, scenario, setScenario } = useGameModule();

  const allRules = useMemo(() => {
    const scenario = gameModule ? scenarioRuleSets[gameModule] ?? [] : [];
    return mergeRules(baseRules, scenario);
  }, [gameModule]);

  const phases = useMemo(() => {
    const overlay = gameModule ? scenarioSeqOverlays[gameModule] ?? null : null;
    return mergeSequence(basePhases, overlay, scenario);
  }, [gameModule, scenario]);

  const {
    progress,
    currentPhase,
    currentSubPhase,
    currentSegment,
    goToPhase,
    nextStep,
    prevStep,
    toggleChecklist,
    clearChecklist,
    resetProgress,
  } = useSoPProgress(phases);

  const tabs = [
    { key: "sop", label: "Steps" },
    { key: "flowchart", label: "Flowchart" },
    { key: "rules", label: "Rules" },
    { key: "ask", label: "Ask" },
    { key: "info", label: "Info" },
  ];

  const handleSidebarSelect = (phaseIndex: number, subPhaseIndex?: number, segmentIndex?: number) => {
    if (view !== "sop") setView("sop");
    goToPhase(phaseIndex, subPhaseIndex, segmentIndex);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
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
        gameSelector={<GameSelector value={gameModule} onChange={setGameModule} scenario={scenario} onScenarioChange={setScenario} />}
        tabs={tabs}
        activeTab={view}
        onTabChange={(key) => setView(key as View)}
        theme={theme}
        onToggleTheme={toggleTheme}
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
        {view === "flowchart" && <SoPFlowchart />}
        {view === "rules" && <RulesSearch rules={allRules} />}
        {view === "ask" && <AskPanel rules={allRules} phases={phases} />}
        {view === "info" && <InfoPanel />}
      </AppShell>
      <RuleModal />
      <QuickRefBar
        gameModule={gameModule}
        scenario={scenario ?? "all"}
        scenarioLabel={
          gameModule && scenario
            ? (GAME_SCENARIOS[gameModule]?.find((s) => s.id === scenario)?.label ?? "All Scenarios")
            : "All Scenarios"
        }
      />
    </RulesProvider>
    </GlossaryProvider>
  );
}

export default App;
