import type { GsxPassengerFlow } from "~/features/user/lib/gsxSettings";

export type Point = {
  x: number;
  y: number;
};

export type PassengerWalk = {
  row: number;
  path: string;
  motionKeyTimes: string;
  fadeKeyTimes: string;
  seatValues: string;
  seatKeyTimes: string;
};

export type PassengerLoop = {
  duration: string;
  walks: PassengerWalk[];
};

type RestingPlan = {
  route: Point[];
  passengers: number[];
  isRowOccupied: (row: number) => boolean;
};

export const ROW_COUNT = 16;
export const FIRST_ROW_X = 94;
export const ROW_PITCH = 11;
export const SEAT_LENGTH = 8.5;

const AISLE_Y = 76;
const GATE: Point = { x: 22, y: 124 };
const BRIDGE_END: Point = { x: 80, y: 124 };
const CABIN_ENTRY: Point = { x: 80, y: AISLE_Y };
const ARROW_SIZE = 4;

const WALKING_UNITS_PER_SECOND = 60;
const LEAD_SECONDS = 0.4;
const HOLD_SECONDS = 1.6;
const FADE_SECONDS = 0.2;
const SECONDS_BETWEEN_ROWS: Record<GsxPassengerFlow, number> = {
  boarding: 0.55,
  deboarding: 0.45,
};

export const restingPlans: Record<GsxPassengerFlow, RestingPlan> = {
  boarding: {
    route: [GATE, BRIDGE_END, CABIN_ENTRY, { x: 250, y: AISLE_Y }],
    passengers: [10, 26, 42, 58, 78, 100, 122, 146],
    isRowOccupied: (row) => row >= 12,
  },
  deboarding: {
    route: [{ x: 264, y: AISLE_Y }, CABIN_ENTRY, BRIDGE_END, GATE],
    passengers: [138, 154, 170, 188, 206, 224, 240, 256],
    isRowOccupied: (row) => row >= 3,
  },
};

function routeLength(route: Point[]): number {
  return route
    .slice(1)
    .reduce((total, point, index) => total + Math.hypot(point.x - route[index].x, point.y - route[index].y), 0);
}

export function pointAlong(route: Point[], distance: number): Point {
  let remaining = distance;

  for (const [index, start] of route.slice(0, -1).entries()) {
    const end = route[index + 1];
    const length = Math.hypot(end.x - start.x, end.y - start.y);

    if (remaining <= length) {
      const progress = remaining / length;

      return { x: start.x + (end.x - start.x) * progress, y: start.y + (end.y - start.y) * progress };
    }

    remaining -= length;
  }

  return route[route.length - 1];
}

export function arrowheadAt(route: Point[]): string {
  const tip = route[route.length - 1];
  const before = route[route.length - 2];
  const length = Math.hypot(tip.x - before.x, tip.y - before.y);
  const along = { x: (tip.x - before.x) / length, y: (tip.y - before.y) / length };
  const barb = (side: number) =>
    `${tip.x - along.x * ARROW_SIZE - along.y * ARROW_SIZE * side} ${tip.y - along.y * ARROW_SIZE + along.x * ARROW_SIZE * side}`;

  return `M${barb(1)} L${tip.x} ${tip.y} L${barb(-1)}`;
}

function walkRoute(flow: GsxPassengerFlow, row: number): Point[] {
  const seatRow = { x: FIRST_ROW_X + row * ROW_PITCH + SEAT_LENGTH / 2, y: AISLE_Y };
  const inbound = [GATE, BRIDGE_END, CABIN_ENTRY, seatRow];

  return flow === "boarding" ? inbound : [...inbound].reverse();
}

function passengerLoop(flow: GsxPassengerFlow): PassengerLoop {
  const timed = Array.from({ length: ROW_COUNT }, (_, row) => {
    const turn = flow === "boarding" ? ROW_COUNT - 1 - row : row;
    const route = walkRoute(flow, row);
    const start = LEAD_SECONDS + turn * SECONDS_BETWEEN_ROWS[flow];

    return { row, route, start, end: start + routeLength(route) / WALKING_UNITS_PER_SECOND };
  });
  const seconds = Math.max(...timed.map(({ end }) => end)) + HOLD_SECONDS;
  const at = (moment: number) => (moment / seconds).toFixed(4);

  return {
    duration: `${seconds.toFixed(2)}s`,
    walks: timed.map(({ row, route, start, end }) => {
      const seatChange = flow === "boarding" ? end : start;

      return {
        row,
        path: `M${route.map(({ x, y }) => `${x} ${y}`).join(" L")}`,
        motionKeyTimes: `0;${at(start)};${at(end)};1`,
        fadeKeyTimes: `0;${at(start)};${at(start + FADE_SECONDS)};${at(end - FADE_SECONDS)};${at(end)};1`,
        seatValues: flow === "boarding" ? "0;0;1;1;0" : "1;1;0;0;1",
        seatKeyTimes: `0;${at(seatChange)};${at(seatChange + FADE_SECONDS)};${at(seconds - FADE_SECONDS)};1`,
      };
    }),
  };
}

export const passengerLoops: Record<GsxPassengerFlow, PassengerLoop> = {
  boarding: passengerLoop("boarding"),
  deboarding: passengerLoop("deboarding"),
};
