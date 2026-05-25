import { useState, type ReactNode } from "react";

/**
 * Shared collapsible wrapper for AI Coach content. Collapsed by default.
 * Click the emerald "Coach" header to expand. If both `short` and `long`
 * children are provided, displays `short` first with a "Show more" link
 * that swaps to `long`; "Show less" returns to `short`.
 *
 * If only one of `short` / `long` is provided, the toggle is hidden.
 * Backward compat: passing children (legacy single-version usage) still
 * works.
 */
export function CollapsibleCoach({
  short,
  long,
  children,
  className = "mb-4",
}: {
  short?: ReactNode;
  long?: ReactNode;
  /** Legacy single-version content; ignored if `short` or `long` is provided. */
  children?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [verbose, setVerbose] = useState(false);

  // Choose what to render in the body. Priority: short → long → children (legacy).
  const hasShort = short !== undefined && short !== null && short !== "";
  const hasLong = long !== undefined && long !== null && long !== "";
  const body = hasShort && !verbose ? short : hasLong ? long : children;
  const canToggleVerbose = hasShort && hasLong;

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
      {open && (
        <div className="px-3 py-2 text-sm leading-relaxed">
          {body}
          {canToggleVerbose && (
            <button
              type="button"
              onClick={() => setVerbose((v) => !v)}
              className="mt-2 inline-block text-xs font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
            >
              {verbose ? "← Show less" : "Show more →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
