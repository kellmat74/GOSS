import { useState, useEffect, useMemo } from "react";
import { AppShell } from "./components/Layout/AppShell";
import { PhaseOverview } from "./components/SequenceOfPlay/PhaseOverview";
import { PhaseStepper } from "./components/SequenceOfPlay/PhaseStepper";
import { TurnInfo } from "./components/SequenceOfPlay/TurnInfo";
import { GameSelector, type GameModule } from "./components/Layout/GameSelector";
import { RulesSearch } from "./components/RulesReference/RulesSearch";
import { RuleModal } from "./components/RulesReference/RuleModal";
import { AskPanel } from "./components/Ask/AskPanel";
import { SoPFlowchart } from "./components/Flowchart/SoPFlowchart";
import { RulesProvider } from "./context/RulesContext";
import { useSoPProgress } from "./hooks/useSoPProgress";
import { mergeRules } from "./utils/mergeRules";
import sequenceData from "./data/goss/sequence.json";
import gossRules from "./data/goss/rules.json";
import warRules from "./data/war/rules.json";
import hurtgenRules from "./data/hurtgen/rules.json";
import lfRules from "./data/lucky-forward/rules.json";
import type { Phase, RuleEntry } from "./types/goss";

const phases = sequenceData.phases as Phase[];
const baseRules = gossRules as RuleEntry[];
const scenarioRuleSets: Record<string, RuleEntry[]> = {
  war: warRules as RuleEntry[],
  hurtgen: hurtgenRules as RuleEntry[],
  "lucky-forward": lfRules as RuleEntry[],
};

type View = "sop" | "flowchart" | "rules" | "ask";

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

  useEffect(() => {
    if (gameModule) {
      localStorage.setItem(GAME_KEY, gameModule);
    } else {
      localStorage.removeItem(GAME_KEY);
    }
  }, [gameModule]);

  return { gameModule, setGameModule };
}

function App() {
  const [view, setView] = useState<View>("sop");
  const { theme, toggleTheme } = useTheme();
  const { gameModule, setGameModule } = useGameModule();

  const allRules = useMemo(() => {
    const scenario = gameModule ? scenarioRuleSets[gameModule] ?? [] : [];
    return mergeRules(baseRules, scenario);
  }, [gameModule]);
  const {
    progress,
    currentPhase,
    currentSubPhase,
    goToPhase,
    nextStep,
    prevStep,
    toggleChecklist,
    clearChecklist,
    setTimeOfDay,
    advanceTurn,
  } = useSoPProgress(phases);

  const tabs = [
    { key: "sop", label: "Steps" },
    { key: "flowchart", label: "Flowchart" },
    { key: "rules", label: "Rules" },
    { key: "ask", label: "Ask" },
  ];

  const sidebar = (
    <div className="flex h-full flex-col">
      {view === "sop" && (
        <PhaseOverview
          phases={phases}
          currentPhaseIndex={progress.currentPhaseIndex}
          currentSubPhaseIndex={progress.currentSubPhaseIndex}
          timeOfDay={progress.gameTurn.timeOfDay}
          onSelectPhase={goToPhase}
        />
      )}
    </div>
  );

  return (
    <RulesProvider rules={allRules}>
      <AppShell
        sidebar={sidebar}
        turnInfo={<TurnInfo timeOfDay={progress.gameTurn.timeOfDay} onChangeTimeOfDay={setTimeOfDay} />}
        gameSelector={<GameSelector value={gameModule} onChange={setGameModule} />}
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
            progress={progress}
            totalPhases={phases.length}
            onNext={nextStep}
            onPrev={prevStep}
            onToggleChecklist={toggleChecklist}
            onClearChecklist={clearChecklist}
            onAdvanceTurn={advanceTurn}
            onGoToPhase={goToPhase}
            timeOfDay={progress.gameTurn.timeOfDay}
          />
        )}
        {view === "flowchart" && <SoPFlowchart />}
        {view === "rules" && <RulesSearch rules={allRules} />}
        {view === "ask" && <AskPanel rules={allRules} />}
      </AppShell>
      <RuleModal />
    </RulesProvider>
  );
}

export default App;
