import type { FlightConnectionStatus } from "~/features/flight/events.socket";
import { FlightStatus } from "~/features/flight/model";

export enum AocStatus {
  Connected = "connected",
  Connecting = "connecting",
  Error = "error",
}

export enum AdsbSignal {
  Online = "online",
  Offline = "offline",
  NoSignal = "no_signal",
}

const AOC_STATES: Record<FlightConnectionStatus, AocStatus> = {
  live: AocStatus.Connected,
  connecting: AocStatus.Connecting,
  reconnecting: AocStatus.Connecting,
  lost: AocStatus.Error,
};

const AFTER_ON_BLOCK = new Set<FlightStatus>([
  FlightStatus.OnBlock,
  FlightStatus.OffboardingStarted,
  FlightStatus.OffboardingFinished,
  FlightStatus.Closed,
]);

export function aocStatus(connection: FlightConnectionStatus): AocStatus {
  return AOC_STATES[connection];
}

export function adsbSignal(status: FlightStatus, hasFinalLoadsheet: boolean, hasSignal: boolean): AdsbSignal {
  if (hasSignal) {
    return AdsbSignal.Online;
  }

  if (!hasFinalLoadsheet || AFTER_ON_BLOCK.has(status)) {
    return AdsbSignal.NoSignal;
  }

  return AdsbSignal.Offline;
}
