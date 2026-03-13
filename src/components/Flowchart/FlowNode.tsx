import { Handle, Position, type NodeProps } from "@xyflow/react";

export type FlowNodeData = {
  label: string;
  ruleRef?: string;
  drillTo?: string; // flowchart level id to navigate to
  variant?: "default" | "start-end" | "phasing" | "non-phasing" | "logistics";
};

const variantStyles: Record<string, string> = {
  default:
    "bg-stone-800 border-stone-600 text-stone-100",
  "start-end":
    "bg-amber-600 border-amber-500 text-white",
  phasing:
    "bg-green-700 border-green-600 text-white",
  "non-phasing":
    "bg-red-700 border-red-600 text-white",
  logistics:
    "bg-purple-700 border-purple-600 text-white",
};

export function FlowNode({ data }: NodeProps) {
  const d = data as FlowNodeData;
  const variant = d.variant ?? "default";
  const hasDrill = !!d.drillTo;
  const hasInfo = !!d.ruleRef;

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (d.ruleRef) {
      window.dispatchEvent(
        new CustomEvent("flownode-info", { detail: { ruleRef: d.ruleRef } })
      );
    }
  };

  return (
    <div
      className={`relative rounded-lg border-2 px-4 py-2 text-center text-sm shadow-md transition-all ${
        variantStyles[variant]
      } ${hasDrill ? "cursor-pointer ring-2 ring-amber-400/40 hover:ring-amber-400" : ""}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-stone-500 !w-2 !h-2" />

      {/* Info button */}
      {hasInfo && (
        <button
          onClick={handleInfoClick}
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-stone-600 text-[10px] font-bold text-stone-200 shadow hover:bg-blue-600 hover:text-white transition-colors"
          title="Show details"
        >
          i
        </button>
      )}

      <div className="font-medium leading-tight">{d.label}</div>
      {d.ruleRef && (
        <div className="mt-0.5 text-xs opacity-70">{d.ruleRef}</div>
      )}
      {hasDrill && (
        <div className="mt-1 text-[10px] uppercase tracking-wider opacity-60">
          ▶ click to expand
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-stone-500 !w-2 !h-2" />
    </div>
  );
}
