import { useState, type ReactNode } from "react";

interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
  turnInfo: ReactNode;
}

export function AppShell({ sidebar, children, turnInfo }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 h-full w-72 transform overflow-y-auto border-r border-stone-200 bg-stone-100 transition-transform dark:border-stone-700 dark:bg-stone-800 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 border-b border-stone-200 bg-stone-100 p-3 dark:border-stone-700 dark:bg-stone-800">
          <h1 className="text-lg font-bold tracking-tight">GOSS Assistant</h1>
          <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Wacht am Rhein
          </div>
        </div>
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-2 dark:border-stone-700 dark:bg-stone-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {turnInfo}
        </header>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
