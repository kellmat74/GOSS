import { useState, useCallback, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { ReactFlowChart } from "./ReactFlowChart";
import { flowchartDefs, getFlowchartDef } from "./flowLayouts";
import { Breadcrumb, type BreadcrumbItem } from "../Breadcrumb";
import { NodeDetailPanel, findDetailByRuleRef, type NodeDetail } from "./NodeDetailPanel";
import { useRules } from "../../context/RulesContext";
import sequenceData from "../../data/goss/sequence.json";
import type { Phase } from "../../types/goss";

const phases = sequenceData.phases as Phase[];

export function SoPFlowchart() {
  const { getRuleBySection } = useRules();
  const [history, setHistory] = useState<string[]>([]);
  const [activeId, setActiveId] = useState("game-turn");
  const [detail, setDetail] = useState<NodeDetail | null>(null);

  const activeDef = getFlowchartDef(activeId) ?? flowchartDefs[0];

  // Listen for info button clicks from FlowNode
  useEffect(() => {
    const handler = (e: Event) => {
      const ruleRef = (e as CustomEvent).detail?.ruleRef;
      if (ruleRef) {
        let found = findDetailByRuleRef(phases, ruleRef);
        if (!found) {
          // Fall back to rule entry from rules.json
          const rule = getRuleBySection(ruleRef);
          if (rule) {
            found = {
              name: rule.title,
              ruleRef: rule.section,
              description: rule.text || rule.summary,
              notes: [],
              checklist: [],
              player: "both",
            };
          }
        }
        setDetail(found);
      }
    };
    window.addEventListener("flownode-info", handler);
    return () => window.removeEventListener("flownode-info", handler);
  }, [getRuleBySection]);

  const navigateTo = useCallback(
    (targetId: string) => {
      setDetail(null); // close panel on navigation
      setHistory((h) => [...h, activeId]);
      setActiveId(targetId);
    },
    [activeId]
  );

  const navigateBack = useCallback(
    (index: number) => {
      setDetail(null);
      setActiveId(index === 0 && history.length === 0 ? "game-turn" : history[index] ?? "game-turn");
      setHistory((h) => h.slice(0, index));
    },
    [history]
  );

  // Build breadcrumb items from history + current
  const breadcrumbItems: BreadcrumbItem[] = [
    ...history.map((id, i) => {
      const def = getFlowchartDef(id);
      return {
        label: def?.title ?? id,
        onClick: () => navigateBack(i),
      };
    }),
    { label: activeDef.title },
  ];

  const selectTab = (id: string) => {
    setDetail(null);
    setHistory([]);
    setActiveId(id);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="mb-2 text-2xl font-bold">Sequence of Play Flowchart</h2>
      <p className="mb-3 text-sm text-stone-400">
        Interactive flowchart of the GOSS turn structure. Click highlighted nodes to drill down. Tap <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-stone-600 text-[9px] font-bold text-stone-200">i</span> for details.
      </p>

      <Breadcrumb items={breadcrumbItems} />

      {/* Level selector tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {flowchartDefs.map((def) => (
          <button
            key={def.id}
            onClick={() => selectTab(def.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeId === def.id
                ? "bg-accent-600 text-white"
                : "bg-stone-700 text-stone-300 hover:bg-stone-600"
            }`}
          >
            {def.title}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="mb-3 text-sm text-stone-400">{activeDef.description}</p>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-stone-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-accent-600" /> Start/End
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-blue-600" /> Decision/Loop
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-green-700" /> Phasing Player
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-red-700" /> Non-Phasing Player
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-purple-700" /> Logistics
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded border border-accent-400 bg-transparent" /> Click to drill down
        </span>
      </div>

      {/* Diagram + Detail panel */}
      <div className="relative">
        <ReactFlowProvider>
          <ReactFlowChart
            key={activeDef.id}
            def={activeDef}
            onDrillDown={navigateTo}
          />
        </ReactFlowProvider>

        {/* Slide-in detail panel */}
        {detail && (
          <NodeDetailPanel
            detail={detail}
            onClose={() => setDetail(null)}
          />
        )}
      </div>
    </div>
  );
}
