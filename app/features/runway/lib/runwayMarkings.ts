import { destinationPoint, initialBearing, type RunwayRibbon } from "~/features/runway/lib/runwayPairs";

export type Point = [number, number];
export type Ring = Point[];
export type Segment = [Point, Point];

const NAUTICAL_MILE_IN_METERS = 1852;
const EDGE_MARGIN_M = 3;
const THRESHOLD_BAR_INSET_M = 6;
const THRESHOLD_BAR_LENGTH_M = 30;
const CENTERLINE_CLEARANCE_M = 18;
const AIMING_POINT_DISTANCE_M = 400;
const AIMING_POINT_LENGTH_M = 50;
const AIMING_POINT_WIDTH_M = 8;
const AIMING_POINT_LATERAL_M = 11;
const AIMING_POINT_MIN_RUNWAY_M = 1200;
const CHEVRON_SPACING_M = 90;
const CHEVRON_LENGTH_M = 40;
const CHEVRON_MAX_COUNT = 4;
const MINOR_TICK_HALF_M = 150;
const MAJOR_TICK_HALF_M = 320;
const TICK_LABEL_CLEARANCE_M = 90;
const LONG_TICK_EVERY_NM = 5;
const LABEL_EVERY_NM = 2;
const DESIGNATOR_INSET_M = 75;

function shift(point: Point, bearing: number, distance: number): Point {
  if (distance === 0) return point;
  return destinationPoint(point[0], point[1], ((bearing % 360) + 360) % 360, distance);
}

function place(origin: Point, bearing: number, along: number, across: number): Point {
  const forward = shift(origin, bearing, along);
  return shift(forward, bearing + (across >= 0 ? 90 : 270), Math.abs(across));
}

function paintedBar(
  origin: Point,
  bearing: number,
  along: number,
  across: number,
  length: number,
  width: number,
): Ring {
  const center = place(origin, bearing, along, across);
  const nose = shift(center, bearing, length / 2);
  const tail = shift(center, bearing + 180, length / 2);
  return [
    shift(nose, bearing + 90, width / 2),
    shift(nose, bearing + 270, width / 2),
    shift(tail, bearing + 270, width / 2),
    shift(tail, bearing + 90, width / 2),
  ];
}

function thresholdBarCount(width: number): number {
  if (width < 18) return 4;
  if (width < 23) return 6;
  if (width < 30) return 8;
  if (width < 45) return 12;
  return 16;
}

function thresholdBars(threshold: Point, inbound: number, width: number): Ring[] {
  const count = thresholdBarCount(width);
  const usable = Math.max(width - EDGE_MARGIN_M * 2, width * 0.6);
  const pitch = usable / (count * 2 - 1);
  const along = THRESHOLD_BAR_INSET_M + THRESHOLD_BAR_LENGTH_M / 2;

  return Array.from({ length: count }, (_, index) =>
    paintedBar(threshold, inbound, along, -usable / 2 + pitch / 2 + index * pitch * 2, THRESHOLD_BAR_LENGTH_M, pitch),
  );
}

function aimingPoints(threshold: Point, inbound: number): Ring[] {
  const along = AIMING_POINT_DISTANCE_M + AIMING_POINT_LENGTH_M / 2;
  return [-AIMING_POINT_LATERAL_M, AIMING_POINT_LATERAL_M].map((across) =>
    paintedBar(threshold, inbound, along, across, AIMING_POINT_LENGTH_M, AIMING_POINT_WIDTH_M),
  );
}

function displacedChevrons(pavementEnd: Point, inbound: number, displace: number, width: number): Ring[] {
  const usable = displace - CHEVRON_LENGTH_M;
  if (usable < 0) return [];

  const count = Math.min(CHEVRON_MAX_COUNT, Math.floor(usable / CHEVRON_SPACING_M) + 1);
  const arm = width * 0.35;

  return Array.from({ length: count }, (_, index) => {
    const base = usable - index * CHEVRON_SPACING_M;
    return [
      place(pavementEnd, inbound, base + CHEVRON_LENGTH_M, 0),
      place(pavementEnd, inbound, base, arm),
      place(pavementEnd, inbound, base, -arm),
    ];
  });
}

