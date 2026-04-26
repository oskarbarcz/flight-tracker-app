import type { Runway } from "~/models";

export type RunwayPair = {
  key: string;
  ends: Runway[];
};

export function reciprocalDesignator(designator: string): string {
  const numMatch = designator.match(/^(\d+)/);
  if (!numMatch) return designator;
  const num = Number.parseInt(numMatch[1], 10);
  const suffix = designator.match(/[LCR]$/)?.[0] ?? "";
  const recipNum = num <= 18 ? num + 18 : num - 18;
  const recipSuffix = suffix === "L" ? "R" : suffix === "R" ? "L" : suffix;
  return `${String(recipNum).padStart(2, "0")}${recipSuffix}`;
}

function pairKey(designator: string): string {
  const reciprocal = reciprocalDesignator(designator);
  const dNum = Number.parseInt(designator, 10);
  const rNum = Number.parseInt(reciprocal, 10);
  return dNum <= rNum ? `${designator}|${reciprocal}` : `${reciprocal}|${designator}`;
}

function designatorOrder(d: string): number {
  return Number.parseInt(d, 10);
}

export function groupRunwaysByPair(runways: Runway[]): RunwayPair[] {
  const groups = new Map<string, Runway[]>();
  for (const runway of runways) {
    const key = pairKey(runway.designator);
    const existing = groups.get(key) ?? [];
    existing.push(runway);
    groups.set(key, existing);
  }
  return Array.from(groups.entries())
    .map(([key, ends]) => ({
      key,
      ends: ends.sort((a, b) => designatorOrder(a.designator) - designatorOrder(b.designator)),
    }))
    .sort((a, b) => designatorOrder(a.ends[0].designator) - designatorOrder(b.ends[0].designator));
}
