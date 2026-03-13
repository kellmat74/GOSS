import { useState, useEffect } from "react";
import { AppShell } from "./components/Layout/AppShell";
import { PhaseOverview } from "./components/SequenceOfPlay/PhaseOverview";
import { PhaseStepper } from "./components/SequenceOfPlay/PhaseStepper";
import { TurnInfo } from "./components/SequenceOfPlay/TurnInfo";
import { RulesSearch } from "./components/RulesReference/RulesSearch";
import { RuleModal } from "./components/RulesReference/RuleModal";
import { SoPFlowchart } from "./components/Flowchart/SoPFlowchart";
import { RulesProvider } from "./context/RulesContext";
import { useSoPProgress } from "./hooks/useSoPProgress";
import sequenceData from "./data/goss/sequence.json";
import gossRules from "./data/goss/rules.json";
import type { Phase, RuleEntry } from "./types/goss";

const phases = sequenceData.phases as Phase[];
const allRules = gossRules as RuleEntry[];

type View = "sop" | "flowchart" | "rules" | "ask";

const THEME_KEY = "goss-theme";

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

function App() {
  const [view, setView] = useState<View>("sop");
  const { theme, toggleTheme } = useTheme();
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
        {view === "ask" && (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400">
            <svg className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <p className="text-lg font-medium">AI Rules Assistant</p>
            <p className="mt-1 text-sm">Coming soon — ask rules questions and get answers with citations</p>
          </div>
        )}
      </AppShell>
      <RuleModal />
    </RulesProvider>
  );
}

export default App;
