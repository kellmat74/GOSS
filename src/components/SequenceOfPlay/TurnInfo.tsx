import type { GameTurn } from "../../types/goss";

interface TurnInfoProps {
  turn: GameTurn;
}

export function TurnInfo({ turn }: TurnInfoProps) {
  const todIcon =
    turn.timeOfDay === "AM" ? "\u2600" : turn.timeOfDay === "PM" ? "\u26C5" : "\u263E";

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="font-semibold">
        Turn {turn.turnNumber}
      </span>
      <span className="text-stone-400">|</span>
      <span>{turn.date}</span>
      <span className="text-stone-400">|</span>
      <span>
        {todIcon} {turn.timeOfDay}
      </span>
    </div>
  );
}
