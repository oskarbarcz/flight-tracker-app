const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function elapsedSince(instant: string | null, now: number = Date.now()): string | null {
  if (instant === null) {
    return null;
  }

  const elapsed = now - new Date(instant).getTime();

  if (Number.isNaN(elapsed) || elapsed < 0) {
    return null;
  }

  if (elapsed < MINUTE_MS) {
    return "just now";
  }

  if (elapsed < HOUR_MS) {
    return `${Math.floor(elapsed / MINUTE_MS)} min`;
  }

  if (elapsed < DAY_MS) {
    return `${Math.floor(elapsed / HOUR_MS)} h`;
  }

  return `${Math.floor(elapsed / DAY_MS)} d`;
}
