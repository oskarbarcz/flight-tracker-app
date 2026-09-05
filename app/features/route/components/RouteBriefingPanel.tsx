import React, { useMemo, useState } from "react";
import { FaRoute } from "react-icons/fa6";
import type { Flight } from "~/features/flight";
import { ChartLegend } from "~/features/route/components/Chart/ChartLegend";
import { RouteChart } from "~/features/route/components/Chart/RouteChart";
import { EtopsPanel } from "~/features/route/components/Etops/EtopsPanel";
import { FuelMarginNote } from "~/features/route/components/NavLog/FuelMarginNote";
import { NavLog } from "~/features/route/components/NavLog/NavLog";
import { OceanicCrossingPanel } from "~/features/route/components/OceanicCrossingPanel";
import { RoutePlanCard } from "~/features/route/components/RoutePlanCard";
import { useRouteBriefing } from "~/features/route/hooks/useRouteBriefing";
import {
  buildFixInsights,
  hasEtopsContent,
  summariseFuelMargin,
  summariseRoute,
} from "~/features/route/lib/routeInsights";
import { OceanicRouting } from "~/features/route/model";
import { useAssignedRunways } from "~/features/runway/hooks/useAssignedRunways";
import { PanelEmptyState } from "~/shared/ui/Display/PanelEmptyState";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  flight: Flight;
  alternatesHref?: string;
  airportHref?: (airportId: string) => string;
};

function BriefingSkeleton() {
  return (
    <div className="mt-3 flex animate-pulse flex-col gap-3">
      <div className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800" />
      <div className="grid gap-3 xl:grid-cols-2">
        <div className="h-96 rounded-2xl bg-gray-100 dark:bg-gray-800" />
        <div className="h-96 rounded-2xl bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function RouteBriefingPanel({ flight, alternatesHref, airportHref }: Props) {
  const { briefing, airports, loading, error } = useRouteBriefing(flight.id);
  const runways = useAssignedRunways(flight);
  const [selectedOrdinal, setSelectedOrdinal] = useState<number | null>(null);
  const [hasChosen, setHasChosen] = useState(false);

  const analysis = useMemo(() => {
    if (briefing === null) {
      return null;
    }

    const insights = buildFixInsights(briefing.route.fixes);

    return {
      insights,
      summary: summariseRoute(briefing.route),
      margin: summariseFuelMargin(insights),
    };
  }, [briefing]);

  if (loading) {
    return <BriefingSkeleton />;
  }

  if (error !== null) {
    return (
      <div className="mt-3">
        <PanelEmptyState
          icon={FaRoute}
          title="Route could not be loaded"
          body="The planned route did not come back from the API. Reload the page to try again."
        />
      </div>
    );
  }

  const noPlan =
    briefing === null ||
    analysis === null ||
    (analysis.insights.length === 0 && briefing.route.atcRoute === null && briefing.route.route === null);

  if (noPlan) {
    return (
      <div className="mt-3">
        <PanelEmptyState
          icon={FaRoute}
          title="No planned route"
          body="This flight carries no filed plan, so there are no fixes, no oceanic track and no ETOPS briefing to show."
        />
      </div>
    );
  }

  const { insights, summary, margin } = analysis;

  const emphasised = margin !== null && !margin.isConstant ? margin.tightest.fix.ordinal : insights[0]?.fix.ordinal;
  const pinned = hasChosen ? selectedOrdinal : (emphasised ?? null);

  const select = (ordinal: number) => {
    setHasChosen(true);
    setSelectedOrdinal(ordinal);
  };

  const plan = briefing.etops !== null && hasEtopsContent(briefing.etops) ? briefing.etops : null;
  const hasOceanic = briefing.oceanicCrossing.routing !== OceanicRouting.Random;

  return (
    <div className="mt-3 flex flex-col gap-3">
      <RoutePlanCard
        flight={flight}
        route={briefing.route}
        summary={summary}
        runways={runways}
        selectedOrdinal={pinned}
        onSelect={select}
      />

      {insights.length > 0 && (
        <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <Container
            padding="none"
            className="order-2 xl:order-1"
            header={<CardHeader title={`Nav log · ${insights.length} fixes`} />}
            footer={
              margin !== null && (
                <div className="border-t border-gray-200 px-3.5 py-3 dark:border-gray-700">
                  <FuelMarginNote margin={margin} onSelect={select} />
                </div>
              )
            }
          >
            <div className="max-h-[30rem] overflow-y-auto">
              <NavLog insights={insights} selectedOrdinal={pinned} onSelect={select} />
            </div>
          </Container>

          <Container
            padding="none"
            className="order-1 xl:order-2"
            header={<CardHeader title="Chart" />}
            footer={
              <div className="border-t border-gray-200 px-3.5 py-3 dark:border-gray-700">
                <ChartLegend
                  hasTrack={hasOceanic}
                  hasRings={(plan?.airports.length ?? 0) > 0}
                  hasPoints={(plan?.points.length ?? 0) > 0}
                />
              </div>
            }
          >
            <div className="h-72 w-full xl:h-[30rem]">
              <RouteChart
                flight={flight}
                briefing={briefing}
                airports={airports}
                insights={insights}
                runways={runways}
                selectedOrdinal={pinned}
                onSelect={select}
              />
            </div>
          </Container>
        </div>
      )}

      {(hasOceanic || plan !== null) && (
        <div className="grid items-start gap-3 xl:grid-cols-2">
          {hasOceanic && <OceanicCrossingPanel crossing={briefing.oceanicCrossing} />}
          {plan !== null && (
            <EtopsPanel plan={plan} airports={airports} alternatesHref={alternatesHref} airportHref={airportHref} />
          )}
        </div>
      )}
    </div>
  );
}
