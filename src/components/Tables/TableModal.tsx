import { createPortal } from "react-dom";
import { useTables } from "../../context/TablesContext";
import type { TableLookupDef, TableImageDef } from "../../types/tables";

export function TableModal() {
  const { activeTable, closeTable } = useTables();
  if (!activeTable) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-150"
      onClick={(e) => { if (e.target === e.currentTarget) closeTable(); }}
    >
      <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3 dark:border-stone-700">
          <div className="flex items-center gap-2">
            {activeTable.ruleRef && (
              <span className="rounded bg-accent-500/20 px-2 py-0.5 font-mono text-xs text-accent-700 dark:text-accent-400">
                §{activeTable.ruleRef}
              </span>
            )}
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {activeTable.title}
            </h2>
            <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-500 dark:bg-stone-700 dark:text-stone-400">
              {activeTable.scope === "series" ? "Series" : "Module"}
            </span>
          </div>
          <button
            onClick={closeTable}
            className="rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTable.type === "lookup" && <LookupTable table={activeTable} />}
          {activeTable.type === "image" && <ImageTable table={activeTable} />}
        </div>
      </div>
    </div>,
    document.body
  );
}

function LookupTable({ table }: { table: TableLookupDef }) {
  return (
    <div className="space-y-5">
      {/* Die roll / result table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-stone-200 dark:border-stone-700">
            <th className="py-2 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Die Roll
            </th>
            <th className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-stone-100 dark:border-stone-700/50 last:border-0"
            >
              <td className="py-2.5 pr-6 font-mono text-sm font-semibold text-stone-800 dark:text-stone-200">
                {row.roll}
              </td>
              <td className="py-2.5 text-sm text-stone-700 dark:text-stone-300">
                {row.result}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DRM groups */}
      {table.drmGroups && table.drmGroups.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
            Die Roll Modifiers
          </h3>
          <div className="space-y-3">
            {table.drmGroups.map((group, i) =>
              group.subGroups ? (
                /* Section header with nested sub-groups */
                <div key={i}>
                  <div className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-700 dark:text-stone-200">
                    {group.label}
                  </div>
                  <div className="space-y-2.5 border-l-2 border-stone-200 pl-3 dark:border-stone-700">
                    {group.subGroups.map((sub, j) => (
                      <div key={j}>
                        {sub.label && (
                          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                            {sub.label}
                          </div>
                        )}
                        <div className="space-y-1">
                          {sub.drms.map((drm, k) => (
                            <DRMRow key={k} mod={drm.mod} condition={drm.condition} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Flat group */
                <div key={i}>
                  {group.label && (
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                      {group.label}
                    </div>
                  )}
                  <div className="space-y-1">
                    {(group.drms ?? []).map((drm, j) => (
                      <DRMRow key={j} mod={drm.mod} condition={drm.condition} />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {table.notes && table.notes.length > 0 && (
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800/50">
          {table.notes.map((note, i) => (
            <p key={i} className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              {note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function DRMRow({ mod, condition }: { mod: string; condition: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-10 shrink-0 font-mono font-bold text-accent-600 dark:text-accent-400">
        {mod}
      </span>
      <span className="text-stone-600 dark:text-stone-300">{condition}</span>
    </div>
  );
}

function ImageTable({ table }: { table: TableImageDef }) {
  return (
    <div className="space-y-3">
      <img
        src={table.src}
        alt={table.title}
        className="w-full rounded border border-stone-200 dark:border-stone-700"
      />
      {table.notes && table.notes.length > 0 && (
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800/50">
          {table.notes.map((note, i) => (
            <p key={i} className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              {note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
