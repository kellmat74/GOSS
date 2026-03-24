import { useState } from "react";
import { QuickRefModal } from "./QuickRefModal";
import { OOBModal } from "./OOBModal";
import quickRef from "../../data/goss/quick-ref.json";

type RefKey = "tec" | "stacking" | "oob";

interface QuickRefBarProps {
  gameModule: string | null;
  scenario: string;
  scenarioLabel: string;
  oobModules?: Record<string, () => Promise<{ default: unknown }>>;
}

const buttons: { key: RefKey; label: string; icon: string; title: string; requiresOOB?: boolean }[] = [
  { key: "tec", label: "TEC", icon: "⛰", title: "Terrain Effects Chart" },
  { key: "stacking", label: "STK", icon: "📦", title: "Stacking Limits" },
  { key: "oob", label: "OOB", icon: "🎖", title: "Order of Battle", requiresOOB: true },
];

export function QuickRefBar({ gameModule, scenario, scenarioLabel, oobModules = {} }: QuickRefBarProps) {
  const [activeRef, setActiveRef] = useState<RefKey | null>(null);
  const [oobRaw, setOobRaw] = useState<Record<string, unknown> | null>(null);

  const hasOOB = gameModule && gameModule in oobModules;

  const handleClick = async (key: RefKey) => {
    if (activeRef === key) {
      setActiveRef(null);
      return;
    }
    if (key === "oob" && gameModule && oobModules[gameModule]) {
      try {
        const mod = await oobModules[gameModule]();
        setOobRaw(mod.default as Record<string, unknown>);
      } catch {
        return;
      }
    }
    setActiveRef(key);
  };

  // Pick scenario-specific OOB data, falling back to "all"
  const oobData = oobRaw
    ? (oobRaw[scenario] ?? oobRaw["all"] ?? oobRaw)
    : null;

  const visibleButtons = buttons.filter(
    (btn) => !btn.requiresOOB || hasOOB
  );

  return (
    <>
      {/* Floating button strip on right edge */}
      <div className="fixed right-0 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1 rounded-l-lg border border-r-0 border-stone-300 bg-stone-100 p-1 shadow-lg dark:border-stone-600 dark:bg-stone-800">
        {visibleButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleClick(btn.key)}
            className={`flex flex-col items-center rounded px-1.5 py-2 text-xs font-medium transition-colors ${
              activeRef === btn.key
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
      {activeRef === "tec" && (
        <QuickRefModal
          data={quickRef.tec as any}
          onClose={() => setActiveRef(null)}
        />
      )}
      {activeRef === "stacking" && (
        <QuickRefModal
          data={quickRef.stacking as any}
          onClose={() => setActiveRef(null)}
        />
      )}
      {activeRef === "oob" && oobData && (
        <OOBModal
          data={oobData as any}
          scenarioLabel={scenarioLabel}
          onClose={() => setActiveRef(null)}
        />
      )}
    </>
  );
}
