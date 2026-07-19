import { type Flight, type FlightPathElement, FlightStatus, isInFlightStatus } from "~/features/flight";

const EARTH_RADIUS_NM = 3440.065;

type LatLng = { latitude: number; longitude: number };

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function distanceInNauticalMiles(from: LatLng, to: LatLng): number {
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);

  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLon / 2) ** 2;
  return 2 * EARTH_RADIUS_NM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export type FlightPhase = "preflight" | "enroute" | "arrived";

const ARRIVED_STATUSES = [
  FlightStatus.OnBlock,
  FlightStatus.OffboardingStarted,
  FlightStatus.OffboardingFinished,
  FlightStatus.Closed,
];

export type FlightProgress = {
  phase: FlightPhase;
  fraction: number;
  totalNm: number;
  flownNm: number;
  remainingNm: number;
  departureDate: Date;
  arrivalDate: Date;
  hasLivePosition: boolean;
};

export function computeFlightProgress(flight: Flight, path: FlightPathElement[]): FlightProgress {
  const departure = flight.departureAirport.location;
  const destination = flight.destinationAirport.location;
  const totalNm = distanceInNauticalMiles(departure, destination);

  const { scheduled, estimated, actual } = flight.timesheet;
  const departureDate = actual?.offBlockTime ?? estimated?.offBlockTime ?? scheduled.offBlockTime;
  const arrivalDate = actual?.onBlockTime ?? estimated?.onBlockTime ?? scheduled.onBlockTime;

  let phase: FlightPhase = "preflight";
  if (ARRIVED_STATUSES.includes(flight.status)) phase = "arrived";
  else if (isInFlightStatus(flight.status)) phase = "enroute";

  const lastPosition = path[path.length - 1];
  const hasLivePosition = Boolean(lastPosition);

  if (phase === "arrived") {
    return {
      phase,
      fraction: 1,
      totalNm,
      flownNm: totalNm,
      remainingNm: 0,
      departureDate,
      arrivalDate,
      hasLivePosition,
    };
  }

  if (phase === "enroute" && lastPosition) {
    const flownNm = distanceInNauticalMiles(departure, lastPosition);
    const remainingNm = distanceInNauticalMiles(lastPosition, destination);
    const covered = flownNm + remainingNm;
    const fraction = covered > 0 ? Math.min(1, Math.max(0, flownNm / covered)) : 0;
    return { phase, fraction, totalNm, flownNm, remainingNm, departureDate, arrivalDate, hasLivePosition };
  }

  return { phase, fraction: 0, totalNm, flownNm: 0, remainingNm: totalNm, departureDate, arrivalDate, hasLivePosition };
}

export function formatAirportClockTime(date: Date, timeZone: string | undefined): string {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
}

export function humanDuration(fromNow: number): string | null {
  const minutes = Math.round(fromNow / 60000);
  if (minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours > 0) return `${hours}h ${remainder}m`;
  return `${remainder} min`;
}
