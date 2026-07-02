import type { ParkingPosition } from "~/features/parking-position";
import type { Coordinates } from "~/features/runway/model";

export type CreateParkingPositionRequest = Omit<ParkingPosition, "id" | "airportId" | "coordinates"> & {
  coordinates?: Coordinates | null;
};
export type EditParkingPositionRequest = CreateParkingPositionRequest;
export type GetParkingPositionResponse = ParkingPosition;
