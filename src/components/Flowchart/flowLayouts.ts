import type { Node, Edge } from "@xyflow/react";

/**
 * All node positions are manually arranged via the Edit Layout tool.
 * To re-arrange: click "Edit Layout" in the flowchart, drag nodes,
 * then click "Copy Positions" and update the coordinates here.
 */

export type FlowchartDef = {
  id: string;
  title: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  parentId?: string;
  parentLabel?: string;
};

// Helper for straight vertical edge
const straight = (id: string, source: string, target: string): Edge => ({
  id, source, target, type: "straight",
});

// Helper for smoothstep branch edge
const branch = (
  id: string,
  source: string,
  target: string,
  label?: string,
  sourceHandle?: string,
  opts?: Partial<Edge>
): Edge => ({
  id, source, target, type: "smoothstep", label, sourceHandle, ...opts,
});

// ─── Game Turn Overview ───

const gtNodes: Node[] = [
  { id: "START", type: "flowNode", position: { x: 297, y: 111 }, data: { label: "Start Game Turn", variant: "start-end" } },
  { id: "AM_CHECK1", type: "decisionNode", position: { x: 309, y: 191 }, data: { label: "AM Turn?" } },
  { id: "AIR", type: "flowNode", position: { x: 569, y: 306 }, data: { label: "Joint Air Allocation", ruleRef: "3.3.1a" } },
  { id: "WEATHER", type: "flowNode", position: { x: 283, y: 420 }, data: { label: "Joint Weather Phase", ruleRef: "3.3.1b" } },
  { id: "AM_CHECK2", type: "decisionNode", position: { x: 309, y: 519 }, data: { label: "AM Turn?" } },
  { id: "COMMAND", type: "flowNode", position: { x: 557, y: 604 }, data: { label: "Joint Command Phase", ruleRef: "3.3.1c" } },
  { id: "LOGISTICS", type: "flowNode", position: { x: 562, y: 708 }, data: { label: "Joint Logistics Phase", ruleRef: "3.3.1d", drillTo: "transport-logistics", variant: "logistics" } },
  { id: "FUEL", type: "flowNode", position: { x: 250, y: 842 }, data: { label: "Joint Fuel Value\nDetermination", ruleRef: "3.3.1e", variant: "logistics" } },
  { id: "ALLIED", type: "flowNode", position: { x: 294, y: 940 }, data: { label: "Allied Player Turn", ruleRef: "3.3.2", drillTo: "player-turn", variant: "phasing" } },
  { id: "AXIS", type: "flowNode", position: { x: 297, y: 1061 }, data: { label: "Axis Player Turn", ruleRef: "3.3.3", drillTo: "player-turn", variant: "non-phasing" } },
  { id: "UPDATE", type: "flowNode", position: { x: 286, y: 1182 }, data: { label: "Update GT Indicator", ruleRef: "3.3.4" } },
  { id: "END_GT", type: "flowNode", position: { x: 302, y: 1280 }, data: { label: "End Game Turn", variant: "start-end" } },
];

const gtEdges: Edge[] = [
  straight("e-start-am1", "START", "AM_CHECK1"),
  branch("e-am1-air", "AM_CHECK1", "AIR", "Yes", "yes"),
  branch("e-am1-weather", "AM_CHECK1", "WEATHER", "No"),
  branch("e-air-weather", "AIR", "WEATHER"),
  straight("e-weather-am2", "WEATHER", "AM_CHECK2"),
  branch("e-am2-command", "AM_CHECK2", "COMMAND", "Yes", "yes"),
  branch("e-am2-fuel", "AM_CHECK2", "FUEL", "No"),
  straight("e-command-logistics", "COMMAND", "LOGISTICS"),
  branch("e-logistics-fuel", "LOGISTICS", "FUEL"),
  straight("e-fuel-allied", "FUEL", "ALLIED"),
  straight("e-allied-axis", "ALLIED", "AXIS"),
  straight("e-axis-update", "AXIS", "UPDATE"),
  straight("e-update-end", "UPDATE", "END_GT"),
];

// ─── Player Turn Detail ───

