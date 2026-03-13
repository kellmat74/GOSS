import { Handle, Position, type NodeProps } from "@xyflow/react";

export type DecisionNodeData = {
  label: string;
};

export function DecisionNode({ data }: NodeProps) {
  const d = data as DecisionNodeData;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      <Handle type="target" position={Position.Top} className="!bg-stone-500 !w-2 !h-2" style={{ top: -4 }} />
      <div
        className="absolute flex items-center justify-center bg-blue-600 border-2 border-blue-500 text-white text-xs font-medium text-center shadow-md"
        style={{
          width: 90,
          height: 90,
          transform: "rotate(45deg)",
        }}
      >
        <span style={{ transform: "rotate(-45deg)" }} className="px-1 leading-tight">
          {d.label}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-stone-500 !w-2 !h-2" style={{ bottom: -4 }} />
      {/* Extra handles for Yes/No branches */}
      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        className="!bg-stone-500 !w-2 !h-2"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="no"
        className="!bg-stone-500 !w-2 !h-2"
      />
    </div>
  );
}
