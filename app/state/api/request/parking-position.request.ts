import type { ParkingPosition } from "~/models";
import type { Coordinates } from "~/models/runway.model";

export type CreateParkingPositionRequest = Omit<ParkingPosition, "id" | "airportId" | "coordinates"> & {
  coordinates?: Coordinates | null;
};
export type EditParkingPositionRequest = CreateParkingPositionRequest;
export type GetParkingPositionResponse = ParkingPosition;
