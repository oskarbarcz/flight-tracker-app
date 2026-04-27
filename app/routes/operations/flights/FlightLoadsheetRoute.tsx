"use client";

import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightLoadsheetRoute";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import { HiPencil } from "react-icons/hi";
import { useLoaderData, useRevalidator } from "react-router";
import { UpdatePreliminaryLoadsheetModal } from "~/components/flight/Modal/UpdatePreliminaryLoadsheetModal";
import { LoadsheetCard } from "~/components/flight/Overview/LoadsheetCard";
import { FlightStatus, type Loadsheet } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { FlightService } from "~/state/api/flight.service";
import { useToast } from "~/state/app/context/useToast";

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
