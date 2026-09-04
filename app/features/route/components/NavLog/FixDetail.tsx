import React from "react";
import {
  ABSENT,
  formatAltitude,
  formatBearing,
  formatCelsius,
  formatDistance,
  formatFeet,
  formatFuelFlow,
  formatTonnesFromKilograms,
  formatWind,
} from "~/features/route/lib/routeFigures";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  insight: FixInsight;
  columnCount: number;
  detailId: string;
};

function DetailField({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <FieldLabel>{unit ? `${label} (${unit})` : label}</FieldLabel>
      <div className="mt-0.5 font-mono text-sm font-medium tabular-nums text-gray-800 dark:text-gray-100">{value}</div>
    </div>
  );
}

export function FixDetail({ insight, columnCount, detailId }: Props) {
  const { fix } = insight;

  return (
    <tr id={detailId} className="bg-gray-50 dark:bg-gray-900/60">
      <td colSpan={columnCount} className="px-3 py-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
          <DetailField label="Leg distance" value={formatDistance(fix.distanceNm)} unit="nm" />
          <DetailField label="Leg burn" value={formatTonnesFromKilograms(fix.fuel.leg)} unit="t" />
          <DetailField label="Burn to here" value={formatTonnesFromKilograms(fix.fuel.used)} unit="t" />
          <DetailField label="Min on board" value={formatTonnesFromKilograms(fix.fuel.minimumOnBoard)} unit="t" />
          <DetailField label="Fuel flow" value={formatFuelFlow(fix.fuel.flow)} unit="kg/h" />
          <DetailField label="Track true" value={formatBearing(fix.trackTrue)} />
          <DetailField label="Track mag" value={formatBearing(fix.trackMag)} />
          <DetailField label="ISA deviation" value={formatCelsius(fix.isaDeviation)} unit="°C" />
          <DetailField label="Tropopause" value={formatFeet(fix.tropopause)} />
          <DetailField label="MORA" value={formatFeet(fix.mora)} />
          <DetailField label="FIR" value={fix.fir ?? ABSENT} />
          <DetailField label="Stage" value={fix.stage} />
        </div>

        {fix.wind.levels.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-800">
            <FieldLabel>Wind and temperature by level</FieldLabel>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5">
              {fix.wind.levels.map((level) => (
                <div key={level.altitude} className="flex items-baseline gap-2 font-mono text-sm tabular-nums">
                  <span className="text-gray-500 dark:text-gray-400">{formatAltitude(level.altitude)}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {formatWind(level.direction, level.speed)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{formatCelsius(level.oat)} °C</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
