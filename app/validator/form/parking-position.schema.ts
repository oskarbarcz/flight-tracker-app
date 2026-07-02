import { type ObjectSchema, object, string } from "yup";
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
} from "~/models";
import type { CreateParkingPositionFormData } from "~/models/form/parking-position.form";
import { coordinatesSchema } from "~/shared/validator/coordinates.schema";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createParkingPositionSchema: ObjectSchema<CreateParkingPositionFormData> = object().shape({
  terminalId: string().required("Terminal is required").uuid("Terminal selection is invalid"),
  name: string().required("Name is required").max(16, "Name must be at most 16 characters"),
  bridge: string<BridgeAvailability>().required().oneOf(Object.values(BridgeAvailability)),
  stairs: string<StairsBoarding>().required().oneOf(Object.values(StairsBoarding)),
  deicing: string<DeicingCapability>().required().oneOf(Object.values(DeicingCapability)),
  deicingDescription: string().default(""),
  gpu: string<GroundUnitAvailability>().required().oneOf(Object.values(GroundUnitAvailability)),
  pca: string<GroundUnitAvailability>().required().oneOf(Object.values(GroundUnitAvailability)),
  type: string<ParkingPositionType>().required().oneOf(Object.values(ParkingPositionType)),
  spotType: string<ParkingSpotType>().required().oneOf(Object.values(ParkingSpotType)),
  assistance: string<ParkingAssistance>().required().oneOf(Object.values(ParkingAssistance)),
  location: string<GateLocation>().required().oneOf(Object.values(GateLocation)),
  noiseSensitivity: string<NoiseSensitivity>().required().oneOf(Object.values(NoiseSensitivity)),
  noiseSensitivityText: string().default(""),
  noiseSensitivityStartTime: string()
    .default("")
    .test("hh-mm", "Use 24h HH:mm format", (value) => !value || TIME_PATTERN.test(value)),
  noiseSensitivityEndTime: string()
    .default("")
    .test("hh-mm", "Use 24h HH:mm format", (value) => !value || TIME_PATTERN.test(value)),
  fuelingOptions: string<FuelingOption>().required().oneOf(Object.values(FuelingOption)),
  coordinates: coordinatesSchema,
});
