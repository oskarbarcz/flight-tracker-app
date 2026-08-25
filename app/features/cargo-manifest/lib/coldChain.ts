import type { IndexedShipment } from "~/features/cargo-manifest/lib/shipmentIndex";
import type { ColdChain } from "~/features/cargo-manifest/model";

export type ColdChainEntry = {
  awb: string;
  description: string;
  coldChain: ColdChain;
  exposureFraction: number;
  marginFraction: number;
};

export function coldChainEntries(shipments: IndexedShipment[]): ColdChainEntry[] {
  return shipments
    .filter(
      (entry): entry is IndexedShipment & { shipment: { coldChain: ColdChain } } => entry.shipment.coldChain !== null,
    )
    .map(({ shipment }) => {
      const coldChain = shipment.coldChain as ColdChain;
      const span = Math.max(coldChain.enduranceHours, coldChain.exposureHours);

      return {
        awb: shipment.awb,
        description: shipment.description,
        coldChain,
        exposureFraction: span === 0 ? 0 : Math.min(coldChain.exposureHours / span, 1),
        marginFraction: span === 0 ? 0 : Math.max(coldChain.marginHours, 0) / span,
      };
    });
}

export function temperatureBand(coldChain: ColdChain): string | null {
  if (coldChain.minC === null || coldChain.maxC === null) {
    return null;
  }
  return `${coldChain.minC} to ${coldChain.maxC} °C`;
}
