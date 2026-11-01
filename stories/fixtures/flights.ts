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
import { airportRoute } from "~/features/flight/lib/flightMapBounds";
import type { ApiFlightResponse } from "~/features/flight/request";
import type { GsxSettingsResponse } from "~/features/user/request";
import bostonPhiladelphia from "./boston-philadelphia.json";
import bostonPhiladelphiaTrack from "./boston-philadelphia-track.json";
import frankfurtNewYork from "./frankfurt-new-york.json";

export type RouteFixture = "short" | "longHaul" | "polar";

const [frankfurt, newYork, philadelphia] = frankfurtNewYork.airports;

const newYorkHongKong = {
  ...frankfurtNewYork,
  airports: [
    { ...newYork, type: "departure" },
    {
      ...frankfurt,
      id: "6f0f8a52-3f0e-4c8e-9d38-1f4b7a2c5e10",
      icaoCode: "VHHH",
      iataCode: "HKG",
      city: { ...frankfurt.city, name: "Hong Kong" },
      name: "Hong Kong Intl",
      country: { code: "HK", name: "Hong Kong" },
      timezone: "Asia/Hong_Kong",
      continent: "asia",
      location: { latitude: 22.30889, longitude: 113.91472 },
      shape: [],
      type: "destination",
    },
    philadelphia,
  ],
};

const ROUTES: Record<RouteFixture, unknown> = {
  short: bostonPhiladelphia,
  longHaul: frankfurtNewYork,
  polar: newYorkHongKong,
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
  const route = airportRoute(flight.departureAirport, flight.destinationAirport);
  const coords = Array.from(
    { length: points },
    (_, index) => route[Math.round((index * (route.length - 1)) / (points - 1))],
  );
  const flown = coords.slice(0, Math.max(2, Math.round(coords.length * fraction)));

  return flown.map(([latitude, longitude], index) => ({
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

export function trackedFlight(
  flight: Flight,
  events: FlightEvent[] = [],
  gsxSettings: GsxSettingsResponse | null = null,
): TrackedFlightContextType {
  return {
    flight,
    loadsheets: { preliminary: null, final: null },
    events,
    emergencies: [],
    emergenciesLoadFailed: false,
    activeEmergency: null,
    diversion: null,
    delayRequest: null,
    gsxSettings,
    loading: false,
    connectionStatus: "live",
    setFlightId: fn(),
    reconnect: fn(),
    reload: fn(async () => {}),
    checkIn: fn(async () => {}),
    reportPredictedTimes: fn(async () => {}),
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
