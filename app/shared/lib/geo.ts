import { padZero } from "~/shared/lib/time";

export function formatDegrees(value: number): string {
  return `${padZero(Math.round(value), 3)}°`;
}
