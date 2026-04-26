import {
  BridgeAvailability,
  DeicingCapability,
  FuelingOption,
  GateLocation,
  GroundUnitAvailability,
  NoiseSensitivity,
  ParkingAssistance,
  ParkingPositionType,
  ParkingSpotType,
  StairsBoarding,
} from "~/models/gate.model";

export type CreateGateFormData = {
  terminalId: string;
  name: string;
  bridge: BridgeAvailability;
  stairs: StairsBoarding;
  deicing: DeicingCapability;
  deicingDescription: string;
  gpu: GroundUnitAvailability;
  pca: GroundUnitAvailability;
  parkingPositionType: ParkingPositionType;
  parkingSpotType: ParkingSpotType;
  parkingAssistance: ParkingAssistance;
  location: GateLocation;
  noiseSensitivity: NoiseSensitivity;
  noiseSensitivityText: string;
  noiseSensitivityStartTime: string;
  noiseSensitivityEndTime: string;
  fuelingOptions: FuelingOption;
};

export function initCreateGateData(terminalId = ""): CreateGateFormData {
  return {
    terminalId,
    name: "",
    bridge: BridgeAvailability.No,
    stairs: StairsBoarding.No,
    deicing: DeicingCapability.No,
    deicingDescription: "",
    gpu: GroundUnitAvailability.No,
    pca: GroundUnitAvailability.No,
    parkingPositionType: ParkingPositionType.StraightIn,
    parkingSpotType: ParkingSpotType.Passenger,
    parkingAssistance: ParkingAssistance.None,
    location: GateLocation.Gate,
    noiseSensitivity: NoiseSensitivity.No,
    noiseSensitivityText: "",
    noiseSensitivityStartTime: "",
    noiseSensitivityEndTime: "",
    fuelingOptions: FuelingOption.None,
  };
}
