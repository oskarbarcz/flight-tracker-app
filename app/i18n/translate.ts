import { translateContinent } from "~/features/airport/i18n";
import {
  translateAirportOnFlightType,
  translateEventType,
  translateShortStatus,
  translateStatus,
  translateStatusNextAction,
} from "~/features/flight/i18n";
import { translateRotationStatus } from "~/features/rotation/i18n";

export const toHuman = {
  flight: {
    eventType: translateEventType,
    status: {
      next: translateStatusNextAction,
      short: translateShortStatus,
      standard: translateStatus,
    },
  },
  rotation: {
    status: translateRotationStatus,
  },
  airport: {
    continent: translateContinent,
    onFlightType: translateAirportOnFlightType,
  },
};
