import type { IndexedShipment } from "~/features/cargo-manifest/lib/shipmentIndex";
import type { ColdChainRisk, HazardClass, ShipmentStatus, TransferRole } from "~/features/cargo-manifest/model";

export type LedgerFilters = {
  handlingCode: string;
  hazardClass: HazardClass | "";
  transferRole: TransferRole | "";
  status: ShipmentStatus | "";
  coldChainRisk: ColdChainRisk | "";
};

export const NO_FILTERS: LedgerFilters = {
  handlingCode: "",
  hazardClass: "",
  transferRole: "",
  status: "",
  coldChainRisk: "",
};

export function isFiltering(filters: LedgerFilters): boolean {
  return Object.values(filters).some((value) => value !== "");
}

export function applyFilters(entries: IndexedShipment[], filters: LedgerFilters): IndexedShipment[] {
  return entries.filter(({ shipment }) => {
    if (filters.handlingCode !== "" && !shipment.shc.includes(filters.handlingCode)) {
      return false;
    }
    if (filters.hazardClass !== "" && shipment.dangerousGoods?.hazardClass !== filters.hazardClass) {
      return false;
    }
    if (filters.transferRole !== "" && shipment.transferRole !== filters.transferRole) {
      return false;
    }
    if (filters.status !== "" && shipment.status !== filters.status) {
      return false;
    }
    if (filters.coldChainRisk !== "" && shipment.coldChain?.risk !== filters.coldChainRisk) {
      return false;
    }
    return true;
  });
}

export function handlingCodesPresent(entries: IndexedShipment[]): string[] {
  return [...new Set(entries.flatMap(({ shipment }) => shipment.shc))].sort();
}

export function hazardClassesPresent(entries: IndexedShipment[]): HazardClass[] {
  return [
    ...new Set(
      entries
        .map(({ shipment }) => shipment.dangerousGoods?.hazardClass)
        .filter((value): value is HazardClass => value !== undefined),
    ),
  ].sort();
}

export function transferRolesPresent(entries: IndexedShipment[]): TransferRole[] {
  return [...new Set(entries.map(({ shipment }) => shipment.transferRole))].sort();
}

export function coldChainRisksPresent(entries: IndexedShipment[]): ColdChainRisk[] {
  return [
    ...new Set(
      entries
        .map(({ shipment }) => shipment.coldChain?.risk)
        .filter((value): value is ColdChainRisk => value !== undefined),
    ),
  ];
}

export function statusesPresent(entries: IndexedShipment[]): ShipmentStatus[] {
  return [...new Set(entries.map(({ shipment }) => shipment.status))].sort();
}
