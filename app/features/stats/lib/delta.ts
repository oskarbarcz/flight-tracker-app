export type Delta =
  | { kind: "noActivity" }
  | { kind: "noBaseline" }
  | { kind: "unchanged" }
  | { kind: "percentage"; direction: "up" | "down"; percent: number }
  | { kind: "absolute"; direction: "up" | "down"; difference: number };

type Options = {
  floor: number;
  hasBaselineData: boolean;
};

export function compareToPrevious(current: number, previous: number, { floor, hasBaselineData }: Options): Delta {
  if (current === 0 && previous === 0) {
    return { kind: "noActivity" };
  }

  if (!hasBaselineData) {
    return { kind: "noBaseline" };
  }

  if (current === previous) {
    return { kind: "unchanged" };
  }

  const difference = current - previous;
  const direction = difference > 0 ? "up" : "down";

  if (previous < floor) {
    return { kind: "absolute", direction, difference: Math.abs(difference) };
  }

  const percent = (difference / previous) * 100;
  if (Math.abs(percent) < 0.5) {
    return { kind: "unchanged" };
  }

  return { kind: "percentage", direction, percent: Math.abs(percent) };
}
