import { translateAircraftState } from "~/features/aircraft/i18n";
import {
  translateContinent,
  translateDataQuality,
  translateOsmChangeIntent,
  translateOsmChangeStatus,
  translateOsmPushOutcome,
  translateOsmRecord,
  translateOsmResource,
} from "~/features/airport/i18n";
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
  translateCompartmentLoading,
  translateCompartmentName,
  translateDoorSide,
  translateHoldDeck,
  translatePositionSide,
  translateUldBase,
  translateUldContour,
  translateUldType,
} from "~/features/cargo-hold/i18n";
import {
  translateBaggageSource,
  translateCargoUnitKind,
  translateColdChainRegime,
  translateColdChainRisk,
  translateColdChainSolution,
  translateCommodity,
  translateContentClass,
  translateHazardClass,
  translateOffloadReason,
  translateShipmentStatus,
  translateSpecialHandling,
  translateTransferRole,
} from "~/features/cargo-manifest/i18n";
import {
  translateAirportOnFlightType,
  translateEventType,
  translatePassengerStatus,
  translateShortStatus,
  translateSpecialServiceRequest,
  translateStatus,
  translateStatusNextAction,
} from "~/features/flight/i18n";
import { translateNotocStage } from "~/features/notoc/i18n";
import { translatePostcardStatus } from "~/features/postcard/i18n";
import { translateRotationStatus } from "~/features/rotation/i18n";

export const toHuman = {
  aircraft: {
    state: translateAircraftState,
  },
  flight: {
    eventType: translateEventType,
    passengerStatus: translatePassengerStatus,
    specialServiceRequest: translateSpecialServiceRequest,
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
    dataQuality: translateDataQuality,
    onFlightType: translateAirportOnFlightType,
    osm: {
      changeIntent: translateOsmChangeIntent,
      changeStatus: translateOsmChangeStatus,
      pushOutcome: translateOsmPushOutcome,
      record: translateOsmRecord,
      resource: translateOsmResource,
    },
  },
  cargoHold: {
    compartmentLoading: translateCompartmentLoading,
    compartmentName: translateCompartmentName,
    deck: translateHoldDeck,
    doorSide: translateDoorSide,
    positionSide: translatePositionSide,
    uldBase: translateUldBase,
    uldContour: translateUldContour,
    uldType: translateUldType,
  },
  cargoManifest: {
    baggageSource: translateBaggageSource,
    coldChainRegime: translateColdChainRegime,
    coldChainRisk: translateColdChainRisk,
    coldChainSolution: translateColdChainSolution,
    commodity: translateCommodity,
    contentClass: translateContentClass,
    hazardClass: translateHazardClass,
    offloadReason: translateOffloadReason,
    shipmentStatus: translateShipmentStatus,
    specialHandling: translateSpecialHandling,
    transferRole: translateTransferRole,
    unitKind: translateCargoUnitKind,
  },
  notoc: {
    stage: translateNotocStage,
  },
  postcard: {
    status: translatePostcardStatus,
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
