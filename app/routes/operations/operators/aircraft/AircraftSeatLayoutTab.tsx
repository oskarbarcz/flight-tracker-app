import { Badge, Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { Link } from "react-router";
import { useToast } from "~/app-state/useToast";
import { AssignCabinLayoutModal } from "~/features/aircraft/components/AircraftDetails/AssignCabinLayoutModal";
import { useAircraftDetails } from "~/features/aircraft/components/AircraftDetails/aircraftDetailsContext";
import { RemoveCabinLayoutModal } from "~/features/aircraft/components/AircraftDetails/RemoveCabinLayoutModal";
import {
  cabinLayoutDisagreements,
  describeDisagreements,
  isCabinLayoutMismatched,
} from "~/features/aircraft/lib/mismatchReason";
import { SeatMap } from "~/features/cabin-layout/components/SeatMap/SeatMap";
import type { CabinSeatMap } from "~/features/cabin-layout/model";
import { useApi } from "~/shared/api/useApi";
import { DataField } from "~/shared/ui/Display/DataField";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type SeatMapState = { status: "loading" } | { status: "ready"; seatMap: CabinSeatMap } | { status: "failed" };

export default function AircraftSeatLayoutTab() {
  const { aircraft, operator, operatorId, refresh } = useAircraftDetails();
  const { aircraftService, cabinLayoutService } = useApi();
  const { success, error } = useToast();

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [state, setState] = useState<SeatMapState>({ status: "loading" });

  const layout = aircraft.cabinLayout;
  const layoutId = layout?.id ?? null;
  const isMismatched = isCabinLayoutMismatched(aircraft);
  const disagreements = cabinLayoutDisagreements(aircraft, operator.iataCode);

  useEffect(() => {
    if (layoutId === null) {
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    cabinLayoutService
      .fetchSeatMap(layoutId)
      .then((seatMap) => {
        if (!cancelled) {
          setState({ status: "ready", seatMap });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "failed" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cabinLayoutService, layoutId]);

  async function handleAssign(cabinLayout: string) {
    try {
      await aircraftService.assignCabinLayout(operatorId, aircraft.id, cabinLayout);
      success(`Cabin layout ${cabinLayout} assigned to ${aircraft.registration}.`);
      setIsAssignOpen(false);
      refresh();
    } catch {
      error("Failed to assign cabin layout.");
    }
  }

  async function handleRemove() {
    try {
      await aircraftService.removeCabinLayout(operatorId, aircraft.id);
      success(`Cabin layout removed from ${aircraft.registration}.`);
      setIsRemoveOpen(false);
      refresh();
    } catch {
      error("Failed to remove cabin layout.");
    }
  }

  return (
    <>
      <Container header={<CardHeader title="Cabin layout" />}>
        {!layout && (
          <div className="rounded-lg bg-gray-50 px-4 py-6 text-center dark:bg-gray-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">No cabin layout assigned</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Flights on {aircraft.registration} are released without a passenger manifest until a layout is assigned.
            </p>
            <Button size="xs" color="indigo" className="mx-auto mt-3" onClick={() => setIsAssignOpen(true)}>
              Assign layout
            </Button>
          </div>
        )}

        {layout && (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
                <DataField label="Layout" value={layout.id} mono />
                <DataField label="Airline" value={layout.airlineIata} mono />
                <DataField label="Aircraft type" value={layout.aircraftIata} mono />
                <DataField
                  label="Revision"
                  value={layout.revision === null ? "Seat map not yet read" : String(layout.revision)}
                />
                <DataField
                  label="Aircraft"
                  value={state.status === "ready" ? state.seatMap.aircraftTypeDisplayed : "—"}
                />
                <DataField
                  label="Total seats"
                  value={state.status === "ready" ? String(state.seatMap.totalSeats) : "—"}
                  mono
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {isMismatched && (
                  <Badge color="warning" size="sm">
                    Mismatched
                  </Badge>
                )}
                {layout.retired && (
                  <Badge color="gray" size="sm">
                    Withdrawn
                  </Badge>
                )}
                <Link to={`/cabin-layouts/${layout.id}`} viewTransition>
                  <Button size="xs" color="indigo">
                    Open in catalogue
                  </Button>
                </Link>
                <Button size="xs" color="alternative" onClick={() => setIsAssignOpen(true)}>
                  Change layout
                </Button>
                <Button size="xs" color="alternative" onClick={() => setIsRemoveOpen(true)}>
                  Remove
                </Button>
              </div>
            </div>

            {isMismatched && (
              <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <HiExclamationTriangle className="mt-0.5 size-4 shrink-0" />
                <span>
                  This cabin does not match {aircraft.registration}: {describeDisagreements(disagreements)}. The
                  assignment stands as recorded.
                </span>
              </p>
            )}

            {state.status === "loading" && (
              <span className="flex items-center gap-2 py-6 text-sm text-gray-500 dark:text-gray-400">
                <Spinner size="sm" />
                Retrieving the cabin from LOPA…
              </span>
            )}

            {state.status === "failed" && (
              <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                The cabin drawing for {layout.id} could not be retrieved.
              </p>
            )}

            {state.status === "ready" && <SeatMap seatMap={state.seatMap} diagramOnly />}
          </>
        )}
      </Container>

      {isAssignOpen && (
        <AssignCabinLayoutModal
          aircraft={aircraft}
          operatorId={operatorId}
          airlineIata={operator.iataCode}
          assign={handleAssign}
          cancel={() => setIsAssignOpen(false)}
        />
      )}

      {isRemoveOpen && (
        <RemoveCabinLayoutModal aircraft={aircraft} remove={handleRemove} cancel={() => setIsRemoveOpen(false)} />
      )}
    </>
  );
}
