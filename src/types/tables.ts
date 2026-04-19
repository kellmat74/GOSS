export interface TableDRM {
  mod: string;       // e.g., "−1", "+2", "−/+1"
  condition: string; // description of when this modifier applies
}

export interface TableDRMGroup {
  label?: string;    // optional section heading (e.g., "Inshore Box Only")
  drms: TableDRM[];
}

export interface TableLookupDef {
  id: string;
  title: string;
  ruleRef: string;
  scope: "series" | "module";
  type: "lookup";
  rows: Array<{ roll: string; result: string }>;
  drmGroups?: TableDRMGroup[];
  notes?: string[];
}

export interface TableImageDef {
  id: string;
  title: string;
  ruleRef?: string;
  scope: "series" | "module";
  type: "image";
  src: string;        // path relative to public/, e.g., "assets/nw/tec.png"
  notes?: string[];
}

export type TableDef = TableLookupDef | TableImageDef;
export type TablesFile = Record<string, TableDef>;
