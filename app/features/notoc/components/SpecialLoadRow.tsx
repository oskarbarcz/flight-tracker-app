import { Badge } from "flowbite-react";
import React from "react";
import { riskOf, SpecialLoadRisk } from "~/features/notoc/lib/specialLoadRisk";
import type { NotocSpecialLoad } from "~/features/notoc/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  load: NotocSpecialLoad;
  hasCuratedHold: boolean;
};

const RISK_COLOR: Record<SpecialLoadRisk, string> = {
  [SpecialLoadRisk.High]: "failure",
  [SpecialLoadRisk.Elevated]: "warning",
  [SpecialLoadRisk.Routine]: "gray",
};

function piece(load: NotocSpecialLoad): string | null {
  const heaviest = load.heaviestPiece;

  if (heaviest === null) {
    return null;
  }

  return `heaviest ${heaviest.kg.toLocaleString()} kg · ${heaviest.lengthCm} × ${heaviest.widthCm} × ${heaviest.heightCm} cm`;
}

export function SpecialLoadRow({ load, hasCuratedHold }: Props) {
  const risk = riskOf(load);
  const heaviest = piece(load);
  const position = load.position ?? (hasCuratedHold ? "loose" : "no hold data");

  return (
    <article className="flex items-baseline gap-3 border-b border-gray-100 py-1.5 last:border-b-0 dark:border-gray-800">
      <span className="flex w-20 shrink-0 flex-wrap gap-1">
        {load.shc.map((code) => (
          <Badge
            key={code}
            color={RISK_COLOR[risk]}
            size="xs"
            className="px-1.5 py-0 text-[10px]"
            title={toHuman.cargoManifest.specialHandling(code)}
          >
            {code}
          </Badge>
        ))}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-gray-900 dark:text-white">{load.description}</span>
        {heaviest !== null && <span className="block text-[11px] text-gray-500 dark:text-gray-400">{heaviest}</span>}
      </span>
      <span className="shrink-0 text-right font-mono text-[11px] text-gray-500 dark:text-gray-400">
        <span className="block">{load.grossKg.toLocaleString()} kg</span>
        <span className="block">
          {position} · {load.unloadingAirport}
        </span>
      </span>
    </article>
  );
}
