import { FlightStatus } from "~/features/flight/model";

const AFTER_TAKEOFF = new Set<FlightStatus>([
  FlightStatus.InCruise,
  FlightStatus.TaxiingIn,
  FlightStatus.OnBlock,
  FlightStatus.OffboardingStarted,
  FlightStatus.OffboardingFinished,
  FlightStatus.Closed,
]);

export function isAfterTakeoff(status: FlightStatus): boolean {
  return AFTER_TAKEOFF.has(status);
}
