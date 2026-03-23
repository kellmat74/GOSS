import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { OOBTree, type OOBNode } from "./OOBTree";

interface OOBData {
  allied: { label: string; children: OOBNode[] };
  german: { label: string; children: OOBNode[] };
}

interface OOBModalProps {
  data: OOBData;
  onClose: () => void;
}

const lowerUnitsTree: OOBNode[] = [
  {
    id: "division", label: "Division (Div)", type: "army-group",
    children: [
      {
        id: "regiment", label: "Regiment (Rgt) / Brigade (Bde)", type: "army",
        children: [
          {
            id: "battalion", label: "Battalion (Bn)", type: "corps",
            children: [
              {
                id: "company", label: "Company (Co) / Battery (Bty)", type: "division",
                children: [
                  { id: "platoon", label: "Platoon (Plt) / Section", type: "division" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "div-assets", label: "Division Assets", type: "army",
        children: [
          { id: "div-arty", label: "Division Artillery (Div Arty)", type: "corps" },
          { id: "div-recon", label: "Reconnaissance Battalion (Aufkl)", type: "corps" },
          { id: "div-eng", label: "Engineer Battalion (Pio/Eng)", type: "corps" },
          { id: "div-at", label: "Anti-Tank Battalion (AT/Panzerjäger)", type: "corps" },
          { id: "div-flak", label: "Anti-Aircraft (Flak/AA)", type: "corps" },
          { id: "div-sig", label: "Signal Battalion", type: "corps" },
        ]
      },
    ]
  },
];

type Tab = "allied" | "german" | "lower";

export function OOBModal({ data, onClose }: OOBModalProps) {
  const [side, setSide] = useState<Tab>("allied");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const currentNodes = side === "lower" ? lowerUnitsTree : data[side].children;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-12"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-stone-300 bg-white p-4 shadow-2xl dark:border-stone-600 dark:bg-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Order of Battle
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Side toggle */}
        <div className="mb-4 flex gap-1 rounded-lg bg-stone-200 p-1 dark:bg-stone-700">
          {([
            { key: "allied" as Tab, label: data.allied.label },
            { key: "german" as Tab, label: data.german.label },
            { key: "lower" as Tab, label: "Unit Structure" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSide(tab.key)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                side === tab.key
                  ? "bg-white text-stone-900 shadow dark:bg-stone-600 dark:text-stone-100"
                  : "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mb-3 flex flex-wrap gap-2 text-[10px]">
          <span className="rounded bg-amber-500 px-1.5 py-0.5 font-bold text-white">AG</span>
          <span className="text-stone-500 dark:text-stone-400">Army Group</span>
          <span className="rounded bg-blue-500 px-1.5 py-0.5 font-bold text-white">Army</span>
          <span className="text-stone-500 dark:text-stone-400">Army</span>
          <span className="rounded bg-emerald-600 px-1.5 py-0.5 font-bold text-white">Corps</span>
          <span className="text-stone-500 dark:text-stone-400">Corps</span>
          <span className="rounded bg-stone-500 px-1.5 py-0.5 font-bold text-white">Div</span>
          <span className="text-stone-500 dark:text-stone-400">Division</span>
        </div>

        {/* Description for lower units tab */}
        {side === "lower" && (
          <p className="mb-3 text-xs text-stone-500 dark:text-stone-400 italic">
            Generic military organizational structure below Division level. Colors reused for visual hierarchy — not related to the OOB tabs.
          </p>
        )}

        {/* Tree */}
        <OOBTree nodes={currentNodes} />
      </div>
    </div>,
    document.body
  );
}
