import React, { useMemo } from "react";
import type { Flight } from "~/features/flight";
import { FiledRoute } from "~/features/route/components/FiledRoute/FiledRoute";
import { RouteTiming } from "~/features/route/components/RouteTiming";
import { parseFiledRoute, type RouteEndpoint } from "~/features/route/lib/filedRoute";
import {
  ABSENT,
  formatAltitude,
  formatDistance,
  formatElapsed,
  formatTonnesFromKilograms,
} from "~/features/route/lib/routeFigures";
import type { RouteSummary } from "~/features/route/lib/routeInsights";
import { summariseTiming } from "~/features/route/lib/routeTiming";
import type { PlannedRoute } from "~/features/route/model";
import type { AssignedRunways } from "~/features/runway/hooks/useAssignedRunways";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { StatBlock } from "~/shared/ui/Display/StatBlock";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  flight: Flight;
  route: PlannedRoute;
  summary: RouteSummary;
  runways: AssignedRunways;
  selectedOrdinal: number | null;
  onSelect: (ordinal: number) => void;
};

function cruiseLevelLabel(levelsFeet: number[]): string {
  return levelsFeet.length > 1 ? "Initial crz alt" : "Cruise alt";
}

function cruiseLevelValue(levelsFeet: number[]): string {
  const initial = levelsFeet[0];

  return initial === undefined ? ABSENT : formatAltitude(initial);
}

export function RoutePlanCard({ flight, route, summary, runways, selectedOrdinal, onSelect }: Props) {
  const departureIcao = flight.departureAirport.icaoCode;
  const destinationIcao = flight.destinationAirport.icaoCode;
  const departureRunway = runways.departure?.designator ?? null;
  const arrivalRunway = runways.arrival?.designator ?? null;

  const endpoints = useMemo<{ departure: RouteEndpoint; destination: RouteEndpoint }>(
    () => ({
      departure: { icao: departureIcao, runway: departureRunway },
      destination: { icao: destinationIcao, runway: arrivalRunway },
    }),
    [departureIcao, destinationIcao, departureRunway, arrivalRunway],
  );

  const tokens = useMemo(() => parseFiledRoute(route, endpoints.departure, endpoints.destination), [route, endpoints]);

  const { timesheet } = flight;
  const takeoff = timesheet.actual?.takeoffTime ?? (timesheet.estimated ?? timesheet.scheduled).takeoffTime;
  const timing = summariseTiming(route, takeoff);

  return (
    <Container padding="spacious" header={<CardHeader title="Planned route" />}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <StatBlock
          label="Distance"
          value={summary.totalDistanceNm === null ? ABSENT : formatDistance(summary.totalDistanceNm)}
          unit={summary.totalDistanceNm === null ? undefined : " nm"}
        />
        <StatBlock
          label="Time en route"
          value={summary.totalElapsedSeconds === null ? ABSENT : formatElapsed(summary.totalElapsedSeconds)}
        />
        <StatBlock
          label="Trip fuel"
          value={formatTonnesFromKilograms(summary.tripFuelKg)}
          unit={summary.tripFuelKg === null ? undefined : " t"}
        />
        <StatBlock
          label={cruiseLevelLabel(summary.cruiseLevelsFeet)}
          value={cruiseLevelValue(summary.cruiseLevelsFeet)}
        />
      </div>

      {tokens.length > 0 && (
        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <FieldLabel>Route</FieldLabel>
          <div className="mt-2">
            <FiledRoute tokens={tokens} selectedOrdinal={selectedOrdinal} onSelect={onSelect} />
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
        <RouteTiming timing={timing} cruiseLevelsFeet={summary.cruiseLevelsFeet} departureRunway={departureRunway} />
      </div>
    </Container>
  );
}
