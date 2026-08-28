import React from "react";
import { twMerge } from "tailwind-merge";
import type { Operator } from "~/features/operator";

const finImages = import.meta.glob("../../../assets/operator/transparent/*.png", {
  eager: true,
  import: "default",
  query: "?url",
});

const finByIcao: Record<string, string> = {};
for (const [path, url] of Object.entries(finImages)) {
  const icao = path.split("/").at(-1)?.replace(".png", "");
  if (icao) {
    finByIcao[icao] = url as string;
  }
}

export function operatorFinUrl(icaoCode: string): string | undefined {
  return finByIcao[icaoCode.toLowerCase()];
}

type Props = {
  operator: Pick<Operator, "icaoCode" | "iataCode" | "shortName"> & { logoUrl?: string | null };
  className?: string;
};

export function OperatorFin({ operator, className }: Props) {
  const fin = operatorFinUrl(operator.icaoCode);

  if (fin) {
    return (
      <img
        src={fin}
        alt={`${operator.shortName} tail fin`}
        loading="lazy"
        className={twMerge("h-full w-full object-contain", className)}
      />
    );
  }

  if (operator.logoUrl) {
    return (
      <img
        src={operator.logoUrl}
        alt={`${operator.shortName} logo`}
        loading="lazy"
        className={twMerge("h-full w-full object-contain", className)}
      />
    );
  }

  return (
    <div className={twMerge("flex h-full w-full items-center justify-center", className)}>
      <span className="font-mono text-2xl font-bold uppercase text-gray-300 dark:text-gray-600">
        {operator.iataCode}
      </span>
    </div>
  );
}
