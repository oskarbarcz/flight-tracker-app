import { translateContinent } from "~/models/i18n/airport.i18n";
import {
  translateEventType,
  translateShortStatus,
  translateStatus,
  translateStatusNextAction,
} from "~/models/i18n/flight.i18n";

export const toHuman = {
  flight: {
    eventType: translateEventType,
    status: {
      next: translateStatusNextAction,
      short: translateShortStatus,
      standard: translateStatus,
    },
  },
  airport: {
    continent: translateContinent,
  },
};
