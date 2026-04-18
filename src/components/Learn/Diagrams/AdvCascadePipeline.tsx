/**
 * ADV Cascade Pipeline — simple vertical flow showing how Army ADV
 * becomes per-corps ADV through the steps of the Fuel Delivery Segment.
 *
 * Design goals:
 * - Readable on iPad portrait (narrow)
 * - Dark-mode friendly (uses currentColor + tailwind classes)
 * - Captures the 3 "levels" (Army → Corps → Formation) + the 5 adjustments
 */
export function AdvCascadePipeline() {
  // Rendered as a grid of labeled boxes with connector lines.
  // Avoiding raw SVG <text> since dark/light mode colors are easier via
  // CSS classes. Uses absolutely positioned flex boxes.
  return (
    <div className="my-4 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/50">
      <div className="space-y-2">
        {/* Source: GTRT */}
        <Stage
          level="source"
          title="Game Turn Record Track"
          sub="Base Army ADV for this GD"
        />

        <Arrow label="Step 4" note="Adjust for # of corps supported (−1 if >3)" />

        <Stage
          level="army"
          title="Army ADV"
          sub="After corps-count adjustment"
        />

        <Arrow label="Step 5" note="Roll 1d10 for delivery — applies to whole army" />

        <Stage
          level="army"
          title="Delivered Army ADV"
          sub="After the roll. Bad roll = all corps suffer"
          variant="dashed"
        />

        <Arrow label="Step 6" note="Pass to each supported corps" />

        <Stage
          level="corps"
          title="Corps ADV (per corps)"
          sub="Each corps inherits the adjusted Army ADV"
          splitInto={3}
        />

        <Arrow label="Step 7" note="Adjust per corps for # of formations supported" />

        <Stage
          level="corps"
          title="Final Corps ADV"
          sub="What the corps actually has to distribute"
          splitInto={3}
          variant="outlined"
        />

        <Arrow label="Step 8" note="Optional: spend AmP to boost individual corps" optional />

        <Stage
          level="formation"
          title="Formation Deliveries"
          sub="Each formation gets its share of its corps's ADV"
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------

type StageLevel = "source" | "army" | "corps" | "formation";
type StageVariant = "solid" | "dashed" | "outlined";

function Stage({
  level,
  title,
  sub,
  splitInto,
  variant = "solid",
}: {
  level: StageLevel;
  title: string;
  sub: string;
  splitInto?: number;
  variant?: StageVariant;
}) {
  const levelStyles: Record<StageLevel, string> = {
    source: "bg-stone-100 border-stone-300 dark:bg-stone-700 dark:border-stone-600",
    army: "bg-accent-500/10 border-accent-500 dark:bg-accent-400/10",
    corps: "bg-blue-500/10 border-blue-500 dark:bg-blue-400/10",
    formation: "bg-emerald-500/10 border-emerald-500 dark:bg-emerald-400/10",
  };

  const variantStyles: Record<StageVariant, string> = {
    solid: "border-2",
    dashed: "border-2 border-dashed",
    outlined: "border-2 border-double",
  };

  const labelPill: Record<StageLevel, string> = {
    source: "bg-stone-500 text-white",
    army: "bg-accent-600 text-white",
    corps: "bg-blue-600 text-white",
    formation: "bg-emerald-600 text-white",
  };

  const labelText: Record<StageLevel, string> = {
    source: "Source",
    army: "Army Level",
    corps: "Corps Level",
    formation: "Formation Level",
  };

  if (splitInto && splitInto > 1) {
    return (
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${splitInto}, minmax(0, 1fr))` }}>
        {Array.from({ length: splitInto }).map((_, i) => (
          <div
            key={i}
            className={`rounded-md px-2 py-1.5 text-center ${levelStyles[level]} ${variantStyles[variant]}`}
          >
            <div className="flex items-center justify-center gap-1">
              <span className={`rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide ${labelPill[level]}`}>
                {labelText[level]}
              </span>
            </div>
            <div className="mt-1 text-xs font-semibold text-stone-800 dark:text-stone-100">
              {i === 0 ? title : `Corps ${i + 1}`}
            </div>
            {i === 0 && (
              <div className="mt-0.5 text-[10px] text-stone-500 dark:text-stone-400">
                {sub}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`rounded-md px-3 py-2 ${levelStyles[level]} ${variantStyles[variant]}`}>
      <div className="flex items-center gap-1.5">
        <span className={`rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide ${labelPill[level]}`}>
          {labelText[level]}
        </span>
        <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
          {title}
        </span>
      </div>
      <div className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
        {sub}
      </div>
    </div>
  );
}

function Arrow({
  label,
  note,
  optional,
}: {
  label: string;
  note: string;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 pl-4">
      {/* Vertical line + arrowhead */}
      <div className="flex flex-col items-center">
        <div className={`h-4 w-0.5 ${optional ? "bg-stone-300 dark:bg-stone-600" : "bg-stone-400 dark:bg-stone-500"}`} />
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          className={optional ? "text-stone-300 dark:text-stone-600" : "text-stone-400 dark:text-stone-500"}
        >
          <polygon points="0,0 10,0 5,6" fill="currentColor" />
        </svg>
      </div>
      {/* Step label */}
      <div className="flex items-baseline gap-2">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
            optional
              ? "bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-400"
              : "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900"
          }`}
        >
          {label}
        </span>
        <span className="text-[11px] italic text-stone-500 dark:text-stone-400">
          {note}
        </span>
      </div>
    </div>
  );
}
