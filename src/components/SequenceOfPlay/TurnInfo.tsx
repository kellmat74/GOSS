import type { TimeOfDay } from "../../types/goss";

const options: { value: TimeOfDay; label: string; icon: string }[] = [
  { value: "AM", label: "AM", icon: "☀" },
  { value: "PM", label: "PM", icon: "⛅" },
  { value: "Night", label: "Night", icon: "☾" },
  { value: "ENA", label: "ENA", icon: "☾" },
];

interface TurnInfoProps {
  timeOfDay: TimeOfDay;
  onChangeTimeOfDay: (tod: TimeOfDay) => void;
}

export function TurnInfo({ timeOfDay, onChangeTimeOfDay }: TurnInfoProps) {
  return (
    <div className="flex items-center gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChangeTimeOfDay(opt.value)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            timeOfDay === opt.value
              ? "bg-amber-600 text-white"
              : "text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700"
          }`}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}
