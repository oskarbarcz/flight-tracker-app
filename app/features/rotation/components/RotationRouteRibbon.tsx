import React, { useEffect, useState } from "react";
import { FaPlaneUp } from "react-icons/fa6";
import type { Airport } from "~/features/airport";
import { AirportShape } from "~/features/airport/components/Airport/AirportShape";
import type { Rotation, RotationLeg } from "~/features/rotation";
import { RotationStatus } from "~/features/rotation";
import type { LegAirportResponse } from "~/features/rotation/request";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

type LegState = "done" | "active" | "upcoming";

type ResolvedAirport = {
  iataCode: string;
  name: string;
  city: string | null;
  country: string | null;
  shape: Airport["shape"];
};

type NodeItem = { kind: "node"; key: string; airport: ResolvedAirport };
type ConnItem = { kind: "conn"; key: string; leg: RotationLeg; state: LegState };
type GapItem = { kind: "gap"; key: string };
type RailItem = NodeItem | ConnItem | GapItem;

function legState(rotation: Rotation, leg: RotationLeg, activeLegId?: string | null): LegState {
  if (leg.isFlown) {
    return "done";
  }
  if (activeLegId) {
    return leg.id === activeLegId ? "active" : "upcoming";
  }
  if (rotation.status === RotationStatus.InProgress && rotation.legStatus(leg) === "active") {
    return "active";
  }
  return "upcoming";
}

function resolveAirport(airport: LegAirportResponse, byId: Map<string, Airport>): ResolvedAirport {
  const full = byId.get(airport.id);
  return {
    iataCode: airport.iataCode,
    name: full?.name ?? airport.name,
    city: full?.city ?? null,
    country: full?.country ?? null,
    shape: full?.shape ?? null,
  };
}

function buildRail(rotation: Rotation, byId: Map<string, Airport>, activeLegId?: string | null): RailItem[] {
  const ordered = rotation.orderedLegs;
  const items: RailItem[] = [];

  ordered.forEach((leg, index) => {
    const state = legState(rotation, leg, activeLegId);
    if (index === 0) {
      items.push({
        kind: "node",
        key: `n-${leg.id}-dep`,
        airport: resolveAirport(leg.departure, byId),
      });
    } else if (ordered[index - 1].arrival.id !== leg.departure.id) {
      items.push({ kind: "gap", key: `g-${leg.id}` });
      items.push({
        kind: "node",
        key: `n-${leg.id}-dep`,
        airport: resolveAirport(leg.departure, byId),
      });
    }
    items.push({ kind: "conn", key: `c-${leg.id}`, leg, state });
    items.push({
      kind: "node",
      key: `n-${leg.id}-arr`,
      airport: resolveAirport(leg.arrival, byId),
    });
  });

  return items;
}

function lineClass(state: LegState): string {
  const color =
    state === "upcoming" ? "border-gray-300 dark:border-gray-700" : "border-indigo-500 dark:border-indigo-400";
  const dashed = state === "done" ? "" : "border-dashed";
  const width = state === "done" ? "border-l-2 sm:border-l-0 sm:border-t-2" : "border-l sm:border-l-0 sm:border-t";
  return `${color} ${dashed} ${width}`;
}

function planeClass(state: LegState): string {
  return state === "upcoming" ? "text-gray-400 dark:text-gray-600" : "text-indigo-500 dark:text-indigo-400";
}

type Props = {
  rotation: Rotation;
  airports: Airport[];
  activeLegId?: string | null;
};

export function RotationRouteRibbon({ rotation, airports, activeLegId }: Props) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (rotation.legs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
        No legs yet — add legs to plot the route.
      </div>
    );
  }

  const byId = new Map(airports.map((airport) => [airport.id, airport]));
  const items = buildRail(rotation, byId, activeLegId);

  return (
    <div className="-mx-1 flex flex-col items-center gap-1 px-1 pb-1 sm:flex-row sm:items-center sm:gap-3 sm:overflow-x-auto">
      {items.map((item, index) => {
        const enter = drawn ? "" : "motion-safe:translate-y-1 motion-safe:opacity-0";
        const style = { transitionDelay: `${index * 55}ms` };

        if (item.kind === "gap") {
          return (
            <div
              key={item.key}
              className={`flex flex-col items-center gap-1 self-center py-1 transition duration-500 ease-out sm:h-9 sm:flex-row sm:flex-none sm:self-center sm:px-1 sm:py-0 ${enter}`}
              style={style}
            >
              <span className="h-px w-3.5 bg-gray-300 dark:bg-gray-700 sm:h-3.5 sm:w-px" />
              <span className="h-px w-3.5 bg-gray-300 dark:bg-gray-700 sm:h-3.5 sm:w-px" />
            </div>
          );
        }

        if (item.kind === "conn") {
          return (
            <div
              key={item.key}
              className={`flex flex-col items-center gap-1 self-center py-1 transition duration-500 ease-out sm:h-9 sm:min-w-12 sm:flex-1 sm:flex-row sm:gap-1.5 sm:self-center sm:py-0 ${enter}`}
              style={style}
            >
              <span className={`h-4 sm:h-0 sm:flex-1 ${lineClass(item.state)}`} />
              <FaPlaneUp
                className={`flex-none rotate-180 sm:rotate-90 ${planeClass(item.state)}`}
                size={13}
                aria-hidden={true}
              />
              <span className={`h-4 sm:h-0 sm:flex-1 ${lineClass(item.state)}`} />
            </div>
          );
        }

        return (
          <div
            key={item.key}
            className={`flex max-w-64 flex-none items-center gap-2.5 transition duration-500 ease-out sm:max-w-52 ${enter}`}
            style={style}
          >
            <span className="shrink-0">
              <OptionAvatarFrame>
                <AirportShape shape={item.airport.shape} />
              </OptionAvatarFrame>
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="shrink-0 font-mono text-sm font-bold text-gray-900 dark:text-white">
                  {item.airport.iataCode}
                </span>
                <span className="shrink-0 text-gray-300 dark:text-gray-600">|</span>
                <span className="min-w-0 truncate text-xs font-medium text-gray-700 dark:text-gray-200">
                  {item.airport.name}
                </span>
              </div>
              {item.airport.city && item.airport.country && (
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {item.airport.city}, {item.airport.country}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
