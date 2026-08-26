import { Badge } from "flowbite-react";
import React from "react";
import { DrillCard } from "~/features/notoc/components/DrillCard";
import type { NotocDangerousGoods } from "~/features/notoc/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  entry: NotocDangerousGoods;
  hasCuratedHold: boolean;
};

export function DangerousGoodsEntry({ entry, hasCuratedHold }: Props) {
  const position = entry.position ?? (hasCuratedHold ? "loose" : "no hold data");
  const packingGroup = entry.packingGroup === null ? "no PG" : `PG ${entry.packingGroup}`;

  return (
    <article className="border-b border-gray-100 py-1.5 last:border-b-0 dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-1">
        <Badge color="warning" size="xs" className="px-1.5 py-0 text-[10px]">
          Class {entry.hazardClass}
        </Badge>
        {entry.subsidiaryRisk !== null && (
          <Badge color="gray" size="xs" className="px-1.5 py-0 text-[10px]">
            Subsidiary {entry.subsidiaryRisk}
          </Badge>
        )}
        {entry.cargoAircraftOnly && (
          <Badge color="failure" size="xs" className="px-1.5 py-0 text-[10px]">
            Cargo aircraft only
          </Badge>
        )}
      </div>

      <div className="mt-0.5 flex items-baseline gap-3">
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-gray-900 dark:text-white">{entry.properShippingName}</span>
          <span className="block text-[11px] text-gray-500 dark:text-gray-400">
            UN{entry.unNumber} · {toHuman.cargoManifest.hazardClass(entry.hazardClass)} · {packingGroup}
          </span>
        </span>
        <span className="shrink-0 text-right font-mono text-[11px] text-gray-500 dark:text-gray-400">
          <span className="block">
            {entry.packages} × {entry.netPerPackage}
          </span>
          <span className="block">
            {position} · {entry.unloadingAirport}
          </span>
        </span>
      </div>

      <details className="mt-1">
        <summary className="cursor-pointer text-[11px] text-gray-500 dark:text-gray-400">
          Emergency response drill {entry.drill.ercCode}
        </summary>
        <div className="mt-1.5">
          <DrillCard drill={entry.drill} />
        </div>
      </details>
    </article>
  );
}
