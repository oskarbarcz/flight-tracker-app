import React from "react";
import { twMerge } from "tailwind-merge";
import type { Operator } from "~/features/operator";

const finThumbnails = import.meta.glob("../../../assets/operator/thumb/*.jpg", {
  eager: true,
  import: "default",
  query: "?url",
});

const finByIcao: Record<string, string> = {};
for (const [path, url] of Object.entries(finThumbnails)) {
  const icao = path.split("/").at(-1)?.replace(".jpg", "");
  if (icao) {
    finByIcao[icao] = url as string;
  }
}

type Props = {
  operator: Pick<Operator, "icaoCode" | "iataCode" | "shortName"> & { logoUrl?: string | null };
  className?: string;
};

export function OperatorFin({ operator, className }: Props) {
  const fin = finByIcao[operator.icaoCode.toLowerCase()];

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