const ptNodes: Node[] = [
  { id: "START_PT", type: "flowNode", position: { x: 257, y: -75 }, data: { label: "Start Player Turn", variant: "start-end" } },
  { id: "MODE", type: "flowNode", position: { x: 245, y: -1 }, data: { label: "Mode Determination", ruleRef: "3.3.2a" } },
  { id: "CONSTRUCT", type: "flowNode", position: { x: 248, y: 105 }, data: { label: "Construction Phase", ruleRef: "3.3.2b" } },
  { id: "CR", type: "flowNode", position: { x: 217, y: 198 }, data: { label: "Combat Reserve\nDesignation", ruleRef: "5.8.0" } },
  { id: "MOVEMENT", type: "flowNode", position: { x: 247, y: 298 }, data: { label: "Movement Segment", ruleRef: "7.2.2" } },
  { id: "QUICK", type: "flowNode", position: { x: 249, y: 405 }, data: { label: "Quick Construction", ruleRef: "17.3.3" } },
  { id: "ENEMY_EXPLOIT", type: "flowNode", position: { x: 219, y: 520 }, data: { label: "Inactive Player\nExploit Phase", ruleRef: "3.3.2d", variant: "non-phasing" } },
  { id: "ATK_DESIG", type: "flowNode", position: { x: 220, y: 620 }, data: { label: "Tactical Assault\nDesignation", ruleRef: "10.2.0" } },
  { id: "REPLACE", type: "flowNode", position: { x: 238, y: 720 }, data: { label: "Replacement Segment", ruleRef: "22.5.0" } },
  { id: "FS", type: "flowNode", position: { x: 240, y: 822 }, data: { label: "Fire Support Segment", ruleRef: "11.0", drillTo: "fire-support" } },
  { id: "ATK_ADJ", type: "flowNode", position: { x: 222, y: 940 }, data: { label: "Attacker Status\nAdjustment", ruleRef: "12.0" } },
  { id: "GA", type: "flowNode", position: { x: 231, y: 1046 }, data: { label: "Ground Assault\nSegment", ruleRef: "13.0", drillTo: "ground-assault" } },
  { id: "FRIENDLY_EXPLOIT", type: "flowNode", position: { x: 224, y: 1161 }, data: { label: "Active Player\nExploit Phase", ruleRef: "3.3.2f", variant: "phasing" } },
  { id: "AIR_RESUPPLY", type: "flowNode", position: { x: 218, y: 1256 }, data: { label: "Air Resupply\n(AM & PM only)", ruleRef: "20.5.0" } },
  { id: "SUPPLY_DET", type: "flowNode", position: { x: 241, y: 1360 }, data: { label: "Supply Determination", ruleRef: "15.0" } },
  { id: "AMMO_REP", type: "flowNode", position: { x: 241, y: 1458 }, data: { label: "Ammo Replenishment", ruleRef: "16.3.7" } },
  { id: "FATIGUE", type: "flowNode", position: { x: 256, y: 1561 }, data: { label: "Fatigue Recovery", ruleRef: "14.3.0" } },
  { id: "DELAY", type: "flowNode", position: { x: 239, y: 1661 }, data: { label: "Delay Marker Removal", ruleRef: "7.13.3" } },
  { id: "END_PT", type: "flowNode", position: { x: 261, y: 1760 }, data: { label: "End Player Turn", variant: "start-end", drillTo: "game-turn" } },
];

const ptEdges: Edge[] = [
  straight("pt-0", "START_PT", "MODE"),
  straight("pt-1", "MODE", "CONSTRUCT"),
  // Movement phase: Construct → CR → Movement → Quick → Enemy Exploit
  branch("pt-2", "CONSTRUCT", "CR"),
  branch("pt-2b", "CR", "MOVEMENT"),
  branch("pt-2c", "MOVEMENT", "QUICK"),
  branch("pt-3", "QUICK", "ENEMY_EXPLOIT"),
  // Combat phase: straight chain
  straight("pt-4", "ENEMY_EXPLOIT", "ATK_DESIG"),
  straight("pt-5", "ATK_DESIG", "REPLACE"),
  straight("pt-6", "REPLACE", "FS"),
  straight("pt-7", "FS", "ATK_ADJ"),
  straight("pt-8", "ATK_ADJ", "GA"),
  straight("pt-9", "GA", "FRIENDLY_EXPLOIT"),
  // Admin phase: straight chain
  straight("pt-10", "FRIENDLY_EXPLOIT", "AIR_RESUPPLY"),
  straight("pt-11", "AIR_RESUPPLY", "SUPPLY_DET"),
  straight("pt-12", "SUPPLY_DET", "AMMO_REP"),
  straight("pt-13", "AMMO_REP", "FATIGUE"),
  straight("pt-14", "FATIGUE", "DELAY"),
  straight("pt-15", "DELAY", "END_PT"),
];

// ─── Fire Support Sub-Process ───

