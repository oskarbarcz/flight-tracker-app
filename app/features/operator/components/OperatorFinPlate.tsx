import React from "react";
import { twMerge } from "tailwind-merge";
import type { Operator } from "~/features/operator";
import { OperatorFin } from "~/features/operator/components/OperatorFin";

const fins = import.meta.glob("../../../assets/operator/*.png", {
  eager: true,
  import: "default",
  query: "?url",
});

const finByIcao: Record<string, string> = {};
for (const [path, url] of Object.entries(fins)) {
  const icao = path.split("/").at(-1)?.replace(".png", "");
  if (icao) {
    finByIcao[icao] = url as string;
  }
}

type Props = {
  operator: Operator;
  className?: string;
};

export function OperatorFinPlate({ operator, className }: Props) {
  const fin = finByIcao[operator.icaoCode.toLowerCase()];

  return (
    <div
      className={twMerge(
        "flex aspect-square shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700",
        className,
      )}
    >
      {fin ? (
        <img src={fin} alt={`${operator.shortName} tail fin`} className="size-full object-contain mix-blend-multiply" />
      ) : (
        <OperatorFin operator={operator} />
      )}
    </div>
  );
}
