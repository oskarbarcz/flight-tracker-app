import type { CreateRunwayFormData } from "~/features/runway/form";
import type { CreateRunwayRequest, GetRunwayResponse } from "~/features/runway/request";

function toNullableInt(value: string): number | null {
  if (value === "") return null;
  return Number(value);
}

function fromNullableInt(value: number | null | undefined): string {
  return value === null || value === undefined ? "" : String(value);
}

export function runwayFormDataToRequest(input: CreateRunwayFormData): CreateRunwayRequest {
  return {
    designator: input.designator.trim().toUpperCase(),
    length: Number(input.length),
    width: Number(input.width),
    displace: toNullableInt(input.displace),
    trueHeading: toNullableInt(input.trueHeading),
    magneticHeading: Number(input.magneticHeading),
    elevation: toNullableInt(input.elevation),
    surfaceType: input.surfaceType,
    lightingType: input.lightingType,
    coordinates: {
      latitude: Number(input.latitude),
      longitude: Number(input.longitude),
    },
  };
}

export function runwayToFormData(input: GetRunwayResponse): CreateRunwayFormData {
  return {
    designator: input.designator,
    length: String(input.length),
    width: String(input.width),
    displace: fromNullableInt(input.displace),
    trueHeading: fromNullableInt(input.trueHeading),
    magneticHeading: String(input.magneticHeading),
    elevation: fromNullableInt(input.elevation),
    surfaceType: input.surfaceType,
    lightingType: input.lightingType,
    latitude: input.coordinates.latitude,
    longitude: input.coordinates.longitude,
  };
}
