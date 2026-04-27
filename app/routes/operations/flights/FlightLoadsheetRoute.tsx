"use client";

import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightLoadsheetRoute";
import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { UpdatePreliminaryLoadsheetModal } from "~/components/flight/Modal/UpdatePreliminaryLoadsheetModal";
import { PreliminaryLoadsheetCard } from "~/components/flight/Overview/PreliminaryLoadsheetCard";
import type { Loadsheet } from "~/models";
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
    <div className="mt-3">
      <PreliminaryLoadsheetCard flight={flight} onUpdate={() => setEditing(true)} />
      {editing && (
        <UpdatePreliminaryLoadsheetModal flight={flight} update={handleUpdate} cancel={() => setEditing(false)} />
      )}
    </div>
  );
}
