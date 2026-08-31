import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightLoadsheetRoute";
import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { FlightStatus, type Loadsheet } from "~/features/flight";
import { FuelAndLoadsheetPanel } from "~/features/flight/components/FuelAndLoadsheet/FuelAndLoadsheetPanel";
import { UpdatePreliminaryLoadsheetModal } from "~/features/flight/components/Modal/UpdatePreliminaryLoadsheetModal";
import { describeLoadsheetRefusal } from "~/features/flight/lib/loadsheetRefusal";
import { FlightService } from "~/features/flight/service";
import { useApi } from "~/shared/api/useApi";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const service = new FlightService();
  const [flight, loadsheets] = await Promise.all([service.fetchById(params.id), service.fetchLoadsheets(params.id)]);
  return { flight, loadsheets };
}

export default function FlightLoadsheetRoute() {
  const { flight, loadsheets } = useLoaderData<typeof clientLoader>();
  const { flightService } = useApi();
  const { success, error } = useToast();
  const revalidator = useRevalidator();
  const [editing, setEditing] = useState(false);

  const canEditPreliminary = flight.status === FlightStatus.Created;

  const handleUpdate = async (flightId: string, loadsheet: Loadsheet) => {
    try {
      await flightService.updatePreliminaryLoadsheet(flightId, loadsheet);
      success("Preliminary loadsheet updated.");
      setEditing(false);
      revalidator.revalidate();
    } catch (reason: unknown) {
      error(
        describeLoadsheetRefusal(reason, flight.aircraft.cabinLayout?.id ?? null) ??
          "Failed to update preliminary loadsheet.",
      );
    }
  };

  return (
    <div className="mt-3">
      <FuelAndLoadsheetPanel
        flightId={flight.id}
        serviceType={flight.serviceType}
        preliminary={loadsheets.preliminary}
        final={loadsheets.final}
        timesheet={flight.timesheet}
        canEditPreliminary={canEditPreliminary}
        onEditPreliminary={() => setEditing(true)}
      />

      {editing && (
        <UpdatePreliminaryLoadsheetModal
          flight={flight}
          preliminary={loadsheets.preliminary}
          update={handleUpdate}
          cancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}
