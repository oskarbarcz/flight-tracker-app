import { Badge } from "flowbite-react";
import React, { useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import type { Airframe } from "~/features/airframe";
import type { Airport } from "~/features/airport/model";
import { AircraftTypeCard } from "~/features/stats/components/Activity/AircraftTypeCard";
import { AirportVisitCard } from "~/features/stats/components/Activity/AirportVisitCard";
import { BlurReveal } from "~/features/stats/components/BlurReveal";
import type { AircraftTypeStat, UnlockedAirport } from "~/features/stats/model";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { TilePlaceholder } from "~/shared/ui/Layout/TilePlaceholder";

type Props = {
  spanLabel: string;
  airports: UnlockedAirport[];
  aircraftTypes: AircraftTypeStat[];
  airframesByType: Record<string, Airframe>;
  airportsByIcao: Record<string, Airport>;
  airportsUnavailable: boolean;
};

function countLabel(airports: number, types: number): string {
  const parts: string[] = [];
  if (types > 0) {
    parts.push(`${types} ${types === 1 ? "type" : "types"}`);
  }
  if (airports > 0) {
    parts.push(`${airports} ${airports === 1 ? "airport" : "airports"}`);
  }
  return parts.join(" · ");
}

function NothingHere({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-fit rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      {children}
    </span>
  );
}

export function FirstVisits({
  spanLabel,
  airports,
  aircraftTypes,
  airframesByType,
  airportsByIcao,
  airportsUnavailable,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const hasContent = airports.length + aircraftTypes.length > 0;
  const emptyHint = airportsUnavailable
    ? "No first-time aircraft types in this period. New airports are only reported for the current week, month and year."
    : "No first-time airports or aircraft types in this period.";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-8 items-center gap-2.5">
        <FieldLabel className="inline min-w-0 truncate">
          First visits in <span className="text-gray-700 dark:text-gray-200">{spanLabel}</span>
        </FieldLabel>
        {hasContent && (
          <Badge color="gray" size="xs">
            {countLabel(airports.length, aircraftTypes.length)}
          </Badge>
        )}
      </div>

      <BlurReveal
        expanded={expanded}
        onExpand={() => setExpanded(true)}
        label={`Show first visits in ${spanLabel}`}
        overlayLabel="Show first visits"
        contentClassName={hasContent ? "grid grid-cols-1 gap-5 lg:grid-cols-2" : undefined}
      >
        {hasContent ? (
          <>
            <section className="flex min-w-0 flex-col gap-2">
              <FieldLabel>New airports</FieldLabel>
              {airports.length === 0 ? (
                <NothingHere>
                  {airportsUnavailable ? "Only reported for the current period" : "Nothing new"}
                </NothingHere>
              ) : (
                <div className="flex flex-col gap-2">
                  {airports.map((visit) => (
                    <AirportVisitCard
                      key={visit.icaoCode}
                      icaoCode={visit.icaoCode}
                      airport={airportsByIcao[visit.icaoCode]}
                      firstVisitAt={visit.firstVisitAt}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="flex min-w-0 flex-col gap-2">
              <FieldLabel>New aircraft</FieldLabel>
              {aircraftTypes.length === 0 ? (
                <NothingHere>Nothing new</NothingHere>
              ) : (
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {aircraftTypes.map((stat, index) => (
                    <div
                      key={stat.type}
                      className="animate-in fade-in slide-in-from-bottom-1 duration-200 ease-out motion-reduce:animate-none"
                      style={{ animationDelay: `${Math.min(index * 40, 160)}ms` }}
                    >
                      <AircraftTypeCard stat={stat} airframe={airframesByType[stat.type]} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <TilePlaceholder icon={FaMapLocationDot} hint={emptyHint} />
        )}
      </BlurReveal>

      {expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="w-full cursor-pointer rounded-lg py-1 text-center text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-indigo-300 dark:hover:bg-indigo-950"
        >
          Hide
        </button>
      )}
    </div>
  );
}
