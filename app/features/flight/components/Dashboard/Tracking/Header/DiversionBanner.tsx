import React from "react";
import { FaPlaneCircleExclamation } from "react-icons/fa6";
import type { Diversion } from "~/features/diversion";

export function DiversionBanner({ diversion }: { diversion: Diversion }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-500/60 bg-red-50 px-3 py-2 dark:bg-red-950/40">
      <FaPlaneCircleExclamation className="shrink-0 text-red-700 dark:text-red-400" aria-hidden={true} />
      <div className="flex min-w-0 flex-col">
        <span className="text-2xs font-bold uppercase tracking-widest text-red-700 dark:text-red-400">
          Diverting to
        </span>
        <span className="truncate text-sm font-semibold text-red-700 dark:text-red-400">
          <span className="font-mono">{diversion.airport.icaoCode}</span>
          <span className="mx-1.5 text-red-400 dark:text-red-600" aria-hidden={true}>
            ·
          </span>
          {diversion.airport.city.name}
        </span>
      </div>
    </div>
  );
}
