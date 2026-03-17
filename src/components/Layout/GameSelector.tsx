export type GameModule = null | "war" | "hurtgen" | "atlantic-wall" | "lucky-forward";

interface GameOption {
  value: GameModule;
  label: string;
  disabled?: boolean;
}

export interface ScenarioDef {
  id: string;
  label: string;
}

const GAME_OPTIONS: GameOption[] = [
  { value: null, label: "GOSS Base" },
  { value: "war", label: "Wacht am Rhein" },
  { value: "hurtgen", label: "Hurtgen" },
  { value: "atlantic-wall", label: "Atlantic Wall" },
  { value: "lucky-forward", label: "Lucky Forward" },
];

/** Scenarios available per game module */
export const GAME_SCENARIOS: Record<string, ScenarioDef[]> = {
  hurtgen: [
    { id: "all", label: "All Scenarios" },
    { id: "bloody-bucket", label: "1: Bloody Bucket (Learning)" },
    { id: "september-rush", label: "2: September Rush" },
    { id: "october", label: "3: October Trick or Treat" },
    { id: "november", label: "4: November's Turkey Shoot" },
    { id: "campaign", label: "Campaign: Hell's Forest" },
  ],
  "lucky-forward": [
    { id: "all", label: "All Scenarios" },
    { id: "gremercy-forest", label: "Intro: Gremercy Forest" },
    { id: "september", label: "September" },
    { id: "october", label: "October (Extended Sep)" },
    { id: "november", label: "November" },
    { id: "december", label: "December" },
    { id: "campaign", label: "Campaign" },
  ],
  war: [
    { id: "all", label: "All Scenarios" },
  ],
  "atlantic-wall": [
    { id: "all", label: "All Scenarios" },
  ],
};

interface GameSelectorProps {
  value: GameModule;
  onChange: (module: GameModule) => void;
  scenario: string | null;
  onScenarioChange: (scenario: string | null) => void;
}

export function GameSelector({ value, onChange, scenario, onScenarioChange }: GameSelectorProps) {
  const scenarios = value ? GAME_SCENARIOS[value] : null;

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={value ?? ""}
        onChange={(e) => {
          const mod = (e.target.value || null) as GameModule;
          onChange(mod);
          // Reset scenario when game changes
          onScenarioChange(null);
        }}
        className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs font-medium text-stone-700 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-200 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
      >
        {GAME_OPTIONS.map((opt) => (
          <option
            key={opt.value ?? "base"}
            value={opt.value ?? ""}
            disabled={opt.disabled}
          >
            {opt.label}
          </option>
        ))}
      </select>

      {scenarios && scenarios.length > 1 && (
        <select
          value={scenario ?? "all"}
          onChange={(e) =>
            onScenarioChange(e.target.value === "all" ? null : e.target.value)
          }
          className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs font-medium text-stone-700 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-200 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
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
