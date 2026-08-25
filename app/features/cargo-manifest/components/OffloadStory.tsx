import { Badge } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { LuPackageCheck, LuTriangleAlert } from "react-icons/lu";
import type { IndexedShipment } from "~/features/cargo-manifest/lib/shipmentIndex";
import { shipmentIndex } from "~/features/cargo-manifest/lib/shipmentIndex";
import { ShipmentStatus } from "~/features/cargo-manifest/model";
import { toHuman } from "~/i18n/translate";
import { useApi } from "~/shared/api/useApi";
import { PanelEmptyState } from "~/shared/ui/Display/PanelEmptyState";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

type Props = {
  flightId: string;
};

type OffloadState =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; entries: IndexedShipment[]; shipmentCount: number };

export function OffloadStory({ flightId }: Props) {
  const { cargoManifestService } = useApi();
  const [state, setState] = useState<OffloadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    cargoManifestService
      .fetchByFlightId(flightId, ShipmentStatus.Offloaded)
      .then((manifest) => {
        if (!cancelled) {
          setState({
            status: "ready",
            entries: shipmentIndex(manifest),
            shipmentCount: manifest.shipmentCount,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "failed" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cargoManifestService, flightId]);

  if (state.status === "loading") {
    return <LoadingData />;
  }

  if (state.status === "failed") {
    return (
      <PanelEmptyState
        icon={LuTriangleAlert}
        title="Offloaded shipments unavailable"
        body="This list did not load. Reload to try again."
      />
    );
  }

  if (state.entries.length === 0) {
    return (
      <PanelEmptyState
        icon={LuPackageCheck}
        title="Nothing was left behind"
        body="Every shipment raised for this flight is aboard."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {state.shipmentCount} {state.shipmentCount === 1 ? "shipment was" : "shipments were"} left behind.
      </p>

      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {state.entries.map(({ shipment }) => (
          <li key={shipment.awb} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{shipment.awb}</span>
            <span className="min-w-0 flex-1 truncate text-sm text-gray-700 dark:text-gray-200">
              {shipment.description}
            </span>
            {shipment.offloadReason !== null && (
              <Badge color="warning">{toHuman.cargoManifest.offloadReason(shipment.offloadReason)}</Badge>
            )}
            {shipment.offloadedFrom !== null && (
              <Badge color="gray">
                Pulled from <span className="font-mono">{shipment.offloadedFrom}</span>
              </Badge>
            )}
            <span className="w-24 shrink-0 text-right font-mono text-sm tabular-nums text-gray-700 dark:text-gray-200">
              {shipment.grossKg.toLocaleString()} kg
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
