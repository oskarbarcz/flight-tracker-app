import { translateContinent } from "~/features/airport/i18n";
import {
  translateEventType,
  translateShortStatus,
  translateStatus,
  translateStatusNextAction,
} from "~/features/flight/i18n";

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
