import { useState } from "react";
import { QuickRefModal } from "./QuickRefModal";
import { OOBModal } from "./OOBModal";
import { useTables } from "../../context/TablesContext";
import type { GameSystemConfig, QuickRefButtonDef } from "../../types/platform";

interface QuickRefBarProps {
  gameConfig: GameSystemConfig;
  gameModule: string | null;
  scenario: string;
  scenarioLabel: string;
}

export function QuickRefBar({ gameConfig, gameModule, scenario, scenarioLabel }: QuickRefBarProps) {
  const { openTable } = useTables();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [quickRefData, setQuickRefData] = useState<Record<string, unknown> | null>(null);
  const [oobRaw, setOobRaw] = useState<Record<string, unknown> | null>(null);

  const allButtons = gameConfig.quickRefButtons ?? [];

  // Hide OOB button if the selected module has no OOB data
  const visibleButtons = allButtons.filter((btn) => {
    if (btn.kind === "oob") {
      const mod = gameConfig.modules.find((m) => m.id === gameModule);
      return !!mod?.data.oob;
    }
    return true;
  });

  const handleClick = async (btn: QuickRefButtonDef) => {
    // Toggle off
    if (activeId === btn.id) {
      setActiveId(null);
      return;
    }

    if (btn.kind === "table" && btn.tableId) {
      // Delegate to the shared TableModal via context — no local state needed
      openTable(btn.tableId);
      return;
    }

    if (btn.kind === "json-quickref" && btn.jsonKey) {
      // Lazy-load quickRef JSON on first use
      if (!quickRefData && gameConfig.baseData.quickRef) {
        try {
          const mod = await gameConfig.baseData.quickRef();
          setQuickRefData(mod.default as Record<string, unknown>);
        } catch {
          return;
        }
      }
    }

    if (btn.kind === "oob") {
      const mod = gameConfig.modules.find((m) => m.id === gameModule);
      if (mod?.data.oob) {
        try {
          const m = await mod.data.oob();
          setOobRaw(m.default as Record<string, unknown>);
        } catch {
          return;
        }
      }
    }

    setActiveId(btn.id);
  };

  const activeBtn = visibleButtons.find((b) => b.id === activeId);

  // OOB data: prefer scenario key, fall back to "all", then root
  const oobData = oobRaw
    ? (oobRaw[scenario] ?? oobRaw["all"] ?? oobRaw)
    : null;

  return (
    <>
      {/* Floating button strip on right edge */}
      <div className="fixed right-0 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1 rounded-l-lg border border-r-0 border-stone-300 bg-stone-100 p-1 shadow-lg dark:border-stone-600 dark:bg-stone-800">
        {visibleButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleClick(btn)}
            className={`flex flex-col items-center rounded px-1.5 py-2 text-xs font-medium transition-colors ${
              activeId === btn.id
                ? "bg-accent-500 text-white"
                : "text-stone-600 hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-700"
            }`}
            title={btn.title}
          >
            <span className="text-base leading-none">{btn.icon}</span>
            <span className="mt-0.5">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Modals */}
      {activeBtn?.kind === "json-quickref" && quickRefData && activeBtn.jsonKey && (
        <QuickRefModal
          data={quickRefData[activeBtn.jsonKey] as any}
          onClose={() => setActiveId(null)}
        />
      )}
      {activeBtn?.kind === "oob" && oobData && (
        <OOBModal
          data={oobData as any}
          scenarioLabel={scenarioLabel}
          onClose={() => setActiveId(null)}
        />
      )}
    </>
  );
}
