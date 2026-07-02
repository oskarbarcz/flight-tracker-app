import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/AircraftDetailsRoute";
import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { AircraftBaseAirportCard } from "~/components/operator/AircraftDetails/AircraftBaseAirportCard";
import { AircraftCurrentStatusCard } from "~/components/operator/AircraftDetails/AircraftCurrentStatusCard";
import { AircraftDetailsHeader } from "~/components/operator/AircraftDetails/AircraftDetailsHeader";
import { AircraftFlightHistoryCard } from "~/components/operator/AircraftDetails/AircraftFlightHistoryCard";
import { AircraftTechnicalStatusCard } from "~/components/operator/AircraftDetails/AircraftTechnicalStatusCard";
import { RepositionAircraftModal } from "~/components/operator/AircraftDetails/RepositionAircraftModal";
import { SectionHeaderWithBackButton } from "~/components/shared/Section/SectionHeaderWithBackButton";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { AircraftService } from "~/state/api/aircraft.service";
import { useApi } from "~/state/api/context/useApi";
import { useToast } from "~/state/app/context/useToast";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const aircraftService = new AircraftService();

  const [aircraft, history, repositions] = await Promise.all([
    aircraftService.fetchById(params.operatorId, params.aircraftId),
    aircraftService.fetchFlightHistory(params.operatorId, params.aircraftId),
    aircraftService.fetchRepositionHistory(params.operatorId, params.aircraftId),
  ]);

  return { aircraft, history, repositions };
}

export default function AircraftDetailsRoute({ params }: Route.ComponentProps) {
  const { aircraft, history, repositions } = useLoaderData<typeof clientLoader>();
  const { aircraftService } = useApi();
  const { success, error } = useToast();
  const revalidator = useRevalidator();
  const [isRepositionOpen, setIsRepositionOpen] = useState(false);

  usePageTitle(`Aircraft ${aircraft.registration}`);

  async function handleReposition(destinationAirportId: string) {
    try {
      await aircraftService.createReposition(params.operatorId, aircraft.id, { destinationAirportId });
      success("Aircraft reposition scheduled.");
      setIsRepositionOpen(false);
      revalidator.revalidate();
    } catch {
      error("Failed to reposition aircraft.");
    }
  }

  return (
    <div className="pb-8">
      <SectionHeaderWithBackButton backText="Back to fleet" backUrl={`/operators/${params.operatorId}/fleet`} />

      <AircraftDetailsHeader
        aircraft={aircraft}
        editUrl={`/operators/${params.operatorId}/aircraft/${aircraft.id}/edit`}
      />

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AircraftFlightHistoryCard history={history} repositions={repositions} />
        </div>
        <div className="flex flex-col gap-3">
          <AircraftBaseAirportCard baseAirport={aircraft.baseAirport} />
          <AircraftCurrentStatusCard
            aircraft={aircraft}
            history={history}
            onReposition={() => setIsRepositionOpen(true)}
          />
          <AircraftTechnicalStatusCard />
        </div>
      </div>

      {isRepositionOpen && (
        <RepositionAircraftModal
          aircraft={aircraft}
          reposition={handleReposition}
          cancel={() => setIsRepositionOpen(false)}
        />
      )}
    </div>
  );
}
