import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightLoadsheetRoute";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import { HiPencil } from "react-icons/hi";
import { useLoaderData, useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { FlightStatus, type Loadsheet } from "~/features/flight";
import { UpdatePreliminaryLoadsheetModal } from "~/features/flight/components/Modal/UpdatePreliminaryLoadsheetModal";
import { LoadsheetCard } from "~/features/flight/components/Overview/LoadsheetCard";
import { FlightService } from "~/features/flight/service";
import { useApi } from "~/shared/api/useApi";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  return { flight };
}

export default function FlightLoadsheetRoute() {
  const { flight } = useLoaderData<typeof clientLoader>();
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
    } catch {
      error("Failed to update preliminary loadsheet.");
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
      <LoadsheetCard
        title="Preliminary loadsheet"
        loadsheet={flight.loadsheets.preliminary}
        emptyMessage="No preliminary loadsheet has been filled yet."
        emptySeverity="warning"
        footer={
          canEditPreliminary && (
            <Button color="gray" outline size="xs" onClick={() => setEditing(true)}>
              <HiPencil className="me-1.5" />
              {flight.loadsheets.preliminary ? "Update" : "Fill"}
            </Button>
          )
        }
      />
      <LoadsheetCard
        title="Final loadsheet"
        loadsheet={flight.loadsheets.final}
        emptyMessage="Waiting for pilot to report final loadsheet."
      />

      {editing && (
        <UpdatePreliminaryLoadsheetModal flight={flight} update={handleUpdate} cancel={() => setEditing(false)} />
      )}
    </div>
  );
}
