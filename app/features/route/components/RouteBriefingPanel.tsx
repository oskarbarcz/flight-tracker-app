import React from "react";
import { FaRoute } from "react-icons/fa6";
import type { Flight } from "~/features/flight";
import { ChartLegend } from "~/features/route/components/Chart/ChartLegend";
import { RouteChart } from "~/features/route/components/Chart/RouteChart";
import { EtopsPanel } from "~/features/route/components/Etops/EtopsPanel";
import { FuelMarginNote } from "~/features/route/components/NavLog/FuelMarginNote";
import { NavLog } from "~/features/route/components/NavLog/NavLog";
import { OceanicCrossingPanel } from "~/features/route/components/OceanicCrossingPanel";
import { RoutePlanCard } from "~/features/route/components/RoutePlanCard";
import { useRouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import { hasEtopsContent } from "~/features/route/lib/routeInsights";
import { OceanicRouting } from "~/features/route/model";
import { PanelEmptyState } from "~/shared/ui/Display/PanelEmptyState";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  flight: Flight;
  alternatesHref?: string;
  airportHref?: (airportId: string) => string;
  withChart?: boolean;
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

export function RouteBriefingPanel({ flight, alternatesHref, airportHref, withChart = true }: Props) {
  const state = useRouteBriefingState();
  const { briefing, airports, loading, error, insights, summary, margin, runways, selectedOrdinal, select } = state;

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
    summary === null ||
    (insights.length === 0 && briefing.route.atcRoute === null && briefing.route.route === null);

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

  const plan = briefing.etops !== null && hasEtopsContent(briefing.etops) ? briefing.etops : null;
  const hasOceanic = briefing.oceanicCrossing.routing !== OceanicRouting.Random;

  return (
    <div className="mt-3 flex flex-col gap-3">
      <RoutePlanCard
        flight={flight}
        route={briefing.route}
        summary={summary}
        runways={runways}
        selectedOrdinal={selectedOrdinal}
        onSelect={select}
      />

      {insights.length > 0 && (
        <div
          className={
            withChart ? "grid items-start gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" : "grid items-start"
          }
        >
          <Container
            padding="none"
            className={withChart ? "order-2 xl:order-1" : undefined}
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
              <NavLog insights={insights} selectedOrdinal={selectedOrdinal} onSelect={select} />
            </div>
          </Container>

          {withChart && (
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
                <RouteChart flight={flight} briefing={briefing} state={state} />
              </div>
            </Container>
          )}
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
