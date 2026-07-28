import React from "react";
import type { RouteStop } from "~/features/rotation";

type Props = {
  stops: RouteStop[];
};

export function RotationRouteChain({ stops }: Props) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-1.5 font-mono text-sm font-bold text-gray-700 dark:text-gray-200">
      {stops.map((stop, index) => (
        <React.Fragment key={stop.key}>
          {index > 0 && <span className="text-gray-500 dark:text-gray-400">→</span>}
          <span>{stop.iataCode}</span>
        </React.Fragment>
      ))}
    </span>
  );
}
