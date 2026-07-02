import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightOverviewRoute";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuArrowDownToLine } from "react-icons/lu";
import { Link, useLoaderData, useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { SelectParkingPositionModal } from "~/components/flight/Modal/SelectParkingPositionModal";
import { SelectRunwayModal } from "~/components/flight/Modal/SelectRunwayModal";
import { AirportEndpointCard } from "~/components/flight/Overview/AirportEndpointCard";
import { AssignedParkingPositionPanel } from "~/components/flight/Overview/AssignedParkingPositionPanel";
import { AssignedRunwayPanel } from "~/components/flight/Overview/AssignedRunwayPanel";
import { LoadsheetCard } from "~/components/flight/Overview/LoadsheetCard";
import { ParkingPositionEmptyPanel } from "~/components/flight/Overview/ParkingPositionEmptyPanel";
import { RouteMap } from "~/components/flight/Overview/RouteMap";
import { RunwayEmptyPanel } from "~/components/flight/Overview/RunwayEmptyPanel";
import { FlightStatus, type ParkingPosition, type Runway, type Terminal } from "~/models";
import { useApi } from "~/shared/api/useApi";
import { FlightService } from "~/state/api/flight.service";
import { ParkingPositionService } from "~/state/api/parking-position.service";
import { RunwayService } from "~/state/api/runway.service";
import { TerminalService } from "~/state/api/terminal.service";

const DEPARTURE_RUNWAY_CHANGEABLE = new Set<FlightStatus>([
  FlightStatus.Created,
  FlightStatus.Ready,
  FlightStatus.CheckedIn,
  FlightStatus.BoardingStarted,
  FlightStatus.BoardingFinished,
]);

const DEPARTURE_PARKING_POSITION_CHANGEABLE = new Set<FlightStatus>([FlightStatus.Created, FlightStatus.Ready]);

const ARRIVAL_RUNWAY_CHANGEABLE = new Set<FlightStatus>([
  FlightStatus.Created,
  FlightStatus.Ready,
  FlightStatus.CheckedIn,
  FlightStatus.BoardingStarted,
  FlightStatus.BoardingFinished,
  FlightStatus.TaxiingOut,
  FlightStatus.InCruise,
]);

const ARRIVAL_PARKING_POSITION_CHANGEABLE = new Set<FlightStatus>([
  FlightStatus.Created,
  FlightStatus.Ready,
  FlightStatus.CheckedIn,
  FlightStatus.BoardingStarted,
  FlightStatus.BoardingFinished,
  FlightStatus.TaxiingOut,
  FlightStatus.InCruise,
  FlightStatus.TaxiingIn,
]);

async function fetchAssignment(
  airportId: string,
  runwayId: string | null,
  parkingPositionId: string | null,
): Promise<{
  runway: Runway | null;
  parkingPosition: ParkingPosition | null;
  parkingPositionTerminal: Terminal | null;
}> {
  const [runway, parkingPosition] = await Promise.all([
    runwayId ? new RunwayService().fetchById(airportId, runwayId) : null,
    parkingPositionId ? new ParkingPositionService().fetchById(airportId, parkingPositionId) : null,
  ]);
  const parkingPositionTerminal = parkingPosition
    ? ((await new TerminalService().fetchAll(airportId)).find((t) => t.id === parkingPosition.terminalId) ?? null)
    : null;
  return { runway, parkingPosition, parkingPositionTerminal };
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);

  const [departure, arrival] = await Promise.all([
    fetchAssignment(flight.departureAirport.id, flight.departureRunwayId, flight.departureParkingPositionId),
    fetchAssignment(flight.destinationAirport.id, flight.arrivalRunwayId, flight.arrivalParkingPositionId),
  ]);

  return {
    flight,
    departureRunway: departure.runway,
    departureParkingPosition: departure.parkingPosition,
    departureParkingPositionTerminal: departure.parkingPositionTerminal,
    arrivalRunway: arrival.runway,
    arrivalParkingPosition: arrival.parkingPosition,
    arrivalParkingPositionTerminal: arrival.parkingPositionTerminal,
  };
}

type ModalKind = "departureRunway" | "departureParkingPosition" | "arrivalRunway" | "arrivalParkingPosition" | null;

