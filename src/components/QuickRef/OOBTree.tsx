import { useState } from "react";

export interface OOBNode {
  id: string;
  label: string;
  type: string;
  children?: OOBNode[];
}

const typeStyles: Record<string, { bg: string; text: string; badge: string }> = {
  "army-group": {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-900 dark:text-amber-200",
    badge: "bg-amber-500 text-white",
  },
  army: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-900 dark:text-blue-200",
    badge: "bg-blue-500 text-white",
  },
  corps: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-900 dark:text-emerald-200",
    badge: "bg-emerald-600 text-white",
  },
  division: {
    bg: "bg-stone-100 dark:bg-stone-700/50",
    text: "text-stone-800 dark:text-stone-200",
    badge: "bg-stone-500 text-white",
  },
  regiment: {
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-900 dark:text-violet-200",
    badge: "bg-violet-500 text-white",
  },
  battalion: {
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    text: "text-cyan-900 dark:text-cyan-200",
    badge: "bg-cyan-600 text-white",
  },
  company: {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-900 dark:text-rose-200",
    badge: "bg-rose-500 text-white",
  },
  platoon: {
    bg: "bg-stone-100 dark:bg-stone-700/50",
    text: "text-stone-800 dark:text-stone-200",
    badge: "bg-stone-400 text-white dark:bg-stone-500",
  },
};


const typeLabels: Record<string, string> = {
  "army-group": "AG",
  army: "Army",
  corps: "Corps",
  division: "Div",
  regiment: "Rgt",
  battalion: "Bn",
  company: "Co",
  platoon: "Plt",
};

function TreeNode({ node, depth = 0 }: { node: OOBNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const style = typeStyles[node.type] || typeStyles.division;

  return (
    <div className={depth > 0 ? "ml-4 border-l border-stone-300 pl-3 dark:border-stone-600" : ""}>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`mb-1 flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${style.bg} ${style.text} ${hasChildren ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
      >
        {hasChildren && (
          <span className="text-xs text-stone-400">
            {expanded ? "▼" : "▶"}
          </span>
        )}
        {!hasChildren && <span className="ml-3.5" />}
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${style.badge}`}>
          {typeLabels[node.type]}
        </span>
        <span className="font-medium">{node.label}</span>
      </button>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OOBTree({ nodes }: { nodes: OOBNode[] }) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} />
      ))}
    </div>
  );
}
