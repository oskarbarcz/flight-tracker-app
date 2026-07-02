import type { CreateRunwayFormData } from "~/features/runway/form";
import type { CreateRunwayRequest, GetRunwayResponse } from "~/features/runway/request";

function toNullableInt(value: string): number | null {
  if (value === "") return null;
  return Number(value);
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
    length: input.length,
    width: input.width,
    displace: String(input.displace ?? 0),
    trueHeading: input.trueHeading === null || input.trueHeading === undefined ? "" : String(input.trueHeading),
    magneticHeading: input.magneticHeading,
    elevation: input.elevation === null || input.elevation === undefined ? "" : String(input.elevation),
    surfaceType: input.surfaceType,
    lightingType: input.lightingType,
    latitude: input.coordinates.latitude,
    longitude: input.coordinates.longitude,
  };
}
