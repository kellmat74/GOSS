import { useState, useEffect, type ReactNode } from "react";

export interface TabDef {
  key: string;
  label: string;
}

interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
  gameSelector: ReactNode;
  tabs: TabDef[];
  activeTab: string;
  onTabChange: (key: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  title?: string;
  subtitle?: string;
}

export function AppShell({
  sidebar,
  children,
  gameSelector,
  tabs,
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  title = "Wargame Companion",
  subtitle = "",
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close mobile sidebar when tab changes (e.g. clicking a step from another tab)
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 h-full w-72 transform overflow-y-auto border-r border-stone-200 bg-stone-50 transition-transform dark:border-stone-700 dark:bg-stone-800 lg:static ${
          sidebarCollapsed ? "lg:-translate-x-full lg:hidden" : "lg:translate-x-0"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 border-b border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800">
          <h1 className="text-lg font-bold tracking-tight">{title} <span className="text-xs font-normal text-stone-500">v4.2</span></h1>
          {subtitle && (
            <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {subtitle}
            </div>
          )}
        </div>
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center border-b border-stone-200 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-800">
          {/* Left: hamburger + time of day */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // On mobile: toggle overlay sidebar. On desktop: toggle collapse.
                if (window.innerWidth >= 1024) {
                  setSidebarCollapsed((c) => !c);
                } else {
                  setSidebarOpen((o) => !o);
                }
              }}
              className="rounded p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700"
              aria-label="Toggle sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {gameSelector}
          </div>

          {/* Center: tabs */}
          <div className="flex flex-1 items-center justify-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-accent-500 text-white"
                    : "text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right: theme toggle */}
          <button
            onClick={onToggleTheme}
            className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1.7 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </header>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
