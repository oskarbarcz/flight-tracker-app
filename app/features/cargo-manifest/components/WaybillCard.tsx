import { Badge } from "flowbite-react";
import React from "react";
import type { IndexedShipment } from "~/features/cargo-manifest/lib/shipmentIndex";
import { continuesBeyond } from "~/features/cargo-manifest/model";
import { toHuman } from "~/i18n/translate";
import { SpecRow } from "~/shared/ui/Display/SpecRow";

type Props = {
  entry: IndexedShipment;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</span>
      {children}
    </div>
  );
}

export function WaybillCard({ entry }: Props) {
  const { shipment, unit } = entry;
  const dg = shipment.dangerousGoods;
  const cold = shipment.coldChain;

  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Section title="Consignment">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{shipment.description}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {toHuman.cargoManifest.commodity(shipment.commodity)}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {shipment.shipper} → {shipment.consignee}
          </p>
        </Section>

        <dl className="grid h-fit grid-cols-[auto_auto] gap-x-3 gap-y-2">
          <SpecRow label="Pieces" value={String(shipment.pieces)} />
          <SpecRow label="Gross weight" value={`${shipment.grossKg.toLocaleString()} kg`} />
          <SpecRow label="Volume" value={`${shipment.volumeM3} m³`} />
          <SpecRow label="Loaded in" value={unit.uldCode ?? "Loose"} />
        </dl>
      </div>

      <Section title="Routing">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
            {shipment.origin} → {shipment.destination}
          </span>
          <Badge color="gray">{toHuman.cargoManifest.transferRole(shipment.transferRole)}</Badge>
          {continuesBeyond(shipment) && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                continues on <span className="font-mono font-semibold">{shipment.onwardFlightNumber}</span>
                {shipment.onwardCarrier !== null && ` (${shipment.onwardCarrier})`}
              </span>
              {shipment.connectionMinutes !== null && (
                <Badge color={shipment.connectionAtRisk ? "warning" : "gray"}>
                  {shipment.connectionAtRisk
                    ? `${shipment.connectionMinutes} min — at risk`
                    : `${shipment.connectionMinutes} min to connect`}
                </Badge>
              )}
            </>
          )}
        </div>
      </Section>

      {shipment.shc.length > 0 && (
        <Section title="Handling">
          <ul className="flex flex-wrap gap-1.5">
            {shipment.shc.map((code) => (
              <li key={code}>
                <Badge color="gray">
                  <span className="font-mono">{code}</span>
                  <span className="ml-1.5 font-normal normal-case">{toHuman.cargoManifest.specialHandling(code)}</span>
                </Badge>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {dg !== null && (
        <Section title="Dangerous goods">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">UN{dg.unNumber}</span>
            <span className="text-sm text-gray-700 dark:text-gray-200">{dg.properShippingName}</span>
            <Badge color="warning">
              Class {dg.hazardClass} · {toHuman.cargoManifest.hazardClass(dg.hazardClass)}
            </Badge>
            {dg.cargoAircraftOnly && <Badge color="failure">Cargo aircraft only</Badge>}
          </div>
          <dl className="mt-1 grid w-fit grid-cols-[auto_auto] gap-x-3 gap-y-2">
            <SpecRow label="Subsidiary risk" value={dg.subsidiaryRisk} />
            <SpecRow label="Packing group" value={dg.packingGroup} />
            <SpecRow label="Net per package" value={dg.netPerPackage} />
            <SpecRow label="Response code" value={dg.ercCode} />
          </dl>
          {dg.sourceNote !== undefined && (
            <p className="mt-1 max-w-prose text-xs text-gray-500 dark:text-gray-400">{dg.sourceNote}</p>
          )}
        </Section>
      )}

      {cold !== null && (
        <Section title="Cold chain">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="info">{toHuman.cargoManifest.coldChainRegime(cold.regime)}</Badge>
            <Badge color={cold.risk === "low" ? "success" : "warning"}>
              {toHuman.cargoManifest.coldChainRisk(cold.risk)} risk
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {toHuman.cargoManifest.coldChainSolution(cold.solution)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{cold.explanation}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            For information only — this assessment will not stop the flight being released or the load going aboard.
          </p>
        </Section>
      )}
    </div>
  );
}
