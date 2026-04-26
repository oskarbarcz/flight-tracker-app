export enum SurfaceType {
  Asphalt = "asphalt",
  Concrete = "concrete",
  Grass = "grass",
  Gravel = "gravel",
  Unknown = "unknown",
}

export enum LightingType {
  HIRL = "HIRL",
  MIRL = "MIRL",
  LIRL = "LIRL",
  ALS = "ALS",
  Unknown = "unknown",
}

export type Runway = {
  id: string;
  airportId: string;
  designator: string;
  length: number;
  width: number;
  displace: number | null;
  trueHeading: number | null;
  magneticHeading: number;
  elevation: number | null;
  surfaceType: SurfaceType;
  lightingType: LightingType;
};

export const surfaceTypeOptions = [
  { value: SurfaceType.Asphalt, label: "Asphalt" },
  { value: SurfaceType.Concrete, label: "Concrete" },
  { value: SurfaceType.Grass, label: "Grass" },
  { value: SurfaceType.Gravel, label: "Gravel" },
  { value: SurfaceType.Unknown, label: "Unknown" },
];

export const lightingTypeOptions = [
  { value: LightingType.HIRL, label: "HIRL — High Intensity" },
  { value: LightingType.MIRL, label: "MIRL — Medium Intensity" },
  { value: LightingType.LIRL, label: "LIRL — Low Intensity" },
  { value: LightingType.ALS, label: "ALS — Approach Lighting System" },
  { value: LightingType.Unknown, label: "Unknown" },
];