export default function FlightOverviewRoute() {
  const {
    flight,
    departureRunway,
    departureParkingPosition,
    departureParkingPositionTerminal,
    arrivalRunway,
    arrivalParkingPosition,
    arrivalParkingPositionTerminal,
  } = useLoaderData<typeof clientLoader>();
  const { flightService } = useApi();
  const { success, error } = useToast();
  const revalidator = useRevalidator();
  const [openModal, setOpenModal] = useState<ModalKind>(null);

  const canChangeDepartureRunway = DEPARTURE_RUNWAY_CHANGEABLE.has(flight.status);
  const canChangeDepartureParkingPosition = DEPARTURE_PARKING_POSITION_CHANGEABLE.has(flight.status);
  const canChangeArrivalRunway = ARRIVAL_RUNWAY_CHANGEABLE.has(flight.status);
  const canChangeArrivalParkingPosition = ARRIVAL_PARKING_POSITION_CHANGEABLE.has(flight.status);

  const handleSelect = async (action: () => Promise<void>, successText: string, failureText: string) => {
    try {
      await action();
      success(successText);
      setOpenModal(null);
      revalidator.revalidate();
    } catch {
      error(failureText);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
      <AirportEndpointCard
        kind="departure"
        airport={flight.departureAirport}
        schedule={flight.timesheet.scheduled}
        details={
          <>
            {departureParkingPosition ? (
              <AssignedParkingPositionPanel
                parkingPosition={departureParkingPosition}
                terminal={departureParkingPositionTerminal}
              />
            ) : (
              <ParkingPositionEmptyPanel />
            )}
            {departureRunway ? <AssignedRunwayPanel runway={departureRunway} /> : <RunwayEmptyPanel />}
          </>
        }
        actions={
          <>
            {canChangeDepartureParkingPosition && (
              <Button color="gray" outline size="xs" onClick={() => setOpenModal("departureParkingPosition")}>
                <HiOutlineLocationMarker className="me-1.5" />
                {departureParkingPosition ? "Change parking position" : "Set parking position"}
              </Button>
            )}
            {canChangeDepartureRunway && (
              <Button color="gray" outline size="xs" onClick={() => setOpenModal("departureRunway")}>
                <LuArrowDownToLine className="me-1.5 rotate-180" />
                {departureRunway ? "Change runway" : "Set runway"}
              </Button>
            )}
            <Link
              to={`/airports/${flight.departureAirport.id}/overview`}
              viewTransition
              className="ms-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary-500 hover:underline"
            >
              View airport
              <FaArrowRight size={12} />
            </Link>
          </>
        }
      />
      <AirportEndpointCard
        kind="arrival"
        airport={flight.destinationAirport}
        schedule={flight.timesheet.scheduled}
        details={
          <>
            {arrivalParkingPosition ? (
              <AssignedParkingPositionPanel
                parkingPosition={arrivalParkingPosition}
                terminal={arrivalParkingPositionTerminal}
              />
            ) : (
              <ParkingPositionEmptyPanel />
            )}
            {arrivalRunway ? <AssignedRunwayPanel runway={arrivalRunway} /> : <RunwayEmptyPanel />}
          </>
        }
        actions={
          <>
            {canChangeArrivalParkingPosition && (
              <Button color="gray" outline size="xs" onClick={() => setOpenModal("arrivalParkingPosition")}>
                <HiOutlineLocationMarker className="me-1.5" />
                {arrivalParkingPosition ? "Change parking position" : "Set parking position"}
              </Button>
            )}
            {canChangeArrivalRunway && (
              <Button color="gray" outline size="xs" onClick={() => setOpenModal("arrivalRunway")}>
                <LuArrowDownToLine className="me-1.5" />
                {arrivalRunway ? "Change runway" : "Set runway"}
              </Button>
            )}
            <Link
              to={`/airports/${flight.destinationAirport.id}/overview`}
              viewTransition
              className="ms-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary-500 hover:underline"
            >
              View airport
              <FaArrowRight size={12} />
            </Link>
          </>
        }
      />
      <LoadsheetCard
        title="Loadsheet"
        loadsheet={flight.loadsheets.final ?? flight.loadsheets.preliminary}
        badge={flight.loadsheets.final ? "FINAL" : flight.loadsheets.preliminary ? "PRELIMINARY" : undefined}
        emptyMessage="No loadsheet has been filled for this flight."
        emptySeverity="warning"
        footer={
          <Link
            to={`/flights/${flight.id}/loadsheet`}
            viewTransition
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-500 hover:underline"
          >
            View details
            <FaArrowRight size={12} />
          </Link>
        }
      />
      <RouteMap flight={flight} />

      {openModal === "departureRunway" && canChangeDepartureRunway && (
        <SelectRunwayModal
          airportId={flight.departureAirport.id}
          kind="departure"
          currentSelectionId={flight.departureRunwayId}
          select={(runwayId) =>
            handleSelect(
              () => flightService.assignDepartureRunway(flight.id, runwayId),
              "Departure runway updated.",
              "Failed to update departure runway.",
            )
          }
          cancel={() => setOpenModal(null)}
        />
      )}
      {openModal === "departureParkingPosition" && canChangeDepartureParkingPosition && (
        <SelectParkingPositionModal
          airportId={flight.departureAirport.id}
          kind="departure"
          currentSelectionId={flight.departureParkingPositionId}
          select={(parkingPositionId) =>
            handleSelect(
              () => flightService.assignDepartureParkingPosition(flight.id, parkingPositionId),
              "Departure parking position updated.",
              "Failed to update departure parking position.",
            )
          }
          cancel={() => setOpenModal(null)}
        />
      )}
      {openModal === "arrivalRunway" && canChangeArrivalRunway && (
        <SelectRunwayModal
          airportId={flight.destinationAirport.id}
          kind="arrival"
          currentSelectionId={flight.arrivalRunwayId}
          select={(runwayId) =>
            handleSelect(
              () => flightService.assignArrivalRunway(flight.id, runwayId),
              "Arrival runway updated.",
              "Failed to update arrival runway.",
            )
          }
          cancel={() => setOpenModal(null)}
        />
      )}
      {openModal === "arrivalParkingPosition" && canChangeArrivalParkingPosition && (
        <SelectParkingPositionModal
          airportId={flight.destinationAirport.id}
          kind="arrival"
          currentSelectionId={flight.arrivalParkingPositionId}
          select={(parkingPositionId) =>
            handleSelect(
              () => flightService.assignArrivalParkingPosition(flight.id, parkingPositionId),
              "Arrival parking position updated.",
              "Failed to update arrival parking position.",
            )
          }
          cancel={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}
