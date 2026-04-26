import { LightingType, SurfaceType } from "~/models/runway.model";

export type CreateRunwayFormData = {
  designator: string;
  length: number;
  width: number;
  displace: string;
  trueHeading: string;
  magneticHeading: number;
  elevation: string;
  surfaceType: SurfaceType;
  lightingType: LightingType;
};

export function initCreateRunwayData(): CreateRunwayFormData {
  return {
    designator: "",
    length: 0,
    width: 0,
    displace: "0",
    trueHeading: "",
    magneticHeading: 0,
    elevation: "",
    surfaceType: SurfaceType.Asphalt,
    lightingType: LightingType.Unknown,
  };
}
