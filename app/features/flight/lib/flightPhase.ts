import { FlightStatus } from "~/features/flight/model";

const BEFORE_OFF_BLOCK = new Set<FlightStatus>([
  FlightStatus.Created,
  FlightStatus.Ready,
  FlightStatus.CheckedIn,
  FlightStatus.BoardingStarted,
  FlightStatus.BoardingFinished,
]);

const AFTER_TAKEOFF = new Set<FlightStatus>([
  FlightStatus.InCruise,
  FlightStatus.TaxiingIn,
  FlightStatus.OnBlock,
  FlightStatus.OffboardingStarted,
  FlightStatus.OffboardingFinished,
  FlightStatus.Closed,
]);

export function isBeforeOffBlock(status: FlightStatus): boolean {
  return BEFORE_OFF_BLOCK.has(status);
}

export function isAfterTakeoff(status: FlightStatus): boolean {
  return AFTER_TAKEOFF.has(status);
}

const NEXT_STATUS: Partial<Record<FlightStatus, FlightStatus>> = {
  [FlightStatus.Ready]: FlightStatus.CheckedIn,
  [FlightStatus.CheckedIn]: FlightStatus.BoardingStarted,
  [FlightStatus.BoardingStarted]: FlightStatus.BoardingFinished,
  [FlightStatus.BoardingFinished]: FlightStatus.TaxiingOut,
  [FlightStatus.TaxiingOut]: FlightStatus.InCruise,
  [FlightStatus.InCruise]: FlightStatus.TaxiingIn,
  [FlightStatus.TaxiingIn]: FlightStatus.OnBlock,
  [FlightStatus.OnBlock]: FlightStatus.OffboardingStarted,
  [FlightStatus.OffboardingStarted]: FlightStatus.OffboardingFinished,
  [FlightStatus.OffboardingFinished]: FlightStatus.Closed,
};

export function nextStatus(status: FlightStatus): FlightStatus | null {
  return NEXT_STATUS[status] ?? null;
}
