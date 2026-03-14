export type GameModule = null | "war" | "hurtgen" | "atlantic-wall" | "lucky-forward";

interface GameOption {
  value: GameModule;
  label: string;
  disabled?: boolean;
}

const GAME_OPTIONS: GameOption[] = [
  { value: null, label: "GOSS Base" },
  { value: "war", label: "Wacht am Rhein" },
  { value: "hurtgen", label: "Hurtgen" },
  { value: "atlantic-wall", label: "Atlantic Wall", disabled: true },
  { value: "lucky-forward", label: "Lucky Forward" },
];

interface GameSelectorProps {
  value: GameModule;
  onChange: (module: GameModule) => void;
}

export function GameSelector({ value, onChange }: GameSelectorProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        onChange((e.target.value || null) as GameModule)
      }
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
  );
}
