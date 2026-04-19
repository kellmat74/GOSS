import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { TableDef } from "../types/tables";

interface TablesContextValue {
  tables: Record<string, TableDef>;
  openTable: (id: string) => void;
  closeTable: () => void;
  activeTable: TableDef | null;
}

const TablesContext = createContext<TablesContextValue | null>(null);

export function useTables() {
  const ctx = useContext(TablesContext);
  if (!ctx) throw new Error("useTables must be used within TablesProvider");
  return ctx;
}

interface TablesProviderProps {
  tables: Record<string, TableDef>;
  children: ReactNode;
}

export function TablesProvider({ tables, children }: TablesProviderProps) {
  const [activeTable, setActiveTable] = useState<TableDef | null>(null);

  const openTable = useCallback(
    (id: string) => {
      const table = tables[id];
      if (table) setActiveTable(table);
    },
    [tables]
  );

  const closeTable = useCallback(() => setActiveTable(null), []);

  const value = useMemo(
    () => ({ tables, openTable, closeTable, activeTable }),
    [tables, openTable, closeTable, activeTable]
  );

  return <TablesContext.Provider value={value}>{children}</TablesContext.Provider>;
}
