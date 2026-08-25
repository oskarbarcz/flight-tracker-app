import type { HoldDeckName, UldType } from "~/features/cargo-hold/model";

export enum CargoUnitKind {
  Uld = "uld",
  BulkLot = "bulk_lot",
}

export enum ContentClass {
  Cargo = "cargo",
  Baggage = "baggage",
  Mail = "mail",
}

export enum TransferRole {
  Local = "local",
  OutboundTransfer = "outbound_transfer",
  InboundTransfer = "inbound_transfer",
  ThroughTransfer = "through_transfer",
}

export enum ShipmentStatus {
  Loaded = "loaded",
  Offloaded = "offloaded",
}

export enum OffloadReason {
  PayloadRestriction = "payload_restriction",
  SpaceRestriction = "space_restriction",
}

export enum ColdChainRegime {
  Crt = "CRT",
  Col = "COL",
  Fro = "FRO",
}

export enum ColdChainRisk {
  Low = "low",
  Elevated = "elevated",
  High = "high",
}

export enum ColdChainSolution {
  Active = "active",
  Passive = "passive",
}

export enum BaggageSource {
  Reconciled = "reconciled",
  Derived = "derived",
}

export enum HazardClass {
  Explosives = "1",
  FlammableGas = "2.1",
  NonFlammableGas = "2.2",
  ToxicGas = "2.3",
  FlammableLiquid = "3",
  FlammableSolid = "4.1",
  SpontaneouslyCombustible = "4.2",
  DangerousWhenWet = "4.3",
  Oxidiser = "5.1",
  OrganicPeroxide = "5.2",
  ToxicSubstance = "6.1",
  InfectiousSubstance = "6.2",
  Radioactive = "7",
  Corrosive = "8",
  Miscellaneous = "9",
}

export enum PackingGroup {
  I = "I",
  II = "II",
  III = "III",
}

export type DangerousGoods = {
  unNumber: string;
  properShippingName: string;
  hazardClass: HazardClass;
  subsidiaryRisk: HazardClass | null;
  packingGroup: PackingGroup | null;
  netPerPackage: string;
  cargoAircraftOnly: boolean;
  ercCode: string;
  sourceNote?: string;
};

export type ColdChain = {
  regime: ColdChainRegime;
  minC: number | null;
  maxC: number | null;
  solution: ColdChainSolution;
  setPointC: number | null;
  enduranceHours: number;
  exposureHours: number;
  marginHours: number;
  risk: ColdChainRisk;
  explanation: string;
  advisory: boolean;
};

export type CargoShipmentEntry = {
  awb: string;
  commodity: string;
  description: string;
  pieces: number;
  grossKg: number;
  volumeM3: number;
  shc: string[];
  shipper: string;
  consignee: string;
  origin: string;
  destination: string;
  transferRole: TransferRole;
  onwardCarrier: string | null;
  onwardFlightNumber: string | null;
  connectionMinutes: number | null;
  connectionAtRisk: boolean;
  dangerousGoods: DangerousGoods | null;
  coldChain: ColdChain | null;
  status: ShipmentStatus;
  offloadReason: OffloadReason | null;
  offloadedFrom: string | null;
};

export type CargoUnitEntry = {
  kind: CargoUnitKind;
  uldCode: string | null;
  uldType: UldType | null;
  positionDesignator: string | null;
  compartment: number | null;
  deck: HoldDeckName | null;
  tareKg: number;
  grossKg: number;
  volumeM3: number;
  contentClass: ContentClass;
  beyondDestination: string | null;
  sealed: boolean;
  bagCount: number | null;
  priority: boolean;
  shipments: CargoShipmentEntry[];
};

export type CompartmentLoad = {
  compartment: number;
  deck: HoldDeckName;
  weightKg: number;
  dryIceKg: number;
};

export type FlightCargoManifest = {
  flightId: string;
  holdVariant: string | null;
  cargoKg: number;
  containerCount: number;
  bulkLotCount: number;
  shipmentCount: number;
  dangerousGoodsCount: number;
  worstColdChainRisk: ColdChainRisk | null;
  cargoAircraftOnlyCount: number;
  transferCount: number;
  tightestConnectionMinutes: number | null;
  baggageKg: number;
  bagCount: number;
  baggageSource: BaggageSource | null;
  compartmentLoad: CompartmentLoad[];
  units: CargoUnitEntry[];
};

export function isTransfer(shipment: CargoShipmentEntry): boolean {
  return shipment.transferRole !== TransferRole.Local;
}

export function continuesBeyond(shipment: CargoShipmentEntry): boolean {
  return shipment.onwardFlightNumber !== null;
}

export function unitTotalKg(unit: CargoUnitEntry): number {
  return unit.grossKg + unit.tareKg;
}
