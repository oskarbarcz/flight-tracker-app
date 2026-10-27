import Arc from "arc";
import { fn } from "storybook/test";
import {
  Flight,
  type FlightEvent,
  FlightEventScope,
  FlightEventType,
  type FlightPathElement,
  type FlightServiceType,
  FlightStatus,
} from "~/features/flight";
import type { TrackedFlightContextType } from "~/features/flight/hooks/useTrackedFlight";
import type { ApiFlightResponse } from "~/features/flight/request";
import bostonPhiladelphia from "./boston-philadelphia.json";
import bostonPhiladelphiaTrack from "./boston-philadelphia-track.json";
import frankfurtNewYork from "./frankfurt-new-york.json";

export type RouteFixture = "short" | "longHaul";

const ROUTES: Record<RouteFixture, unknown> = {
  short: bostonPhiladelphia,
  longHaul: frankfurtNewYork,
};

const BLOCK_EVENTS = ["offBlockTime", "takeoffTime", "arrivalTime", "onBlockTime"] as const;

const REPORTED_EVENTS: Partial<Record<FlightStatus, number>> = {
  [FlightStatus.TaxiingOut]: 1,
  [FlightStatus.InCruise]: 2,
  [FlightStatus.TaxiingIn]: 3,
  [FlightStatus.OnBlock]: 4,
  [FlightStatus.OffboardingStarted]: 4,
  [FlightStatus.OffboardingFinished]: 4,
  [FlightStatus.Closed]: 4,
};

export const CRUISE_FRACTION = 0.45;

const MINUTE = 60_000;

function minutesSinceOffBlock(status: FlightStatus, plan: number[]): number {
  switch (status) {
    case FlightStatus.BoardingStarted:
      return -20;
    case FlightStatus.BoardingFinished:
      return -3;
    case FlightStatus.TaxiingOut:
      return 6;
    case FlightStatus.InCruise:
      return plan[1] + (plan[2] - plan[1]) * CRUISE_FRACTION;
    case FlightStatus.TaxiingIn:
      return plan[2] + 3;
    case FlightStatus.OnBlock:
      return plan[3] + 2;
    case FlightStatus.OffboardingStarted:
      return plan[3] + 10;
    case FlightStatus.OffboardingFinished:
    case FlightStatus.Closed:
      return plan[3] + 25;
    default:
      return -50;
  }
}

export type FlightFixtureOptions = {
  route?: RouteFixture;
  status?: FlightStatus;
  serviceType?: FlightServiceType;
  delayMinutes?: number;
  blockDeltaMinutes?: number;
};

export function flightFixture({
  route = "short",
  status = FlightStatus.InCruise,
  serviceType,
  delayMinutes = 0,
  blockDeltaMinutes = 0,
}: FlightFixtureOptions = {}): Flight {
  const base = structuredClone(ROUTES[route]) as ApiFlightResponse;
  const scheduled = base.timesheet.scheduled;
  const offBlock = Date.parse(scheduled.offBlockTime);
  const plan = BLOCK_EVENTS.map((key) => (Date.parse(scheduled[key]) - offBlock) / MINUTE);

  const scheduledOffBlock = Date.now() - (minutesSinceOffBlock(status, plan) + delayMinutes) * MINUTE;
  const reported = REPORTED_EVENTS[status] ?? 0;
  const at = (index: number, shift: number) =>
    new Date(scheduledOffBlock + (plan[index] + shift) * MINUTE).toISOString();
  const expected = (index: number) => at(index, delayMinutes + (index >= 2 ? blockDeltaMinutes : 0));

  base.status = status;
  base.serviceType = serviceType ?? base.serviceType;
  base.timesheet = {
    scheduled: {
      offBlockTime: at(0, 0),
      takeoffTime: at(1, 0),
      arrivalTime: at(2, 0),
      onBlockTime: at(3, 0),
    },
    estimated: {
      offBlockTime: expected(0),
      takeoffTime: expected(1),
      arrivalTime: expected(2),
      onBlockTime: expected(3),
    },
    actual: {
      offBlockTime: reported > 0 ? expected(0) : null,
      takeoffTime: reported > 1 ? expected(1) : null,
      arrivalTime: reported > 2 ? expected(2) : null,
      onBlockTime: reported > 3 ? expected(3) : null,
    },
  };

  return new Flight(base);
}

export const recordedTrack = bostonPhiladelphiaTrack as FlightPathElement[];

export function syntheticTrack(flight: Flight, fraction: number, points = 40): FlightPathElement[] {
  const from = flight.departureAirport.location;
  const to = flight.destinationAirport.location;
  const { geometries } = new Arc.GreatCircle(
    { x: from.longitude, y: from.latitude },
    { x: to.longitude, y: to.latitude },
  ).Arc(points, { offset: 10 });
  const coords = geometries.flatMap((geometry) => geometry.coords);
  const flown = coords.slice(0, Math.max(2, Math.round(coords.length * fraction)));

  return flown.map(([longitude, latitude], index) => ({
    callsign: flight.callsign,
    date: new Date(Date.now() - (flown.length - index) * MINUTE).toISOString(),
    latitude,
    longitude,
    altitude: Math.min(36_000, index * 4_000),
    groundSpeed: 480,
    isOnGround: false,
  }));
}

export function livePositionEvents(): FlightEvent[] {
  return [
    {
      id: "live-position",
      scope: FlightEventScope.System,
      type: FlightEventType.LivePositionReceived,
      payload: {},
      actor: null,
      createdAt: new Date(Date.now() - 30 * MINUTE),
    },
  ];
}

export function trackedFlight(flight: Flight, events: FlightEvent[] = []): TrackedFlightContextType {
  return {
    flight,
    loadsheets: { preliminary: null, final: null },
    events,
    emergencies: [],
    emergenciesLoadFailed: false,
    activeEmergency: null,
    diversion: null,
    delayRequest: null,
    loading: false,
    connectionStatus: "live",
    setFlightId: fn(),
    reconnect: fn(),
    reload: fn(async () => {}),
    checkIn: fn(async () => {}),
    startBoarding: fn(async () => {}),
    finishBoarding: fn(async () => {}),
    reportOffBlock: fn(async () => {}),
    reportTakeoff: fn(async () => {}),
    reportArrival: fn(async () => {}),
    reportOnBlock: fn(async () => {}),
    startOffboarding: fn(async () => {}),
    finishOffboarding: fn(async () => {}),
    close: fn(async () => {}),
    declareEmergency: fn(async () => {}),
    updateEmergency: fn(async () => {}),
    resolveEmergency: fn(async () => {}),
    reportDiversion: fn(async () => {}),
    updateDiversion: fn(async () => {}),
    fileDelayReport: fn(async () => {}),
    removeDelayReport: fn(async () => {}),
    acceptDelayReport: fn(async () => {}),
    rejectDelayReport: fn(async () => {}),
  };
}
