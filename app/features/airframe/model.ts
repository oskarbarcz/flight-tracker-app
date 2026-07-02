export enum SpeedUnit {
  Mach = "mach",
  Knots = "knots",
}

export enum PerformanceCode {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
}

export enum WeightCategory {
  Light = "light",
  Medium = "medium",
  Heavy = "heavy",
  Super = "super",
}

export type CruiseSpeed = {
  value: number;
  unit: SpeedUnit;
};

export type Airframe = {
  type: string;
  name: string;
  cruiseSpeed: CruiseSpeed;
  serviceCeiling: number;
  performanceCode: PerformanceCode;
  weightCategory: WeightCategory;
};
