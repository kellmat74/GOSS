export interface TableDRM {
  mod: string;       // e.g., "−1", "+2", "−/+1"
  condition: string; // description of when this modifier applies
}

export interface TableDRMSubGroup {
  label?: string;
  drms: TableDRM[];
}

export interface TableDRMGroup {
  label?: string;       // section heading
  drms?: TableDRM[];    // present when this is a leaf group
  subGroups?: TableDRMSubGroup[];  // present when label is a bold header with sub-sections
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
