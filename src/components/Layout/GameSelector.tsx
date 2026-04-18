import type { GameSystemConfig, ComplexityLevel } from "../../types/platform";

interface GameSelectorProps {
  games: GameSystemConfig[];
  gameSystemId: string;
  onGameSystemChange: (id: string) => void;
  moduleId: string | null;
  onModuleChange: (id: string | null) => void;
  scenario: string | null;
  onScenarioChange: (scenario: string | null) => void;
  complexity: ComplexityLevel;
  onComplexityChange: (c: ComplexityLevel) => void;
}

export function GameSelector({
  games,
  gameSystemId,
  onGameSystemChange,
  moduleId,
  onModuleChange,
  scenario,
  onScenarioChange,
  complexity,
  onComplexityChange,
}: GameSelectorProps) {
  const activeGame = games.find((g) => g.id === gameSystemId) ?? games[0];
  const modules = activeGame?.modules ?? [];
  const activeModule = modules.find((m) => m.id === moduleId);
  const scenarios = activeModule?.scenarios ?? [];
  const hasComplexity = (activeGame?.complexityLevels?.length ?? 0) > 1;

  const selectClass =
    "rounded-md border border-stone-300 bg-white px-2 py-1 text-xs font-medium text-stone-700 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-200 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500";

  return (
    <div className="flex items-center gap-1.5">
      {/* Game System selector — only show if >1 game available */}
      {games.length > 1 && (
        <select
          value={gameSystemId}
          onChange={(e) => onGameSystemChange(e.target.value)}
          className={selectClass}
        >
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.shortName}
            </option>
          ))}
        </select>
      )}

      {/* Module selector */}
      <select
        value={moduleId ?? ""}
        onChange={(e) => onModuleChange(e.target.value || null)}
        className={selectClass}
      >
        <option value="">{activeGame?.shortName ?? "Base"}</option>
        {modules.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>

      {/* Complexity selector — only show if game has multiple levels */}
      {hasComplexity && (
        <select
          value={complexity}
          onChange={(e) => onComplexityChange(e.target.value as ComplexityLevel)}
          className={selectClass}
        >
          <option value="standard">Standard</option>
          <option value="advanced">Advanced</option>
        </select>
      )}

      {/* Scenario selector — only show if module has scenarios */}
      {scenarios.length > 1 && (
        <select
          value={scenario ?? "all"}
          onChange={(e) =>
            onScenarioChange(e.target.value === "all" ? null : e.target.value)
          }
          className={selectClass}
        >
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
