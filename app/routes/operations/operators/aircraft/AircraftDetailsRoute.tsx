import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/AircraftDetailsRoute";
import React from "react";
import { Outlet, useLoaderData, useRevalidator } from "react-router";
import { AircraftDetailsHeader } from "~/features/aircraft/components/AircraftDetails/AircraftDetailsHeader";
import { AircraftDetailsTabs } from "~/features/aircraft/components/AircraftDetails/AircraftDetailsTabs";
import type { AircraftDetailsContext } from "~/features/aircraft/components/AircraftDetails/aircraftDetailsContext";
import { AircraftService } from "~/features/aircraft/service";
import { OperatorService } from "~/features/operator/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { SectionHeaderWithBackButton } from "~/shared/ui/Section/SectionHeaderWithBackButton";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const aircraftService = new AircraftService();
  const aircraft = await aircraftService.fetchById(params.operatorId, params.aircraftId).catch(() => null);

  if (!aircraft) {
    return { aircraft: null, history: [], repositions: [], operator: null };
  }

  const [history, repositions, operator] = await Promise.all([
    aircraftService.fetchFlightHistory(params.operatorId, params.aircraftId),
    aircraftService.fetchRepositionHistory(params.operatorId, params.aircraftId),
    new OperatorService().fetchById(params.operatorId),
  ]);

  return { aircraft, history, repositions, operator };
}

export default function AircraftDetailsRoute({ params }: Route.ComponentProps) {
  const { aircraft, history, repositions, operator } = useLoaderData<typeof clientLoader>();
  const revalidator = useRevalidator();

  usePageTitle(aircraft ? `Aircraft ${aircraft.registration}` : "Aircraft not found");

  if (!aircraft || !operator) {
    return (
      <div className="pb-8">
        <SectionHeaderWithBackButton backText="Back to fleet" backUrl={`/operators/${params.operatorId}/fleet`} />
        <ContainerEmptyState>
          This aircraft could not be found. It may have been removed from the fleet.
        </ContainerEmptyState>
      </div>
    );
  }

  const context: AircraftDetailsContext = {
    aircraft,
    history,
    repositions,
    operator,
    operatorId: params.operatorId,
    refresh: () => revalidator.revalidate(),
  };

  return (
    <div className="pb-8">
      <SectionHeaderWithBackButton backText="Back to fleet" backUrl={`/operators/${params.operatorId}/fleet`} />

      <AircraftDetailsHeader
        aircraft={aircraft}
        editUrl={`/operators/${params.operatorId}/aircraft/${aircraft.id}/edit`}
      />

      <div className="mt-4">
        <AircraftDetailsTabs operatorId={params.operatorId} aircraftId={aircraft.id} />
      </div>

      <div className="mt-3">
        <Outlet context={context} />
      </div>
    </div>
  );
}
