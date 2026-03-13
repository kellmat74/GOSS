import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  type NodeMouseHandler,
  type NodeTypes,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FlowNode } from "./FlowNode";
import { DecisionNode } from "./DecisionNode";
import type { FlowchartDef } from "./flowLayouts";
import type { FlowNodeData } from "./FlowNode";

const nodeTypes: NodeTypes = {
  flowNode: FlowNode,
  decisionNode: DecisionNode,
};

const defaultEdgeOptions = {
  style: { stroke: "#a8a29e", strokeWidth: 2 },
  labelStyle: { fill: "#a8a29e", fontSize: 12 },
  labelBgStyle: { fill: "#1c1917", fillOpacity: 0.8 },
};

interface ReactFlowChartProps {
  def: FlowchartDef;
  onDrillDown: (targetId: string) => void;
}

export function ReactFlowChart({ def, onDrillDown }: ReactFlowChartProps) {
  const [nodes, , onNodesChange] = useNodesState(def.nodes);
  const [editMode, setEditMode] = useState(false);

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      if (editMode) return; // don't drill down while editing
      // Don't drill down if user clicked a button (e.g., RuleRefBadge or info button)
      const target = event.target as HTMLElement;
      if (target.closest("button")) return;
      const data = node.data as FlowNodeData;
      if (data.drillTo) {
        onDrillDown(data.drillTo);
      }
    },
    [onDrillDown, editMode]
  );

  const exportPositions = useCallback(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n: Node) => {
      positions[n.id] = {
        x: Math.round(n.position.x),
        y: Math.round(n.position.y),
      };
    });
    const json = JSON.stringify(positions, null, 2);
    console.log(`--- ${def.id} positions ---`);
    console.log(json);
    // Download as file
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${def.id}-positions.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, def.id]);

  const fitViewOptions = useMemo(() => ({ padding: 0.2 }), []);

  return (
    <div className="h-[600px] rounded-lg border border-stone-700 bg-stone-900">
      <ReactFlow
        nodes={nodes}
        edges={def.edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={editMode ? onNodesChange : undefined}
        onNodeClick={onNodeClick}
        nodesDraggable={editMode}
        fitView
        fitViewOptions={fitViewOptions}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="[&_.react-flow__node]:!outline-none"
      >
        <Background color="#44403c" gap={20} />
        <Controls
          className="!bg-stone-800 !border-stone-700 !shadow-lg [&_button]:!bg-stone-700 [&_button]:!border-stone-600 [&_button]:!text-stone-300 [&_button:hover]:!bg-stone-600"
        />
        <Panel position="top-right">
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode((e) => !e)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                editMode
                  ? "bg-amber-600 text-white"
                  : "bg-stone-700 text-stone-300 hover:bg-stone-600"
              }`}
            >
              {editMode ? "✏️ Edit Mode ON" : "Edit Layout"}
            </button>
            {editMode && (
              <button
                onClick={exportPositions}
                className="rounded bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600"
              >
                📋 Copy Positions
              </button>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
