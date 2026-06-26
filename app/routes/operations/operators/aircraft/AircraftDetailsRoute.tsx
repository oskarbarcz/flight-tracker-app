import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/AircraftDetailsRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { AircraftBaseAirportCard } from "~/components/operator/AircraftDetails/AircraftBaseAirportCard";
import { AircraftCurrentStatusCard } from "~/components/operator/AircraftDetails/AircraftCurrentStatusCard";
import { AircraftDetailsHeader } from "~/components/operator/AircraftDetails/AircraftDetailsHeader";
import { AircraftFlightHistoryCard } from "~/components/operator/AircraftDetails/AircraftFlightHistoryCard";
import { AircraftTechnicalStatusCard } from "~/components/operator/AircraftDetails/AircraftTechnicalStatusCard";
import { SectionHeaderWithBackButton } from "~/components/shared/Section/SectionHeaderWithBackButton";
import { deriveAircraftStatus } from "~/functions/aircraftStatus";
import { AircraftService } from "~/state/api/aircraft.service";
import { AirportService } from "~/state/api/airport.service";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const aircraftService = new AircraftService();

  const [aircraft, history, repositions] = await Promise.all([
    aircraftService.fetchById(params.operatorId, params.aircraftId),
    aircraftService.fetchFlightHistory(params.operatorId, params.aircraftId),
    aircraftService.fetchRepositionHistory(params.operatorId, params.aircraftId),
  ]);

  const status = deriveAircraftStatus(aircraft, history);
  const locationAirportId =
    status.kind === "parked" ? (aircraft.lastAirportId ?? status.airport?.id ?? aircraft.baseAirportId ?? null) : null;

  const airportService = new AirportService();
  const [locationAirport, baseAirport] = await Promise.all([
    locationAirportId ? airportService.fetchById(locationAirportId).catch(() => null) : null,
    aircraft.baseAirportId ? airportService.fetchById(aircraft.baseAirportId).catch(() => null) : null,
  ]);

  return { aircraft, history, repositions, locationAirport, baseAirport };
}

export default function AircraftDetailsRoute({ params }: Route.ComponentProps) {
  const { aircraft, history, repositions, locationAirport, baseAirport } = useLoaderData<typeof clientLoader>();

  usePageTitle(`Aircraft ${aircraft.registration}`);

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
          <AircraftBaseAirportCard baseAirport={baseAirport} />
          <AircraftCurrentStatusCard aircraft={aircraft} history={history} locationAirport={locationAirport} />
          <AircraftTechnicalStatusCard />
        </div>
      </div>
    </div>
  );
}
