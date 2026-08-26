export const tonsInput = { type: "number", autoComplete: "off", unit: "tons", decimals: 2 } as const;

export const countInput = { type: "number", autoComplete: "off" } as const;

export const FUEL_STEP_FIELDS = [
  "trip",
  "taxi",
  "alternate",
  "contingencyType",
  "contingencyAmount",
  "reserve",
  "extra",
  "mel",
  "atc",
  "wxx",
  "etops",
  "tankering",
  "averageFuelFlow",
  "maxTanks",
];

export const LOAD_STEP_FIELDS = [
  "pilots",
  "reliefPilots",
  "cabinCrew",
  "passengers",
  "passengersByCabin",
  "cargo",
  "payload",
  "zeroFuelWeight",
];
