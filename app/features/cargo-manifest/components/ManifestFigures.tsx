import { Badge } from "flowbite-react";
import React from "react";
import type { FlightCargoManifest } from "~/features/cargo-manifest/model";
import { toHuman } from "~/i18n/translate";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  manifest: FlightCargoManifest;
};

const ABSENT = "—";

function Figure({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <FieldLabel>{label}</FieldLabel>
      <span className="font-mono text-sm font-medium tabular-nums text-gray-900 dark:text-white">{value}</span>
      {caption !== undefined && <span className="text-xs text-gray-500 dark:text-gray-400">{caption}</span>}
    </div>
  );
}

function minutes(value: number | null): string {
  return value === null ? ABSENT : `${value} min`;
}

export function ManifestFigures({ manifest }: Props) {
  const units = manifest.containerCount + manifest.bulkLotCount;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        <Figure label="Cargo" value={`${manifest.cargoKg.toLocaleString()} kg`} caption="Tare included" />
        <Figure
          label="Units"
          value={String(units)}
          caption={`${manifest.containerCount} in devices · ${manifest.bulkLotCount} loose`}
        />
        <Figure label="Shipments" value={String(manifest.shipmentCount)} />
        <Figure label="Dangerous goods" value={String(manifest.dangerousGoodsCount)} />
        <Figure label="Cargo aircraft only" value={String(manifest.cargoAircraftOnlyCount)} />
        <Figure label="Transfers" value={String(manifest.transferCount)} />
        <Figure label="Tightest connection" value={minutes(manifest.tightestConnectionMinutes)} />
        <Figure
          label="Baggage"
          value={
            manifest.bagCount === 0 && manifest.baggageKg === 0 ? ABSENT : `${manifest.baggageKg.toLocaleString()} kg`
          }
          caption={manifest.bagCount === 0 ? undefined : `${manifest.bagCount} bags`}
        />
        <div className="flex flex-col gap-1">
          <FieldLabel>Worst cold chain risk</FieldLabel>
          {manifest.worstColdChainRisk === null ? (
            <span className="font-mono text-sm font-medium tabular-nums text-gray-900 dark:text-white">{ABSENT}</span>
          ) : (
            <span>
              <Badge color={manifest.worstColdChainRisk === "low" ? "success" : "warning"}>
                {toHuman.cargoManifest.coldChainRisk(manifest.worstColdChainRisk)}
              </Badge>
            </span>
          )}
        </div>
      </div>

      {manifest.baggageSource !== null && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Baggage weight {toHuman.cargoManifest.baggageSource(manifest.baggageSource).toLowerCase()}.
        </p>
      )}
    </div>
  );
}
