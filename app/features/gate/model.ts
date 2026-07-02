export enum GateCategory {
  Schengen = "schengen",
  NonSchengen = "non-schengen",
  Domestic = "domestic",
  International = "international",
}

export type Gate = {
  id: string;
  airportId: string;
  terminalId: string;
  name: string;
  category: GateCategory;
  parkingPositionId: string | null;
};

export const gateCategoryOptions = [
  { value: GateCategory.Schengen, label: "Schengen" },
  { value: GateCategory.NonSchengen, label: "Non-Schengen" },
  { value: GateCategory.Domestic, label: "Domestic" },
  { value: GateCategory.International, label: "International" },
];
