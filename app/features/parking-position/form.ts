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
} from "~/features/parking-position/model";
import type { Coordinates } from "~/shared/models/coordinates";

export type CreateParkingPositionFormData = {
  terminalId: string;
  name: string;
  bridge: BridgeAvailability;
  stairs: StairsBoarding;
  deicing: DeicingCapability;
  deicingDescription: string;
  gpu: GroundUnitAvailability;
  pca: GroundUnitAvailability;
  type: ParkingPositionType;
  spotType: ParkingSpotType;
  assistance: ParkingAssistance;
  location: GateLocation;
  noiseSensitivity: NoiseSensitivity;
  noiseSensitivityText: string;
  noiseSensitivityStartTime: string;
  noiseSensitivityEndTime: string;
  fuelingOptions: FuelingOption;
  coordinates: Coordinates | null;
};

export function initCreateParkingPositionData(terminalId = ""): CreateParkingPositionFormData {
  return {
    terminalId,
    name: "",
    bridge: BridgeAvailability.No,
    stairs: StairsBoarding.No,
    deicing: DeicingCapability.No,
    deicingDescription: "",
    gpu: GroundUnitAvailability.No,
    pca: GroundUnitAvailability.No,
    type: ParkingPositionType.StraightIn,
    spotType: ParkingSpotType.Passenger,
    assistance: ParkingAssistance.None,
    location: GateLocation.Gate,
    noiseSensitivity: NoiseSensitivity.No,
    noiseSensitivityText: "",
    noiseSensitivityStartTime: "",
    noiseSensitivityEndTime: "",
    fuelingOptions: FuelingOption.None,
    coordinates: null,
  };
}
