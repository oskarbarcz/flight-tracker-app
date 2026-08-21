import { translateAircraftState } from "~/features/aircraft/i18n";
import { translateContinent } from "~/features/airport/i18n";
import {
  translateCabinClass,
  translateCommentSentiment,
  translateCommentSeverity,
  translateDeck,
  translateLayoutMatch,
  translateSeatRating,
  translateWindowStatus,
} from "~/features/cabin-layout/i18n";
import {
  translateAirportOnFlightType,
  translateEventType,
  translateShortStatus,
  translateStatus,
  translateStatusNextAction,
} from "~/features/flight/i18n";
import { translateRotationStatus } from "~/features/rotation/i18n";

export const toHuman = {
  aircraft: {
    state: translateAircraftState,
  },
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
  cabinLayout: {
    cabinClass: translateCabinClass,
    commentSentiment: translateCommentSentiment,
    commentSeverity: translateCommentSeverity,
    deck: translateDeck,
    match: translateLayoutMatch,
    seatRating: translateSeatRating,
    windowStatus: translateWindowStatus,
  },
};
