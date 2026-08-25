import {
  CompartmentLoading,
  CompartmentName,
  DoorSide,
  HoldDeckName,
  PositionSide,
  UldBase,
  UldContour,
  UldType,
} from "~/features/cargo-hold/model";

const holdDeckLabels: Record<HoldDeckName, string> = {
  [HoldDeckName.Main]: "Main deck",
  [HoldDeckName.Lower]: "Lower deck",
};

const compartmentNameLabels: Record<CompartmentName, string> = {
  [CompartmentName.Forward]: "Forward",
  [CompartmentName.Aft]: "Aft",
  [CompartmentName.Bulk]: "Bulk",
  [CompartmentName.Main]: "Main",
};

const compartmentLoadingLabels: Record<CompartmentLoading, string> = {
  [CompartmentLoading.Uld]: "Containerised",
  [CompartmentLoading.Loose]: "Loosely loaded",
};

const doorSideLabels: Record<DoorSide, string> = {
  [DoorSide.Left]: "Left side door",
  [DoorSide.Right]: "Right side door",
  [DoorSide.Nose]: "Nose door",
  [DoorSide.None]: "No door",
};

const positionSideLabels: Record<PositionSide, string> = {
  [PositionSide.Left]: "Left",
  [PositionSide.Right]: "Right",
  [PositionSide.Full]: "Full width",
};

const uldBaseLabels: Record<UldBase, string> = {
  [UldBase.K]: "Half-width container base",
  [UldBase.A]: "88 × 125 in pallet base",
  [UldBase.M]: "96 × 125 in pallet base",
};

const uldContourLabels: Record<UldContour, string> = {
  [UldContour.E]: "Contour E",
  [UldContour.H]: "Contour H",
  [UldContour.N]: "Contour N",
  [UldContour.G]: "Contour G",
  [UldContour.C]: "Contour C",
  [UldContour.P]: "Contour P",
  [UldContour.A]: "Contour A",
};

const uldTypeLabels: Record<UldType, string> = {
  [UldType.Ake]: "AKE container",
  [UldType.Akh]: "AKH reduced-height container",
  [UldType.Rkn]: "RKN refrigerated container",
  [UldType.Pmc]: "PMC pallet",
  [UldType.Pag]: "PAG pallet",
  [UldType.Ama]: "AMA main-deck container",
  [UldType.Rap]: "RAP refrigerated pallet",
};

export function translateHoldDeck(deck: HoldDeckName): string {
  return holdDeckLabels[deck] ?? deck;
}

export function translateCompartmentName(name: CompartmentName): string {
  return compartmentNameLabels[name] ?? name;
}

export function translateCompartmentLoading(loading: CompartmentLoading): string {
  return compartmentLoadingLabels[loading] ?? loading;
}

export function translateDoorSide(side: DoorSide): string {
  return doorSideLabels[side] ?? side;
}

export function translatePositionSide(side: PositionSide): string {
  return positionSideLabels[side] ?? side;
}

export function translateUldBase(base: UldBase): string {
  return uldBaseLabels[base] ?? base;
}

export function translateUldContour(contour: UldContour): string {
  return uldContourLabels[contour] ?? contour;
}

export function translateUldType(type: UldType): string {
  return uldTypeLabels[type] ?? type;
}
