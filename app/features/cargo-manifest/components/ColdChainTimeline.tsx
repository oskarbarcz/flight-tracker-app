import { Badge } from "flowbite-react";
import React from "react";
import { type ColdChainEntry, temperatureBand } from "~/features/cargo-manifest/lib/coldChain";
import { ColdChainRisk } from "~/features/cargo-manifest/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  entries: ColdChainEntry[];
};

const RISK_BAR: Record<ColdChainRisk, string> = {
  [ColdChainRisk.Low]: "bg-green-500",
  [ColdChainRisk.Elevated]: "bg-amber-500",
  [ColdChainRisk.High]: "bg-red-500",
};

const RISK_BADGE: Record<ColdChainRisk, string> = {
  [ColdChainRisk.Low]: "success",
  [ColdChainRisk.Elevated]: "warning",
  [ColdChainRisk.High]: "failure",
};

function hours(value: number): string {
  return `${value} h`;
}

export function ColdChainTimeline({ entries }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Endurance against the exposure this flight and any onward leg impose. For information only — a tight margin will
        not stop the flight being released or the load going aboard.
      </p>

      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {entries.map((entry) => {
          const { coldChain } = entry;
          const band = temperatureBand(coldChain);

          return (
            <li key={entry.awb} className="flex flex-col gap-2 py-3">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{entry.awb}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{entry.description}</span>
                <Badge color="info">{toHuman.cargoManifest.coldChainRegime(coldChain.regime)}</Badge>
                {band !== null && (
                  <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">{band}</span>
                )}
                <Badge color={RISK_BADGE[coldChain.risk]}>
                  {toHuman.cargoManifest.coldChainRisk(coldChain.risk)} risk
                </Badge>
              </div>

              <div className="flex flex-col gap-1">
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${RISK_BAR[coldChain.risk]}`}
                    style={{ width: `${entry.exposureFraction * 100}%` }}
                  />
                </div>
                <div className="flex flex-wrap justify-between gap-x-4 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                  <span>Exposure {hours(coldChain.exposureHours)}</span>
                  <span>Margin {hours(coldChain.marginHours)}</span>
                  <span>Endurance {hours(coldChain.enduranceHours)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {toHuman.cargoManifest.coldChainSolution(coldChain.solution)}
                {coldChain.setPointC !== null && `, set to ${coldChain.setPointC} °C`}. {coldChain.explanation}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
