import { useState, type ReactNode } from "react";

/**
 * Shared collapsible wrapper for AI Coach content. Renders the emerald
 * "Coach" header as a button; body is hidden by default and expands on
 * click. Used by SoP phases, action pages, card details, and scenario
 * pages.
 */
export function CollapsibleCoach({
  children,
  className = "mb-4",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`overflow-hidden rounded-md border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-emerald-700 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
      >
        <span>Coach</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-3 py-2 text-sm leading-relaxed">{children}</div>}
    </div>
  );
}
