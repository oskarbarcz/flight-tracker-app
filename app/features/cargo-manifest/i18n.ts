import {
  BaggageSource,
  CargoUnitKind,
  ColdChainRegime,
  ColdChainRisk,
  ColdChainSolution,
  ContentClass,
  HazardClass,
  OffloadReason,
  ShipmentStatus,
  TransferRole,
} from "~/features/cargo-manifest/model";

const cargoUnitKindLabels: Record<CargoUnitKind, string> = {
  [CargoUnitKind.Uld]: "Unit load device",
  [CargoUnitKind.BulkLot]: "Loose lot",
};

const contentClassLabels: Record<ContentClass, string> = {
  [ContentClass.Cargo]: "Cargo",
  [ContentClass.Baggage]: "Baggage",
  [ContentClass.Mail]: "Mail",
};

const transferRoleLabels: Record<TransferRole, string> = {
  [TransferRole.Local]: "Local",
  [TransferRole.OutboundTransfer]: "Outbound transfer",
  [TransferRole.InboundTransfer]: "Inbound transfer",
  [TransferRole.ThroughTransfer]: "Through transfer",
};

const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  [ShipmentStatus.Loaded]: "Loaded",
  [ShipmentStatus.Offloaded]: "Offloaded",
};

const offloadReasonLabels: Record<OffloadReason, string> = {
  [OffloadReason.PayloadRestriction]: "Payload restriction",
  [OffloadReason.SpaceRestriction]: "Space restriction",
};

const coldChainRegimeLabels: Record<ColdChainRegime, string> = {
  [ColdChainRegime.Crt]: "Controlled room temperature",
  [ColdChainRegime.Col]: "Cool chain",
  [ColdChainRegime.Fro]: "Frozen",
};

const coldChainRiskLabels: Record<ColdChainRisk, string> = {
  [ColdChainRisk.Low]: "Low",
  [ColdChainRisk.Elevated]: "Elevated",
  [ColdChainRisk.High]: "High",
};

const coldChainSolutionLabels: Record<ColdChainSolution, string> = {
  [ColdChainSolution.Active]: "Active container",
  [ColdChainSolution.Passive]: "Passive packaging",
};

const baggageSourceLabels: Record<BaggageSource, string> = {
  [BaggageSource.Reconciled]: "Reconciled from the loadsheet payload",
  [BaggageSource.Derived]: "Derived from the passenger count",
};

const hazardClassLabels: Record<HazardClass, string> = {
  [HazardClass.Explosives]: "Explosives",
  [HazardClass.FlammableGas]: "Flammable gas",
  [HazardClass.NonFlammableGas]: "Non-flammable gas",
  [HazardClass.ToxicGas]: "Toxic gas",
  [HazardClass.FlammableLiquid]: "Flammable liquid",
  [HazardClass.FlammableSolid]: "Flammable solid",
  [HazardClass.SpontaneouslyCombustible]: "Spontaneously combustible",
  [HazardClass.DangerousWhenWet]: "Dangerous when wet",
  [HazardClass.Oxidiser]: "Oxidising substance",
  [HazardClass.OrganicPeroxide]: "Organic peroxide",
  [HazardClass.ToxicSubstance]: "Toxic substance",
  [HazardClass.InfectiousSubstance]: "Infectious substance",
  [HazardClass.Radioactive]: "Radioactive material",
  [HazardClass.Corrosive]: "Corrosive substance",
  [HazardClass.Miscellaneous]: "Miscellaneous dangerous goods",
};

const specialHandlingLabels: Record<string, string> = {
  ACT: "Active temperature-controlled container",
  AVI: "Live animals",
  BIG: "Outsized",
  CAO: "Cargo aircraft only",
  COL: "Cool goods, 2 to 8 °C",
  EAT: "Foodstuffs",
  HEA: "Heavy",
  HUM: "Human remains",
  ICE: "Dry ice",
  PIL: "Pharmaceuticals",
  RFL: "Flammable liquid",
  RLI: "Lithium ion batteries",
};

const commodityLabels: Record<string, string> = {
  "coffee-beans": "Coffee beans",
  "dry-ice": "Dry ice",
  "engine-fan-blades": "Engine fan blades",
  "flowers-roses": "Cut roses",
  horses: "Horses",
  "human-remains": "Human remains",
  "landing-gear": "Landing gear",
  "lithium-ion-standalone": "Lithium ion cells",
  "medical-devices": "Medical devices",
  paint: "Paint",
  "printed-matter": "Printed matter",
  vaccines: "Vaccines",
};

function humanise(slug: string): string {
  const words = slug.split("-").join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function translateCargoUnitKind(kind: CargoUnitKind): string {
  return cargoUnitKindLabels[kind] ?? kind;
}

export function translateContentClass(contentClass: ContentClass): string {
  return contentClassLabels[contentClass] ?? contentClass;
}

export function translateTransferRole(role: TransferRole): string {
  return transferRoleLabels[role] ?? role;
}

export function translateShipmentStatus(status: ShipmentStatus): string {
  return shipmentStatusLabels[status] ?? status;
}

export function translateOffloadReason(reason: OffloadReason): string {
  return offloadReasonLabels[reason] ?? reason;
}

export function translateColdChainRegime(regime: ColdChainRegime): string {
  return coldChainRegimeLabels[regime] ?? regime;
}

export function translateColdChainRisk(risk: ColdChainRisk): string {
  return coldChainRiskLabels[risk] ?? risk;
}

export function translateColdChainSolution(solution: ColdChainSolution): string {
  return coldChainSolutionLabels[solution] ?? solution;
}

export function translateBaggageSource(source: BaggageSource): string {
  return baggageSourceLabels[source] ?? source;
}

export function translateHazardClass(hazardClass: HazardClass): string {
  return hazardClassLabels[hazardClass] ?? hazardClass;
}

export function translateSpecialHandling(code: string): string {
  return specialHandlingLabels[code] ?? code;
}

export function translateCommodity(commodity: string): string {
  return commodityLabels[commodity] ?? humanise(commodity);
}
