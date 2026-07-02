import type { Coordinates } from "~/features/runway/model";
import type { ParkingPosition } from "~/models";

export type CreateParkingPositionRequest = Omit<ParkingPosition, "id" | "airportId" | "coordinates"> & {
  coordinates?: Coordinates | null;
};
export type EditParkingPositionRequest = CreateParkingPositionRequest;
export type GetParkingPositionResponse = ParkingPosition;
