import { formatTons } from "~/features/flight/components/FuelAndLoadsheet/BuildUpLine";
import { formatClockDuration, padZero } from "~/shared/lib/time";

export const ABSENT = "—";

const FLIGHT_LEVEL_FLOOR_FEET = 18_000;
const METRES_PER_NAUTICAL_MILE = 1852;

export function formatElapsed(seconds: number): string {
  return formatClockDuration(seconds / 60);
}

export function formatAltitude(feet: number): string {
  if (feet >= FLIGHT_LEVEL_FLOOR_FEET) {
    return `FL${padZero(Math.round(feet / 100), 3)}`;
  }

  return `${Math.round(feet).toLocaleString("en-GB")} ft`;
}

export function formatTonnesFromKilograms(kilograms: number | null): string {
  return kilograms === null ? ABSENT : formatTons(kilograms / 1000);
}

export function formatFuelFlow(kilogramsPerHour: number | null): string {
  return kilogramsPerHour === null ? ABSENT : Math.round(kilogramsPerHour).toLocaleString("en-GB");
}

export function formatBearing(degrees: number | null): string {
  return degrees === null ? ABSENT : `${padZero(Math.round(degrees) % 360, 3)}°`;
}

export function formatWind(direction: number | null, speed: number | null): string {
  if (direction === null || speed === null) {
    return ABSENT;
  }

  return `${padZero(Math.round(direction) % 360, 3)}/${padZero(Math.round(speed))}`;
}

export function formatCelsius(degrees: number | null): string {
  if (degrees === null) {
    return ABSENT;
  }

  const rounded = Math.round(degrees);

  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

export function formatDistance(nauticalMiles: number | null): string {
  return nauticalMiles === null ? ABSENT : Math.round(nauticalMiles).toLocaleString("en-GB");
}

export function formatFeet(feet: number | null): string {
  return feet === null ? ABSENT : `${Math.round(feet).toLocaleString("en-GB")} ft`;
}

export function formatMetres(metres: number | null): string {
  return metres === null ? ABSENT : `${Math.round(metres).toLocaleString("en-GB")} m`;
}

export function formatFlightLevels(levels: number[]): string {
  return levels.length === 0 ? ABSENT : levels.map((level) => padZero(level, 3)).join(" · ");
}

export function nauticalMilesToMetres(nauticalMiles: number): number {
  return nauticalMiles * METRES_PER_NAUTICAL_MILE;
}
