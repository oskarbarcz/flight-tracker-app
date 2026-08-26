import { Badge } from "flowbite-react";
import React from "react";
import { ColdChainRisk } from "~/features/cargo-manifest/model";
import type { NotocColdChain } from "~/features/notoc/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  assessment: NotocColdChain;
};

const RISK_COLOR: Record<ColdChainRisk, string> = {
  [ColdChainRisk.High]: "failure",
  [ColdChainRisk.Elevated]: "warning",
  [ColdChainRisk.Low]: "gray",
};

export function ColdChainRow({ assessment }: Props) {
  const isRoutine = assessment.risk === ColdChainRisk.Low;

  return (
    <article className="flex items-baseline gap-3 border-b border-gray-100 py-1.5 last:border-b-0 dark:border-gray-800">
      <span className="flex w-20 shrink-0">
        <Badge color={RISK_COLOR[assessment.risk]} size="xs" className="px-1.5 py-0 text-[10px]">
          {toHuman.cargoManifest.coldChainRisk(assessment.risk)}
        </Badge>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-gray-900 dark:text-white">{assessment.description}</span>
        {!isRoutine && (
          <span className="block text-[11px] text-gray-500 dark:text-gray-400">{assessment.explanation}</span>
        )}
      </span>
      <span className="shrink-0 text-right font-mono text-[11px] text-gray-500 dark:text-gray-400">
        <span className="block">{assessment.marginHours} h margin</span>
        <span className="block">{toHuman.cargoManifest.coldChainRegime(assessment.regime)}</span>
      </span>
    </article>
  );
}