const fsNodes: Node[] = [
  { id: "START_FS", type: "flowNode", position: { x: 239, y: 9 }, data: { label: "Fire Support Segment", ruleRef: "11.0", variant: "start-end" } },
  { id: "OFF_AIR", type: "flowNode", position: { x: 185, y: 113 }, data: { label: "Offensive Air Support\n(Phasing Player)", ruleRef: "20.2.0", variant: "phasing" } },
  { id: "DEF_ARTY", type: "flowNode", position: { x: 130, y: 220 }, data: { label: "Defensive Artillery", ruleRef: "11.0", variant: "non-phasing" } },
  { id: "DEF_AIR", type: "flowNode", position: { x: 349, y: 220 }, data: { label: "Defensive GS\nand/or NGS", ruleRef: "20.2.0", variant: "non-phasing" } },
  { id: "OFF_ART", type: "flowNode", position: { x: 130, y: 330 }, data: { label: "Offensive Artillery", ruleRef: "11.0", variant: "phasing" } },
  { id: "OFF_NAVAL", type: "flowNode", position: { x: 385, y: 330 }, data: { label: "Offensive NGS", ruleRef: "11.0", variant: "phasing" } },
  { id: "END_FS", type: "flowNode", position: { x: 258, y: 445 }, data: { label: "End FS Segment", variant: "start-end", drillTo: "player-turn" } },
];

const fsEdges: Edge[] = [
  straight("fs-0", "START_FS", "OFF_AIR"),
  branch("fs-1", "OFF_AIR", "DEF_ARTY"),
  branch("fs-1b", "OFF_AIR", "DEF_AIR"),
  straight("fs-2", "DEF_ARTY", "OFF_ART"),
  straight("fs-2b", "DEF_AIR", "OFF_NAVAL"),
  branch("fs-3", "OFF_ART", "END_FS"),
  branch("fs-3b", "OFF_NAVAL", "END_FS"),
];

// ─── Ground Assault Sub-Process ───

const gaNodes: Node[] = [
  { id: "START_GA", type: "flowNode", position: { x: 193, y: -115 }, data: { label: "GA Segment Start", ruleRef: "13.0", variant: "start-end" } },
  { id: "LOOP_CHECK", type: "decisionNode", position: { x: 212, y: -10 }, data: { label: "More GAs?" } },
  { id: "PICK", type: "flowNode", position: { x: 510, y: 79 }, data: { label: "Pick next GA" } },
  { id: "END_GA", type: "flowNode", position: { x: 37, y: 97 }, data: { label: "End GA Segment", variant: "start-end", drillTo: "player-turn" } },
  { id: "GA1", type: "flowNode", position: { x: 427, y: 165 }, data: { label: "1. Identify defending hex\n& terrain line", ruleRef: "13.3.0" } },
  { id: "GA2", type: "flowNode", position: { x: 464, y: 261 }, data: { label: "2. Identify attacking hexes", ruleRef: "13.4.0" } },
  { id: "GA3", type: "flowNode", position: { x: 473, y: 362 }, data: { label: "3. Determine unit status", ruleRef: "13.5.0" } },
  { id: "GA4", type: "flowNode", position: { x: 494, y: 462 }, data: { label: "4. Determine GAV", ruleRef: "13.6.0" } },
  { id: "GA5", type: "flowNode", position: { x: 464, y: 558 }, data: { label: "5. Determine column shifts", ruleRef: "13.7.0" } },
  { id: "GA6", type: "flowNode", position: { x: 492, y: 661 }, data: { label: "6. Determine DRM", ruleRef: "13.8.0" } },
  { id: "GA7", type: "flowNode", position: { x: 478, y: 759 }, data: { label: "7. Determine GA result", ruleRef: "13.9.0" } },
  { id: "GA8", type: "flowNode", position: { x: 489, y: 859 }, data: { label: "8. Apply GA results", ruleRef: "13.10.0" } },
];

const gaEdges: Edge[] = [
  straight("ga-0", "START_GA", "LOOP_CHECK"),
  branch("ga-1", "LOOP_CHECK", "PICK", "Yes", "yes"),
  branch("ga-1b", "LOOP_CHECK", "END_GA", "No", "no"),
  branch("ga-2", "PICK", "GA1"),
  straight("ga-3", "GA1", "GA2"),
  straight("ga-4", "GA2", "GA3"),
  straight("ga-5", "GA3", "GA4"),
  straight("ga-6", "GA4", "GA5"),
  straight("ga-7", "GA5", "GA6"),
  straight("ga-8", "GA6", "GA7"),
  straight("ga-9", "GA7", "GA8"),
  branch("ga-loop", "GA8", "LOOP_CHECK", undefined, undefined, { style: { strokeDasharray: "5 5" } }),
];

