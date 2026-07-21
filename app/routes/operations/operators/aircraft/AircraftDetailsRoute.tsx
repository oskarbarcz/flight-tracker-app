import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/AircraftDetailsRoute";
import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { AircraftBaseAirportCard } from "~/features/aircraft/components/AircraftDetails/AircraftBaseAirportCard";
import { AircraftCurrentStatusCard } from "~/features/aircraft/components/AircraftDetails/AircraftCurrentStatusCard";
import { AircraftDetailsHeader } from "~/features/aircraft/components/AircraftDetails/AircraftDetailsHeader";
import { AircraftFlightHistoryCard } from "~/features/aircraft/components/AircraftDetails/AircraftFlightHistoryCard";
import { AircraftTechnicalStatusCard } from "~/features/aircraft/components/AircraftDetails/AircraftTechnicalStatusCard";
import { RepositionAircraftModal } from "~/features/aircraft/components/AircraftDetails/RepositionAircraftModal";
import { AircraftService } from "~/features/aircraft/service";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { SectionHeaderWithBackButton } from "~/shared/ui/Section/SectionHeaderWithBackButton";

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
          <AircraftTechnicalStatusCard etopsThresholdMinutes={aircraft.etopsThresholdMinutes} />
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
