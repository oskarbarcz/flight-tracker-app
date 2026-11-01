import { type Flight, FlightServiceType, FlightStatus } from "~/features/flight/model";
import type { GsxSettingsResponse } from "~/features/user/request";
import { toHuman } from "~/i18n/translate";

export type GsxHandling = {
  heading: string;
  detail: string;
  manualLabel: string;
};

type Handling = {
  setting: "autoBoardingEnabled" | "autoDeboardingEnabled";
  startedStatus: FlightStatus;
  headings: Record<FlightServiceType, string>;
  services: Record<FlightServiceType, string>;
};

const handlings: Partial<Record<FlightStatus, Handling>> = {
  [FlightStatus.CheckedIn]: {
    setting: "autoBoardingEnabled",
    startedStatus: FlightStatus.BoardingStarted,
    headings: {
      [FlightServiceType.Passenger]: "Board passengers",
      [FlightServiceType.Cargo]: "Load cargo",
    },
    services: {
      [FlightServiceType.Passenger]: "boarding",
      [FlightServiceType.Cargo]: "loading",
    },
  },
  [FlightStatus.OnBlock]: {
    setting: "autoDeboardingEnabled",
    startedStatus: FlightStatus.OffboardingStarted,
    headings: {
      [FlightServiceType.Passenger]: "Deboard passengers",
      [FlightServiceType.Cargo]: "Unload cargo",
    },
    services: {
      [FlightServiceType.Passenger]: "deboarding",
      [FlightServiceType.Cargo]: "unloading",
    },
  },
};

export function gsxHandling(flight: Flight, settings: GsxSettingsResponse | null): GsxHandling | null {
  const handling = handlings[flight.status];

  if (handling === undefined || settings === null || !settings.integrationEnabled || !settings[handling.setting]) {
    return null;
  }

  const phase = toHuman.flight.status.short(handling.startedStatus, flight.serviceType);

  return {
    heading: handling.headings[flight.serviceType],
    detail: `GSX will tell us if you started ${handling.services[flight.serviceType]}.`,
    manualLabel: `Manually start ${phase.toLowerCase()}`,
  };
}
