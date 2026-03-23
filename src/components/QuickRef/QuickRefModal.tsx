import { createPortal } from "react-dom";
import { useEffect } from "react";
import { RuleInlineText } from "../RulesReference/RuleInlineText";

interface TableData {
  title?: string;
  ruleRef?: string;
  headers: string[];
  rows: string[][];
  footnotes?: string[];
}

interface QuickRefData {
  title: string;
  ruleRef?: string;
  note?: string;
  notes?: string[];
  headers?: string[];
  rows?: string[][];
  baseLimits?: TableData;
  specialStacking?: { title: string; sections: TableData[] };
  sections?: Record<string, { title: string; ruleRef?: string; description?: string; types?: string[]; items?: string[] }>;
}

interface QuickRefModalProps {
  data: QuickRefData;
  onClose: () => void;
}

function RefTable({ data }: { data: TableData }) {
  return (
    <div className="mb-4">
      {data.title && (
        <h3 className="mb-1 text-sm font-semibold text-accent-600 dark:text-accent-400">
          {data.title}
          {data.ruleRef && <span className="ml-1 text-xs text-stone-400 dark:text-stone-500">§{data.ruleRef}</span>}
        </h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {data.headers.map((h, i) => (
                <th key={i} className="border border-stone-300 bg-stone-200 px-2 py-1.5 text-left text-xs font-semibold text-stone-800 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? "bg-stone-100 dark:bg-stone-800/50" : ""}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-stone-300 px-2 py-1 text-xs text-stone-700 dark:border-stone-600 dark:text-stone-300"><RuleInlineText text={cell} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.footnotes && (
        <div className="mt-1 space-y-0.5 text-xs text-stone-500">
          {data.footnotes.map((fn, i) => <p key={i}>* <RuleInlineText text={fn} /></p>)}
        </div>
      )}
    </div>
  );
}

export function QuickRefModal({ data, onClose }: QuickRefModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-12" onClick={onClose}>
      <div
        className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-stone-300 bg-white p-4 shadow-2xl dark:border-stone-600 dark:bg-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {data.title}
            {data.ruleRef && <span className="ml-2 text-sm font-normal text-stone-400 dark:text-stone-500">§{data.ruleRef}</span>}
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

        {/* Top note */}
        {data.note && <p className="mb-3 text-xs italic text-stone-500 dark:text-stone-400">{data.note}</p>}

        {/* Flat table */}
        {data.headers && data.rows && <RefTable data={{ headers: data.headers, rows: data.rows }} />}

        {/* Stacking: baseLimits + specialStacking */}
        {data.baseLimits && <RefTable data={data.baseLimits} />}
        {data.specialStacking && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-bold text-stone-800 dark:text-stone-200">{data.specialStacking.title}</h3>
            {data.specialStacking.sections.map((sec, i) => (
              <RefTable key={i} data={sec} />
            ))}
          </div>
        )}

        {/* TEC sections */}
        {data.sections && Object.entries(data.sections).map(([key, sec]) => (
          <div key={key} className="mb-4">
            <h3 className="mb-1 text-sm font-semibold text-accent-600 dark:text-accent-400">
              {sec.title}
              {sec.ruleRef && <span className="ml-1 text-xs text-stone-400 dark:text-stone-500">§{sec.ruleRef}</span>}
            </h3>
            {sec.description && <p className="mb-1 text-xs text-stone-600 dark:text-stone-400"><RuleInlineText text={sec.description} /></p>}
            {sec.types && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {sec.types.map((t, i) => (
                  <span key={i} className="rounded bg-stone-200 px-2 py-0.5 text-xs text-stone-700 dark:bg-stone-700 dark:text-stone-300">{t}</span>
                ))}
              </div>
            )}
            {sec.items && (
              <ul className="ml-4 list-disc text-xs text-stone-700 dark:text-stone-300">
                {sec.items.map((item, i) => <li key={i}><RuleInlineText text={item} /></li>)}
              </ul>
            )}
          </div>
        ))}

        {/* Bottom notes */}
        {data.notes && data.notes.length > 0 && (
          <div className="mt-3 space-y-1 rounded bg-stone-100 p-2 text-xs text-stone-600 dark:bg-stone-700/50 dark:text-stone-400">
            <p className="font-semibold text-stone-700 dark:text-stone-300">Notes:</p>
            {data.notes.map((note, i) => <p key={i}>• <RuleInlineText text={note} /></p>)}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