// ─── Transport & Logistics Sub-Process ───

const tlNodes: Node[] = [
  { id: "START_TL", type: "flowNode", position: { x: 228, y: 3 }, data: { label: "Joint Logistics Phase\n(AM only)", ruleRef: "3.3.1d", variant: "start-end" } },
  { id: "ARMY_LOOP", type: "decisionNode", position: { x: 290, y: 110 }, data: { label: "More\nArmies?" } },
  { id: "PICK_ARMY", type: "flowNode", position: { x: 516, y: 203 }, data: { label: "Select next Army" } },
  { id: "REPS", type: "flowNode", position: { x: 58, y: 199 }, data: { label: "Replacement Point\nSegment", ruleRef: "22.0" } },
  { id: "TRUCK", type: "flowNode", position: { x: 494, y: 281 }, data: { label: "Truck Point Assignment", ruleRef: "16.1.2", variant: "logistics" } },
  { id: "SI", type: "flowNode", position: { x: 510, y: 379 }, data: { label: "Supply Interdiction", ruleRef: "20.4.0", variant: "logistics" } },
  { id: "AMMO", type: "flowNode", position: { x: 522, y: 478 }, data: { label: "Ammo Delivery", ruleRef: "16.3.0", variant: "logistics" } },
  { id: "FUEL_DEL", type: "flowNode", position: { x: 529, y: 577 }, data: { label: "Fuel Delivery", ruleRef: "16.4.0", variant: "logistics" } },
  { id: "DEPOT", type: "flowNode", position: { x: 515, y: 677 }, data: { label: "Depot Placement", ruleRef: "15.8.0", variant: "logistics" } },
  { id: "END_TL", type: "flowNode", position: { x: 86, y: 298 }, data: { label: "End Logistics Phase", variant: "start-end", drillTo: "game-turn" } },
];

const tlEdges: Edge[] = [
  straight("tl-0", "START_TL", "ARMY_LOOP"),
  branch("tl-1", "ARMY_LOOP", "PICK_ARMY", "Yes", "yes"),
  branch("tl-1b", "ARMY_LOOP", "REPS", "No", "no"),
  branch("tl-2", "PICK_ARMY", "TRUCK"),
  straight("tl-3", "TRUCK", "SI"),
  straight("tl-4", "SI", "AMMO"),
  straight("tl-5", "AMMO", "FUEL_DEL"),
  straight("tl-6", "FUEL_DEL", "DEPOT"),
  branch("tl-loop", "DEPOT", "ARMY_LOOP", undefined, undefined, { style: { strokeDasharray: "5 5" } }),
  branch("tl-8", "REPS", "END_TL"),
];

// ─── Export all flowchart definitions ───

export const flowchartDefs: FlowchartDef[] = [
  {
    id: "game-turn",
    title: "Game Turn Overview",
    description: "Top-level flow of a single Game Turn. Blue diamonds indicate AM-only conditional gates. Joint phases (3.3.1a–e) precede both Player Turns.",
    nodes: gtNodes,
    edges: gtEdges,
  },
  {
    id: "player-turn",
    title: "Player Turn Detail",
    description: "Phases within each Player Turn (Allied 3.3.2 then Axis 3.3.3, identical structure).",
    nodes: ptNodes,
    edges: ptEdges,
    parentId: "game-turn",
    parentLabel: "Game Turn Overview",
  },
  {
    id: "fire-support",
    title: "Fire Support Sub-Process",
    description: "The Fire Support Segment within the Combat Phase. Offensive Air first, then Defensive, then Offensive Art/Naval.",
    nodes: fsNodes,
    edges: fsEdges,
    parentId: "player-turn",
    parentLabel: "Player Turn Detail",
  },
  {
    id: "ground-assault",
    title: "Ground Assault Sub-Process",
    description: "The 8-step Ground Assault resolution per the Player Aid. Loops for each GA being conducted.",
    nodes: gaNodes,
    edges: gaEdges,
    parentId: "player-turn",
    parentLabel: "Player Turn Detail",
  },
  {
    id: "transport-logistics",
    title: "Joint Logistics Sub-Process",
    description: "AM-only phase (3.3.1d). Segments loop for each Army, then Replacement Points for both sides.",
    nodes: tlNodes,
    edges: tlEdges,
    parentId: "game-turn",
    parentLabel: "Game Turn Overview",
  },
];

export function getFlowchartDef(id: string): FlowchartDef | undefined {
  return flowchartDefs.find((d) => d.id === id);
}
