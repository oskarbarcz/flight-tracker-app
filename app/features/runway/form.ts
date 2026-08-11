import { LightingType, SurfaceType } from "~/features/runway/model";

export type CreateRunwayFormData = {
  designator: string;
  length: string;
  width: string;
  displace: string;
  trueHeading: string;
  magneticHeading: string;
  elevation: string;
  surfaceType: SurfaceType;
  lightingType: LightingType;
  latitude: number;
  longitude: number;
};

export function initCreateRunwayData(): CreateRunwayFormData {
  return {
    designator: "",
    length: "",
    width: "",
    displace: "",
    trueHeading: "",
    magneticHeading: "",
    elevation: "",
    surfaceType: SurfaceType.Asphalt,
    lightingType: LightingType.Unknown,
    latitude: 0,
    longitude: 0,
  };
}
