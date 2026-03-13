import type { PhaseTiming, TimeOfDay } from "../types/goss";

/**
 * Returns true if a phase/subphase with the given timing applies
 * to the selected time of day.
 *
 * ENA (Extended Night Action) uses the same rules as Night.
 */
export function isActiveForTimeOfDay(
  timing: PhaseTiming | undefined,
  tod: TimeOfDay
): boolean {
  if (!timing || timing === "every-turn") return true;
  if (timing === "conditional") return true; // always show, user decides

  const isDay = tod === "AM" || tod === "PM";
  const isNight = tod === "Night" || tod === "ENA";

  switch (timing) {
    case "am-only":
      return tod === "AM";
    case "pm-only":
      return tod === "PM";
    case "night-only":
      return isNight;
    case "am-pm-only":
      return isDay;
    default:
      return true;
  }
}
