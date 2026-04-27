"use client";

import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightLayout";
import React, { useState } from "react";
import { Outlet, useLoaderData, useNavigate, useRevalidator } from "react-router";
import { FlightHeader } from "~/components/flight/Header/FlightHeader";
import { FlightTabs } from "~/components/flight/Header/FlightTabs";
import { ReleaseFlightModal } from "~/components/flight/Modal/ReleaseFlightModal";
import { RemoveFlightModal } from "~/components/flight/Modal/RemoveFlightModal";
import { UpdateTrackingModal } from "~/components/flight/Modal/UpdateTrackingModal";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { type Flight, FlightSource, type Tracking } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { FlightService } from "~/state/api/flight.service";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  return { flight };
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatFlightDate(date: Date): string {
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const currentYear = new Date().getUTCFullYear();
  const yearPart = year === currentYear ? "" : ` ${year}`;
  return `${day} ${month}${yearPart}`;
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: (data) => {
    const { flight } = data as { flight: Flight };
    return [
      { label: "Flight plans", to: "/flights" },
      {
        label: (
          <span className="font-mono">
            {formatFlightDate(flight.timesheet.scheduled.takeoffTime)} · {flight.flightNumberWithoutSpaces}
          </span>
        ),
      },
    ];
  },
};

export default function FlightLayout() {
  const { flight } = useLoaderData<typeof clientLoader>();
  const { flightService } = useApi();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [releasePending, setReleasePending] = useState(false);
  const [removePending, setRemovePending] = useState(false);
  const [trackingPending, setTrackingPending] = useState(false);

  usePageTitle(`${flight.flightNumberWithoutSpaces} | Flight`);

  const handleRelease = async (flightId: string) => {
    try {
      await flightService.markAsReady(flightId);
      success(`Flight ${flight.flightNumberWithoutSpaces} released for pilot.`);
      setReleasePending(false);
      revalidator.revalidate();
    } catch {
      error("Failed to release flight.");
    }
  };

  const handleRemove = async (flightId: string) => {
    try {
      await flightService.remove(flightId);
      success(`Flight ${flight.flightNumberWithoutSpaces} removed.`);
      navigate("/flights");
    } catch {
      error("Failed to remove flight.");
    }
  };

  const handleUpdateTracking = async (flightId: string, tracking: Tracking) => {
    try {
      await flightService.updateTracking(flightId, tracking);
      success("Flight visibility updated.");
      setTrackingPending(false);
      revalidator.revalidate();
    } catch {
      error("Failed to update flight visibility.");
    }
  };

  return (
    <>
      <div className="mb-3">
        <FlightHeader
          flight={flight}
          onRelease={() => setReleasePending(true)}
          onRemove={() => setRemovePending(true)}
          onUpdateTracking={() => setTrackingPending(true)}
        />
      </div>
      <FlightTabs id={flight.id} showOfp={flight.source === FlightSource.SimBrief} />
      <Outlet />

      {releasePending && (
        <ReleaseFlightModal flight={flight} release={handleRelease} cancel={() => setReleasePending(false)} />
      )}
      {removePending && (
        <RemoveFlightModal flight={flight} remove={handleRemove} cancel={() => setRemovePending(false)} />
      )}
      {trackingPending && (
        <UpdateTrackingModal flight={flight} update={handleUpdateTracking} cancel={() => setTrackingPending(false)} />
      )}
    </>
  );
}
