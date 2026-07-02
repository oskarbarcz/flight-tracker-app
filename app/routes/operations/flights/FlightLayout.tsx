import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightLayout";
import React, { useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate, useRevalidator } from "react-router";
import { EmergencyInProgressAlert } from "~/components/flight/Header/EmergencyInProgressAlert";
import { FlightHeader } from "~/components/flight/Header/FlightHeader";
import { FlightTabs } from "~/components/flight/Header/FlightTabs";
import { ReleaseFlightModal } from "~/components/flight/Modal/ReleaseFlightModal";
import { RemoveFlightModal } from "~/components/flight/Modal/RemoveFlightModal";
import { UpdateTrackingModal } from "~/components/flight/Modal/UpdateTrackingModal";
import { FlightSource, type Tracking } from "~/models";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { useApi } from "~/state/api/context/useApi";
import { TrackedFlightProvider, useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { FlightService } from "~/state/api/flight.service";
import { useDataRefresh } from "~/state/app/context/useDataRefresh";
import { useToast } from "~/state/app/context/useToast";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  return { flight };
}

function FlightLayoutContent() {
  const { flight } = useLoaderData<typeof clientLoader>();
  const { flightService } = useApi();
  const { success, error } = useToast();
  const { markRefreshed } = useDataRefresh();
  const { activeEmergency, delayRequest, setFlightId } = useTrackedFlight();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [releasePending, setReleasePending] = useState(false);
  const [removePending, setRemovePending] = useState(false);
  const [trackingPending, setTrackingPending] = useState(false);

  usePageTitle(`${flight.flightNumberWithoutSpaces} | Flight`);

  useEffect(() => {
    setFlightId(flight.id);
  }, [flight.id, setFlightId]);

  useEffect(() => {
    markRefreshed();
  }, [markRefreshed]);

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
      {activeEmergency && (
        <div className="mb-3">
          <EmergencyInProgressAlert flightId={flight.id} />
        </div>
      )}
      <div className="mb-3">
        <FlightHeader
          flight={flight}
          onRelease={() => setReleasePending(true)}
          onRemove={() => setRemovePending(true)}
          onUpdateTracking={() => setTrackingPending(true)}
        />
      </div>
      <FlightTabs
        id={flight.id}
        showOfp={flight.source === FlightSource.SimBrief}
        hasActiveEmergency={activeEmergency !== null}
        hasPendingDelays={delayRequest?.hasPendingReports ?? false}
      />
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

export default function FlightLayout() {
  return (
    <TrackedFlightProvider>
      <FlightLayoutContent />
    </TrackedFlightProvider>
  );
}
