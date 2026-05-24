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
  ruleRef?: string;
  scope: "series" | "module";
  type: "lookup";
  rollLabel?: string;    // default "Die Roll"
  resultLabel?: string;  // default "Result"
  rows: Array<{ roll: string; result: string }>;
  drmGroups?: TableDRMGroup[];
  notes?: string[];
}

export interface TableMatrixDef {
  id: string;
  title: string;
  ruleRef?: string;
  scope: "series" | "module";
  type: "matrix";
  rollLabel?: string;   // default "Die Roll"
  columns: string[];    // column headers (left to right)
  rows: Array<{ roll: string; values: string[] }>;
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

/**
 * A compiled view of all H2 sections in a single play-aid markdown file
 * (BWN-specific). Content is referenced from play-aid-blocks.json by
 * `paNumber` — no duplication. The TableModal looks up every block with
 * that paNumber and concatenates them in the order they appear in the
 * source file (insertion order in the JSON, which the merge script
 * preserves).
 */
export interface TablePlayAidPageDef {
  id: string;
  title: string;
  ruleRef?: string;
  scope: "series" | "module";
  type: "playaid-page";
  /** Play-aid page number, e.g. 3 = "03-attacks-on-and-by-submarines.md" */
  paNumber: number;
  notes?: string[];
}

export type TableDef =
  | TableLookupDef
  | TableMatrixDef
  | TableImageDef
  | TablePlayAidPageDef;
export type TablesFile = Record<string, TableDef>;
