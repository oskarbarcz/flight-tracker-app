export enum HoldDeckName {
  Main = "main",
  Lower = "lower",
}

export enum CompartmentName {
  Forward = "forward",
  Aft = "aft",
  Bulk = "bulk",
  Main = "main",
}

export enum CompartmentLoading {
  Uld = "uld",
  Loose = "loose",
}

export enum DoorSide {
  Left = "left",
  Right = "right",
  Nose = "nose",
  None = "none",
}

export enum PositionSide {
  Left = "L",
  Right = "R",
  Full = "full",
}

export enum UldBase {
  K = "K",
  A = "A",
  M = "M",
}

export enum UldContour {
  E = "E",
  H = "H",
  N = "N",
  G = "G",
  C = "C",
  P = "P",
  A = "A",
}

export enum UldType {
  Ake = "AKE",
  Akh = "AKH",
  Rkn = "RKN",
  Pmc = "PMC",
  Pag = "PAG",
  Ama = "AMA",
  Rap = "RAP",
}

export type HoldPosition = {
  designator: string;
  compartment: number;
  side: PositionSide;
  acceptedBases: UldBase[];
  acceptedContours: UldContour[];
  maxWeightKg: number;
};

export type HoldCompartment = {
  number: number;
  name: CompartmentName;
  loading: CompartmentLoading;
  maxWeightKg: number;
  volumeM3: number;
  heated: boolean;
  ventilated: boolean;
  doorSide: DoorSide;
  positions: HoldPosition[];
};

export type HoldDeck = {
  deck: HoldDeckName;
  compartments: HoldCompartment[];
};

export type HoldVariant = {
  id: string;
  isDefault: boolean;
  decks: HoldDeck[];
};

export type AircraftHoldLayout = {
  type: string;
  variants: HoldVariant[];
};

export function defaultVariantOf(layout: AircraftHoldLayout): HoldVariant | null {
  return layout.variants.find((variant) => variant.isDefault) ?? layout.variants[0] ?? null;
}

export function variantById(layout: AircraftHoldLayout, id: string): HoldVariant | null {
  return layout.variants.find((variant) => variant.id === id) ?? null;
}

export function compartmentsOf(variant: HoldVariant): HoldCompartment[] {
  return variant.decks.flatMap((deck) => deck.compartments);
}

export function positionsOf(variant: HoldVariant): HoldPosition[] {
  return compartmentsOf(variant).flatMap((compartment) => compartment.positions);
}

export function positionCountOf(variant: HoldVariant): number {
  return positionsOf(variant).length;
}

export function isMultiDeck(variant: HoldVariant): boolean {
  return variant.decks.length > 1;
}

export function isPaired(position: HoldPosition): boolean {
  return position.side === PositionSide.Left || position.side === PositionSide.Right;
}

export function ordinalOf(position: HoldPosition): string {
  return isPaired(position) ? position.designator.slice(0, -1) : position.designator;
}