export function uprightRotation(from: Point, to: Point): number {
  const meanLatitude = (((from[0] + to[0]) / 2) * Math.PI) / 180;
  const dx = (to[1] - from[1]) * Math.cos(meanLatitude);
  const dy = -(to[0] - from[0]);
  let degrees = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (degrees > 90) degrees -= 180;
  if (degrees < -90) degrees += 180;
  return degrees;
}

export type RunwayThreshold = {
  id: string;
  designator: string;
  position: Point;
  designatorPosition: Point;
  inbound: number;
  outbound: number;
};

export type RunwayPlate = {
  thresholds: RunwayThreshold[];
  markings: Ring[];
  paintedCenterline: Segment | null;
};

export function computeRunwayPlate(ribbon: RunwayRibbon): RunwayPlate {
  const [head, tail] = ribbon.centerline;
  const bearing = initialBearing(head[0], head[1], tail[0], tail[1]);
  const { width, length } = ribbon.ends[0];

  const pavementEnds = [
    { point: head, inbound: bearing, runway: ribbon.ends[0] },
    { point: tail, inbound: bearing + 180, runway: ribbon.ends[1] },
  ];

  const thresholds: RunwayThreshold[] = [];
  const markings: Ring[] = [];
  const centerlineEnds: Point[] = [];

  for (const { point, inbound, runway } of pavementEnds) {
    const displace = runway?.displace ?? 0;
    const position = shift(point, inbound, displace);

    if (runway) {
      thresholds.push({
        id: runway.id,
        designator: runway.designator,
        position,
        designatorPosition: shift(position, inbound, DESIGNATOR_INSET_M),
        inbound: ((inbound % 360) + 360) % 360,
        outbound: (((inbound + 180) % 360) + 360) % 360,
      });
    }

    markings.push(...thresholdBars(position, inbound, width));
    markings.push(...displacedChevrons(point, inbound, displace, width));
    if (length >= AIMING_POINT_MIN_RUNWAY_M) {
      markings.push(...aimingPoints(position, inbound));
    }

    centerlineEnds.push(
      shift(position, inbound, THRESHOLD_BAR_INSET_M + THRESHOLD_BAR_LENGTH_M + CENTERLINE_CLEARANCE_M),
    );
  }

  const [centerlineHead, centerlineTail] = centerlineEnds;
  const usableLength = length - (ribbon.ends[0].displace ?? 0) - (ribbon.ends[1]?.displace ?? 0);
  const paintedCenterline: Segment | null =
    usableLength > (THRESHOLD_BAR_INSET_M + THRESHOLD_BAR_LENGTH_M + CENTERLINE_CLEARANCE_M) * 2
      ? [centerlineHead, centerlineTail]
      : null;

  return { thresholds, markings, paintedCenterline };
}

export type ApproachPath = {
  key: string;
  centerline: Segment;
  ticks: Segment[];
  labels: { key: string; position: Point; text: string }[];
};

export function computeApproachPath(threshold: RunwayThreshold, distanceNm: number): ApproachPath {
  const { position, outbound } = threshold;
  const ticks: Segment[] = [];
  const labels: ApproachPath["labels"] = [];

  for (let nm = 1; nm <= distanceNm; nm++) {
    const at = shift(position, outbound, nm * NAUTICAL_MILE_IN_METERS);
    const long = nm % LONG_TICK_EVERY_NM === 0;
    const half = long ? MAJOR_TICK_HALF_M : MINOR_TICK_HALF_M;

    ticks.push([shift(at, outbound + 90, half), shift(at, outbound + 270, half)]);

    if (nm % LABEL_EVERY_NM === 0) {
      labels.push({
        key: `${threshold.id}-${nm}`,
        position: shift(at, outbound + 90, half + TICK_LABEL_CLEARANCE_M),
        text: nm === distanceNm ? `${nm} NM` : `${nm}`,
      });
    }
  }

  return {
    key: threshold.id,
    centerline: [position, shift(position, outbound, distanceNm * NAUTICAL_MILE_IN_METERS)],
    ticks,
    labels,
  };
}
