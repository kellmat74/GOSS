import { useState } from "react";
import { QuickRefModal } from "./QuickRefModal";
import quickRef from "../../data/goss/quick-ref.json";

type RefKey = "tec" | "stacking";

const buttons: { key: RefKey; label: string; icon: string; title: string }[] = [
  { key: "tec", label: "TEC", icon: "⛰", title: "Terrain Effects Chart" },
  { key: "stacking", label: "STK", icon: "📦", title: "Stacking Limits" },
];

export function QuickRefBar() {
  const [activeRef, setActiveRef] = useState<RefKey | null>(null);

  return (
    <>
      {/* Floating button strip on right edge */}
      <div className="fixed right-0 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1 rounded-l-lg border border-r-0 border-stone-300 bg-stone-100 p-1 shadow-lg dark:border-stone-600 dark:bg-stone-800">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveRef(activeRef === btn.key ? null : btn.key)}
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

      {/* Modal */}
      {activeRef && (
        <QuickRefModal
          data={quickRef[activeRef]}
          onClose={() => setActiveRef(null)}
        />
      )}
    </>
  );
}
