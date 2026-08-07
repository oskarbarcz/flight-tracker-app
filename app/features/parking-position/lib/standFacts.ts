import {
  BridgeAvailability,
  DeicingCapability,
  FuelingOption,
  GroundUnitAvailability,
  ParkingAssistance,
  type ParkingPosition,
  ParkingPositionType,
  ParkingSpotType,
  StairsBoarding,
} from "~/features/parking-position/model";
export type StandFact = {
  text: string;
  available: boolean;
};

export type StandFactGroup = {
  label: string;
  facts: StandFact[];
};

const stairsText: Record<StairsBoarding, string> = {
  [StairsBoarding.No]: "No stairs",
  [StairsBoarding.WithBusTransport]: "Stairs with bus",
  [StairsBoarding.WithPassengerWalking]: "Stairs with walk",
  [StairsBoarding.WithBusOrPassengerWalking]: "Stairs with bus or walk",
};

const positionText: Record<ParkingPositionType, string> = {
  [ParkingPositionType.Angled]: "Angled",
  [ParkingPositionType.StraightIn]: "Straight-in",
  [ParkingPositionType.AngledTaxiThrough]: "Angled taxi-through",
  [ParkingPositionType.StraightInTaxiThrough]: "Straight-in taxi-through",
};

const spotText: Record<ParkingSpotType, string> = {
  [ParkingSpotType.Passenger]: "Passenger",
  [ParkingSpotType.Cargo]: "Cargo",
  [ParkingSpotType.Other]: "Other spot",
};

const assistanceText: Record<ParkingAssistance, string> = {
  [ParkingAssistance.None]: "No guidance",
  [ParkingAssistance.Vdgs]: "VDGS",
  [ParkingAssistance.Marshaller]: "Marshaller",
  [ParkingAssistance.VdgsOrMarshaller]: "VDGS or marshaller",
};

const fuelText: Record<FuelingOption, string> = {
  [FuelingOption.None]: "No fuelling",
  [FuelingOption.Truck]: "Fuel truck",
  [FuelingOption.Hydrant]: "Fuel hydrant",
};

const deicingText: Record<DeicingCapability, string> = {
  [DeicingCapability.No]: "No de-icing",
  [DeicingCapability.Possible]: "De-icing possible",
  [DeicingCapability.Recommended]: "De-icing recommended",
  [DeicingCapability.Mandatory]: "De-icing mandatory",
};

function groundUnitText(unit: string, value: GroundUnitAvailability): string {
  const suffix: Record<GroundUnitAvailability, string> = {
    [GroundUnitAvailability.No]: "",
    [GroundUnitAvailability.Bridge]: " from bridge",
    [GroundUnitAvailability.Standalone]: " standalone",
    [GroundUnitAvailability.Both]: " bridge or standalone",
  };
  return value === GroundUnitAvailability.No ? `No ${unit}` : `${unit}${suffix[value]}`;
}

export function standFactGroups(stand: ParkingPosition): StandFactGroup[] {
  const hasBridge = stand.bridge === BridgeAvailability.Yes;

  return [
    {
      label: "Boarding",
      facts: [
        { text: hasBridge ? "Air bridge" : "No air bridge", available: hasBridge },
        { text: stairsText[stand.stairs], available: stand.stairs !== StairsBoarding.No },
      ],
    },
    {
      label: "Handling",
      facts: [
        { text: positionText[stand.type], available: true },
        { text: spotText[stand.spotType], available: true },
        { text: assistanceText[stand.assistance], available: stand.assistance !== ParkingAssistance.None },
      ],
    },
    {
      label: "Services",
      facts: [
        { text: groundUnitText("GPU", stand.gpu), available: stand.gpu !== GroundUnitAvailability.No },
        { text: groundUnitText("PCA", stand.pca), available: stand.pca !== GroundUnitAvailability.No },
        { text: fuelText[stand.fuelingOptions], available: stand.fuelingOptions !== FuelingOption.None },
        { text: deicingText[stand.deicing], available: stand.deicing !== DeicingCapability.No },
      ],
    },
  ];
}
