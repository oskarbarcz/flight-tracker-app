import { Badge } from "flowbite-react";
import React from "react";
import { Link } from "react-router";
import type { Airport } from "~/features/airport/model";
import { translateEtopsPointKind } from "~/features/route/i18n";
import { ABSENT, formatElapsed, formatFeet, formatMetres } from "~/features/route/lib/routeFigures";
import type { EtopsAirport, EtopsPlan, EtopsPoint } from "~/features/route/model";
import { formatDate } from "~/shared/lib/time";
import { AirportIdentity } from "~/shared/ui/Display/AirportIdentity";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { MetaRow } from "~/shared/ui/Display/MetaRow";
import { StatBlock } from "~/shared/ui/Display/StatBlock";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  plan: EtopsPlan;
  airports: Map<string, Airport>;
  alternatesHref?: string;
  airportHref?: (airportId: string) => string;
};

function airportCode(airport: Airport): string {
  return airport.iataCode || airport.icaoCode;
}

function AirportCodeList({ ids, airports }: { ids: string[]; airports: Map<string, Airport> }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const airport = airports.get(id);

        return (
          <span
            key={id}
            title={airport?.name}
            className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {airport === undefined ? ABSENT : airportCode(airport)}
          </span>
        );
      })}
    </span>
  );
}

function PointRow({ point, airports }: { point: EtopsPoint; airports: Map<string, Airport> }) {
  const diversionIds = [...point.diversionAirports]
    .sort((a, b) => a.ordinal - b.ordinal)
    .map((airport) => airport.airportId);

  return (
    <div className="flex flex-col gap-1.5 border-t border-gray-200 pt-3 first:border-0 first:pt-0 dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
          {translateEtopsPointKind(point.kind)}
          {point.ordinal > 1 && (
            <span className="ms-1 font-mono text-gray-500 dark:text-gray-400">{point.ordinal}</span>
          )}
        </span>
        {point.isCritical && <Badge color="gray">Critical for fuel</Badge>}
        <span className="ms-auto font-mono text-sm tabular-nums text-gray-500 dark:text-gray-400">
          {formatElapsed(point.elapsedSeconds)}
        </span>
      </div>
      {diversionIds.length > 0 && (
        <div className="flex items-baseline gap-2">
          <FieldLabel className="shrink-0">Diverts to</FieldLabel>
          <AirportCodeList ids={diversionIds} airports={airports} />
        </div>
      )}
      {point.condition !== null && (
        <MetaRow label="Assumed condition" value={<span className="font-mono">{point.condition}</span>} />
      )}
    </div>
  );
}

function SuitabilityRow({
  entry,
  airport,
  href,
}: {
  entry: EtopsAirport;
  airport: Airport | undefined;
  href?: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 pt-3 first:border-0 first:pt-0 dark:border-gray-800">
      {airport === undefined ? (
        <span className="font-mono text-sm text-gray-500 dark:text-gray-400">Airport unavailable</span>
      ) : (
        <AirportIdentity
          iataCode={airportCode(airport)}
          name={airport.name}
          city={airport.city.name}
          country={airport.country.name}
          shape={airport.shape}
          href={href}
          size="md"
        />
      )}
      <div className="flex flex-col gap-1.5">
        <MetaRow
          label="Usable from"
          value={<span className="font-mono">{formatDate(new Date(entry.suitabilityStart))}</span>}
        />
        <MetaRow
          label="Usable until"
          value={<span className="font-mono">{formatDate(new Date(entry.suitabilityEnd))}</span>}
        />
        <MetaRow label="Planned runway" value={<span className="font-mono">{entry.plannedRunway ?? ABSENT}</span>} />
        <MetaRow
          label="Forecast ceiling"
          value={<span className="font-mono">{formatFeet(entry.forecastCeiling)}</span>}
        />
        <MetaRow
          label="Forecast visibility"
          value={<span className="font-mono">{formatMetres(entry.forecastVisibility)}</span>}
        />
        <MetaRow
          label="Transition alt / level"
          value={
            <span className="font-mono">
              {formatFeet(entry.transitionAltitude)} / {formatFeet(entry.transitionLevel)}
            </span>
          }
        />
      </div>
    </div>
  );
}

export function EtopsPanel({ plan, airports, alternatesHref, airportHref }: Props) {
  return (
    <Container
      header={
        <CardHeader
          title="ETOPS"
          actions={
            alternatesHref && (
              <Link to={alternatesHref} viewTransition className="text-xs font-bold text-primary-500 hover:underline">
                Flight alternates
              </Link>
            )
          }
        />
      }
      padding="spacious"
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <StatBlock
          label="Rule"
          value={plan.ruleMinutes === null ? ABSENT : plan.ruleMinutes}
          unit={plan.ruleMinutes === null ? undefined : " min"}
        />
        <StatBlock
          label="Rule radius"
          value={plan.ruleRadiusNm === null ? ABSENT : Math.round(plan.ruleRadiusNm).toLocaleString("en-GB")}
          unit={plan.ruleRadiusNm === null ? undefined : " nm"}
        />
        <StatBlock
          label="Threshold"
          value={plan.thresholdMinutes === null ? ABSENT : plan.thresholdMinutes}
          unit={plan.thresholdMinutes === null ? undefined : " min"}
        />
        <StatBlock
          label="Threshold radius"
          value={plan.thresholdRadiusNm === null ? ABSENT : Math.round(plan.thresholdRadiusNm).toLocaleString("en-GB")}
          unit={plan.thresholdRadiusNm === null ? undefined : " nm"}
        />
      </div>

      {plan.points.length > 0 && (
        <div className="mt-1 border-t border-gray-200 pt-4 dark:border-gray-800">
          <FieldLabel>Published points</FieldLabel>
          <div className="mt-3 flex flex-col gap-3">
            {plan.points.map((point) => (
              <PointRow key={`${point.kind}-${point.ordinal}`} point={point} airports={airports} />
            ))}
          </div>
        </div>
      )}

      {plan.airports.length > 0 && (
        <div className="mt-1 border-t border-gray-200 pt-4 dark:border-gray-800">
          <FieldLabel>Diversion airports and the window each must be usable for</FieldLabel>
          <div className="mt-3 flex flex-col gap-4">
            {plan.airports.map((entry) => (
              <SuitabilityRow
                key={entry.airportId}
                entry={entry}
                airport={airports.get(entry.airportId)}
                href={airportHref?.(entry.airportId)}
              />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
