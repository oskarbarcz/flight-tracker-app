export enum BridgeAvailability {
  Yes = "yes",
  No = "no",
}

export enum StairsBoarding {
  No = "no",
  WithBusTransport = "with-bus-transport",
  WithPassengerWalking = "with-passenger-walking",
  WithBusOrPassengerWalking = "with-bus-or-passenger-walking",
}

export enum DeicingCapability {
  No = "no",
  Possible = "possible",
  Recommended = "recommended",
  Mandatory = "mandatory",
}

export enum GroundUnitAvailability {
  No = "no",
  Bridge = "bridge",
  Standalone = "standalone",
  Both = "both",
}

export enum ParkingPositionType {
  Angled = "angled",
  StraightIn = "straight-in",
  AngledTaxiThrough = "angled-taxi-through",
  StraightInTaxiThrough = "straight-in-taxi-through",
}

export enum ParkingSpotType {
  Passenger = "passenger",
  Cargo = "cargo",
  Other = "other",
}

export enum ParkingAssistance {
  None = "none",
  Vdgs = "vdgs",
  Marshaller = "marshaller",
  VdgsOrMarshaller = "vdgs-or-marshaller",
}

export enum GateLocation {
  Remote = "remote",
  Gate = "gate",
}

export enum NoiseSensitivity {
  Yes = "yes",
  No = "no",
}

export enum FuelingOption {
  None = "none",
  Truck = "truck",
  Hydrant = "hydrant",
}

export type Gate = {
  id: string;
  airportId: string;
  terminalId: string;
  name: string;
  bridge: BridgeAvailability;
  stairs: StairsBoarding;
  deicing: DeicingCapability;
  deicingDescription: string | null;
  gpu: GroundUnitAvailability;
  pca: GroundUnitAvailability;
  parkingPositionType: ParkingPositionType;
  parkingSpotType: ParkingSpotType;
  parkingAssistance: ParkingAssistance;
  location: GateLocation;
  noiseSensitivity: NoiseSensitivity;
  noiseSensitivityText: string | null;
  noiseSensitivityStartTime: string | null;
  noiseSensitivityEndTime: string | null;
  fuelingOptions: FuelingOption;
};

export const bridgeOptions = [
  { value: BridgeAvailability.Yes, label: "Yes" },
  { value: BridgeAvailability.No, label: "No" },
];

export const stairsOptions = [
  { value: StairsBoarding.No, label: "No" },
  { value: StairsBoarding.WithBusTransport, label: "With bus transport" },
  { value: StairsBoarding.WithPassengerWalking, label: "With passenger walking" },
  { value: StairsBoarding.WithBusOrPassengerWalking, label: "With bus or passenger walking" },
];

export const deicingOptions = [
  { value: DeicingCapability.No, label: "No" },
  { value: DeicingCapability.Possible, label: "Possible" },
  { value: DeicingCapability.Recommended, label: "Recommended" },
  { value: DeicingCapability.Mandatory, label: "Mandatory" },
];

export const groundUnitOptions = [
  { value: GroundUnitAvailability.No, label: "No" },
  { value: GroundUnitAvailability.Bridge, label: "Bridge" },
  { value: GroundUnitAvailability.Standalone, label: "Standalone" },
  { value: GroundUnitAvailability.Both, label: "Both" },
];

export const parkingPositionTypeOptions = [
  { value: ParkingPositionType.Angled, label: "Angled" },
  { value: ParkingPositionType.StraightIn, label: "Straight-in" },
  { value: ParkingPositionType.AngledTaxiThrough, label: "Angled taxi-through" },
  { value: ParkingPositionType.StraightInTaxiThrough, label: "Straight-in taxi-through" },
];

export const parkingSpotTypeOptions = [
  { value: ParkingSpotType.Passenger, label: "Passenger" },
  { value: ParkingSpotType.Cargo, label: "Cargo" },
  { value: ParkingSpotType.Other, label: "Other" },
];

export const parkingAssistanceOptions = [
  { value: ParkingAssistance.None, label: "None" },
  { value: ParkingAssistance.Vdgs, label: "VDGS" },
  { value: ParkingAssistance.Marshaller, label: "Marshaller" },
  { value: ParkingAssistance.VdgsOrMarshaller, label: "VDGS or marshaller" },
];

export const gateLocationOptions = [
  { value: GateLocation.Gate, label: "Gate" },
  { value: GateLocation.Remote, label: "Remote" },
];

export const noiseSensitivityOptions = [
  { value: NoiseSensitivity.No, label: "No" },
  { value: NoiseSensitivity.Yes, label: "Yes" },
];

export const fuelingOptionsList = [
  { value: FuelingOption.None, label: "None" },
  { value: FuelingOption.Truck, label: "Truck" },
  { value: FuelingOption.Hydrant, label: "Hydrant" },
];
