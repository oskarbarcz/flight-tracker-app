import type { HoldDeckName } from "~/features/cargo-hold/model";
import type { ColdChainRegime, ColdChainRisk, HazardClass, PackingGroup } from "~/features/cargo-manifest/model";

export enum NotocStage {
  Preliminary = "preliminary",
  Final = "final",
}

export type NotocDrill = {
  ercCode: string;
  inherentRisk: string;
  riskToAircraftAndOccupants: string;
  spillAndFireProcedure: string;
  additionalRisks: string[];
};

export type NotocDangerousGoods = {
  awb: string;
  unNumber: string;
  properShippingName: string;
  hazardClass: HazardClass;
  subsidiaryRisk: HazardClass | null;
  packingGroup: PackingGroup | null;
  packages: number;
  netPerPackage: string;
  cargoAircraftOnly: boolean;
  position: string | null;
  compartment: number | null;
  unloadingAirport: string;
  drill: NotocDrill;
};

export type NotocHeaviestPiece = {
  kg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

export type NotocSpecialLoad = {
  awb: string;
  description: string;
  shc: string[];
  grossKg: number;
  position: string | null;
  compartment: number | null;
  unloadingAirport: string;
  heaviestPiece: NotocHeaviestPiece | null;
};

export type NotocColdChain = {
  awb: string;
  description: string;
  regime: ColdChainRegime;
  risk: ColdChainRisk;
  marginHours: number;
  explanation: string;
  advisory: boolean;
};

export type NotocCompartmentLoad = {
  compartment: number;
  deck: HoldDeckName;
  weightKg: number;
  dryIceKg: number;
};

export type NotocLoadSummary = {
  compartments: NotocCompartmentLoad[];
  containerCount: number;
  palletCount: number;
  looseLotCount: number;
  cargoKg: number;
  baggageKg: number;
  deadloadKg: number;
  beyondCount: number;
  tightestConnectionMinutes: number | null;
};

export type NotocDocument = {
  statement: string;
  dangerousGoods: NotocDangerousGoods[];
  specialLoads: NotocSpecialLoad[];
  coldChain: NotocColdChain[];
  summary: NotocLoadSummary;
};

export type NotocChanges = {
  changed: boolean;
  dangerousGoodsAdded: string[];
  dangerousGoodsRemoved: string[];
  specialLoadsAdded: string[];
  specialLoadsRemoved: string[];
  repositioned: string[];
  cargoChangeKg: number;
  deadloadChangeKg: number;
};

export type FlightNotoc = {
  flightId: string;
  stage: NotocStage;
  issuedAt: string;
  acknowledgedById: string | null;
  acknowledgedAt: string | null;
  document: NotocDocument;
  changes: NotocChanges | null;
};
