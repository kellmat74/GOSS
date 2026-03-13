import { useState } from "react";
import { AppShell } from "./components/Layout/AppShell";
import { PhaseOverview } from "./components/SequenceOfPlay/PhaseOverview";
import { PhaseStepper } from "./components/SequenceOfPlay/PhaseStepper";
import { TurnInfo } from "./components/SequenceOfPlay/TurnInfo";
import { RulesSearch } from "./components/RulesReference/RulesSearch";
import { SoPFlowchart } from "./components/Flowchart/SoPFlowchart";
import { useSoPProgress } from "./hooks/useSoPProgress";
import sequenceData from "./data/goss/sequence.json";
import gossRules from "./data/goss/rules.json";
import warRules from "./data/war/rules.json";
import type { Phase, RuleEntry } from "./types/goss";

const phases = sequenceData.phases as Phase[];
const allRules = [...(gossRules as RuleEntry[]), ...(warRules as RuleEntry[])];

type View = "sop" | "flowchart" | "rules";

function App() {
  const [view, setView] = useState<View>("sop");
  const {
    progress,
    currentPhase,
    currentSubPhase,
    goToPhase,
    nextStep,
    prevStep,
    toggleChecklist,
    advanceTurn,
  } = useSoPProgress(phases);

  const tabs: { key: View; label: string }[] = [
    { key: "sop", label: "Steps" },
    { key: "flowchart", label: "Flowchart" },
    { key: "rules", label: "Rules" },
  ];

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* View switcher */}
      <div className="flex border-b border-stone-200 dark:border-stone-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex-1 px-3 py-2 text-sm font-medium ${
              view === tab.key
                ? "border-b-2 border-amber-500 text-amber-700 dark:text-amber-400"
                : "text-stone-500 hover:text-stone-700 dark:text-stone-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "sop" && (
        <PhaseOverview
          phases={phases}
          currentPhaseIndex={progress.currentPhaseIndex}
          currentSubPhaseIndex={progress.currentSubPhaseIndex}
          onSelectPhase={goToPhase}
        />
      )}
    </div>
  );

  return (
    <AppShell
      sidebar={sidebar}
      turnInfo={<TurnInfo turn={progress.gameTurn} />}
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
          onAdvanceTurn={advanceTurn}
          onGoToPhase={goToPhase}
        />
      )}
      {view === "flowchart" && <SoPFlowchart />}
      {view === "rules" && <RulesSearch rules={allRules} />}
    </AppShell>
  );
}

export default App;
