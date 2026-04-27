"use client";

import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightOverviewRoute";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuArrowDownToLine } from "react-icons/lu";
import { Link, useLoaderData, useRevalidator } from "react-router";
import { SelectGateModal } from "~/components/flight/Modal/SelectGateModal";
import { SelectRunwayModal } from "~/components/flight/Modal/SelectRunwayModal";
import { AirportEndpointCard } from "~/components/flight/Overview/AirportEndpointCard";
import { AssignedGatePanel } from "~/components/flight/Overview/AssignedGatePanel";
import { AssignedRunwayPanel } from "~/components/flight/Overview/AssignedRunwayPanel";
import { GateEmptyPanel } from "~/components/flight/Overview/GateEmptyPanel";
import { LoadsheetCard } from "~/components/flight/Overview/LoadsheetCard";
import { RouteMap } from "~/components/flight/Overview/RouteMap";
import { RunwayEmptyPanel } from "~/components/flight/Overview/RunwayEmptyPanel";
import { FlightStatus, type Gate, type Runway, type Terminal } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { FlightService } from "~/state/api/flight.service";
import { GateService } from "~/state/api/gate.service";
import { RunwayService } from "~/state/api/runway.service";
import { TerminalService } from "~/state/api/terminal.service";
import { useToast } from "~/state/app/context/useToast";

const DEPARTURE_RUNWAY_CHANGEABLE = new Set<FlightStatus>([
  FlightStatus.Created,
  FlightStatus.Ready,
  FlightStatus.CheckedIn,
  FlightStatus.BoardingStarted,
  FlightStatus.BoardingFinished,
]);

const DEPARTURE_GATE_CHANGEABLE = new Set<FlightStatus>([FlightStatus.Created, FlightStatus.Ready]);

const ARRIVAL_RUNWAY_CHANGEABLE = new Set<FlightStatus>([
  FlightStatus.Created,
  FlightStatus.Ready,
  FlightStatus.CheckedIn,
  FlightStatus.BoardingStarted,
  FlightStatus.BoardingFinished,
  FlightStatus.TaxiingOut,
  FlightStatus.InCruise,
]);

const ARRIVAL_GATE_CHANGEABLE = new Set<FlightStatus>([
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
  gateId: string | null,
): Promise<{ runway: Runway | null; gate: Gate | null; gateTerminal: Terminal | null }> {
  const [runway, gate] = await Promise.all([
    runwayId ? new RunwayService().fetchById(airportId, runwayId) : null,
    gateId ? new GateService().fetchById(airportId, gateId) : null,
  ]);
  const gateTerminal = gate
    ? ((await new TerminalService().fetchAll(airportId)).find((t) => t.id === gate.terminalId) ?? null)
    : null;
  return { runway, gate, gateTerminal };
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);

  const [departure, arrival] = await Promise.all([
    fetchAssignment(flight.departureAirport.id, flight.departureRunwayId, flight.departureGateId),
    fetchAssignment(flight.destinationAirport.id, flight.arrivalRunwayId, flight.arrivalGateId),
  ]);

  return {
    flight,
    departureRunway: departure.runway,
    departureGate: departure.gate,
    departureGateTerminal: departure.gateTerminal,
    arrivalRunway: arrival.runway,
    arrivalGate: arrival.gate,
    arrivalGateTerminal: arrival.gateTerminal,
  };
}

type ModalKind = "departureRunway" | "departureGate" | "arrivalRunway" | "arrivalGate" | null;

export default function FlightOverviewRoute() {
  const {
    flight,
    departureRunway,
    departureGate,
    departureGateTerminal,
    arrivalRunway,
    arrivalGate,
    arrivalGateTerminal,
  } = useLoaderData<typeof clientLoader>();
  const { flightService } = useApi();
  const { success, error } = useToast();
  const revalidator = useRevalidator();
  const [openModal, setOpenModal] = useState<ModalKind>(null);

  const canChangeDepartureRunway = DEPARTURE_RUNWAY_CHANGEABLE.has(flight.status);
  const canChangeDepartureGate = DEPARTURE_GATE_CHANGEABLE.has(flight.status);
  const canChangeArrivalRunway = ARRIVAL_RUNWAY_CHANGEABLE.has(flight.status);
  const canChangeArrivalGate = ARRIVAL_GATE_CHANGEABLE.has(flight.status);

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
            {departureGate ? (
              <AssignedGatePanel gate={departureGate} terminal={departureGateTerminal} />
            ) : (
              <GateEmptyPanel />
            )}
            {departureRunway ? <AssignedRunwayPanel runway={departureRunway} /> : <RunwayEmptyPanel />}
          </>
        }
        actions={
          (canChangeDepartureRunway || canChangeDepartureGate) && (
            <>
              {canChangeDepartureGate && (
                <Button color="gray" outline size="xs" onClick={() => setOpenModal("departureGate")}>
                  <HiOutlineLocationMarker className="me-1.5" />
                  {departureGate ? "Change gate" : "Set gate"}
                </Button>
              )}
              {canChangeDepartureRunway && (
                <Button color="gray" outline size="xs" onClick={() => setOpenModal("departureRunway")}>
                  <LuArrowDownToLine className="me-1.5 rotate-180" />
                  {departureRunway ? "Change runway" : "Set runway"}
                </Button>
              )}
            </>
          )
        }
      />
      <AirportEndpointCard
        kind="arrival"
        airport={flight.destinationAirport}
        schedule={flight.timesheet.scheduled}
        details={
          <>
            {arrivalGate ? <AssignedGatePanel gate={arrivalGate} terminal={arrivalGateTerminal} /> : <GateEmptyPanel />}
            {arrivalRunway ? <AssignedRunwayPanel runway={arrivalRunway} /> : <RunwayEmptyPanel />}
          </>
        }
        actions={
          (canChangeArrivalRunway || canChangeArrivalGate) && (
            <>
              {canChangeArrivalGate && (
                <Button color="gray" outline size="xs" onClick={() => setOpenModal("arrivalGate")}>
                  <HiOutlineLocationMarker className="me-1.5" />
                  {arrivalGate ? "Change gate" : "Set gate"}
                </Button>
              )}
              {canChangeArrivalRunway && (
                <Button color="gray" outline size="xs" onClick={() => setOpenModal("arrivalRunway")}>
                  <LuArrowDownToLine className="me-1.5" />
                  {arrivalRunway ? "Change runway" : "Set runway"}
                </Button>
              )}
            </>
          )
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
      {openModal === "departureGate" && canChangeDepartureGate && (
        <SelectGateModal
          airportId={flight.departureAirport.id}
          kind="departure"
          currentSelectionId={flight.departureGateId}
          select={(gateId) =>
            handleSelect(
              () => flightService.assignDepartureGate(flight.id, gateId),
              "Departure gate updated.",
              "Failed to update departure gate.",
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
      {openModal === "arrivalGate" && canChangeArrivalGate && (
        <SelectGateModal
          airportId={flight.destinationAirport.id}
          kind="arrival"
          currentSelectionId={flight.arrivalGateId}
          select={(gateId) =>
            handleSelect(
              () => flightService.assignArrivalGate(flight.id, gateId),
              "Arrival gate updated.",
              "Failed to update arrival gate.",
            )
          }
          cancel={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}
