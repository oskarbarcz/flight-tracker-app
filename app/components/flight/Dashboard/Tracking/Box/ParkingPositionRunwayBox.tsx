import { Button } from "flowbite-react";
import React, { type ReactNode, useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FaChevronDown, FaPlaneArrival, FaPlaneCircleExclamation, FaPlaneDeparture } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuArrowDownToLine } from "react-icons/lu";
import { useToast } from "~/app-state/useToast";
import { SelectParkingPositionModal } from "~/components/flight/Modal/SelectParkingPositionModal";
import { SelectRunwayModal } from "~/components/flight/Modal/SelectRunwayModal";
import { AirportPreviewPanel } from "~/components/flight/Overview/AirportPreviewPanel";
import { AssignedParkingPositionPanel } from "~/components/flight/Overview/AssignedParkingPositionPanel";
import { AssignedRunwayPanel } from "~/components/flight/Overview/AssignedRunwayPanel";
import { AssignedTerminalPanel } from "~/components/flight/Overview/AssignedTerminalPanel";
import { ParkingPositionEmptyPanel } from "~/components/flight/Overview/ParkingPositionEmptyPanel";
import { RunwayEmptyPanel } from "~/components/flight/Overview/RunwayEmptyPanel";
import { TerminalEmptyPanel } from "~/components/flight/Overview/TerminalEmptyPanel";
import { diversionReasonLabel, diversionSeverityLabel } from "~/features/diversion/components/diversionLabels";
import { type Airport, type Diversion, FlightStatus, type ParkingPosition, type Runway, type Terminal } from "~/models";
import { useApi } from "~/shared/api/useApi";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

type ModalKind = "departureParkingPosition" | "departureRunway" | "arrivalRunway" | "arrivalParkingPosition" | null;

type AssignmentState = {
  departureParkingPosition: ParkingPosition | null;
  departureParkingPositionTerminal: Terminal | null;
  departureRunway: Runway | null;
  arrivalRunway: Runway | null;
  arrivalParkingPosition: ParkingPosition | null;
  arrivalParkingPositionTerminal: Terminal | null;
};

const EMPTY_ASSIGNMENT: AssignmentState = {
  departureParkingPosition: null,
  departureParkingPositionTerminal: null,
  departureRunway: null,
  arrivalRunway: null,
  arrivalParkingPosition: null,
  arrivalParkingPositionTerminal: null,
};

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

const AFTER_TAKEOFF = new Set<FlightStatus>([
  FlightStatus.InCruise,
  FlightStatus.TaxiingIn,
  FlightStatus.OnBlock,
  FlightStatus.OffboardingStarted,
  FlightStatus.OffboardingFinished,
  FlightStatus.Closed,
]);

export function ParkingPositionRunwayBox() {
  const { flight, diversion, reload } = useTrackedFlight();
  const { flightService, parkingPositionService, runwayService, terminalService } = useApi();
  const { success, error } = useToast();
  const [assignments, setAssignments] = useState<AssignmentState>(EMPTY_ASSIGNMENT);
  const [openModal, setOpenModal] = useState<ModalKind>(null);

  const departureAirportId = flight?.departureAirport.id;
  const destinationAirportId = flight?.destinationAirport.id;
  const departureParkingPositionId = flight?.departureParkingPositionId ?? null;
  const departureRunwayId = flight?.departureRunwayId ?? null;
  const arrivalRunwayId = flight?.arrivalRunwayId ?? null;
  const arrivalParkingPositionId = flight?.arrivalParkingPositionId ?? null;

  const afterTakeoff = flight ? AFTER_TAKEOFF.has(flight.status) : false;
  const [departureOpen, setDepartureOpen] = useState(!afterTakeoff);
  const [arrivalOpen, setArrivalOpen] = useState(afterTakeoff);

  useEffect(() => {
    setDepartureOpen(!afterTakeoff);
    setArrivalOpen(afterTakeoff);
  }, [afterTakeoff]);

  useEffect(() => {
    if (!departureAirportId || !destinationAirportId) return;
    let cancelled = false;
    Promise.all([
      departureParkingPositionId
        ? parkingPositionService.fetchById(departureAirportId, departureParkingPositionId)
        : Promise.resolve(null),
      departureRunwayId ? runwayService.fetchById(departureAirportId, departureRunwayId) : Promise.resolve(null),
      arrivalRunwayId ? runwayService.fetchById(destinationAirportId, arrivalRunwayId) : Promise.resolve(null),
      arrivalParkingPositionId
        ? parkingPositionService.fetchById(destinationAirportId, arrivalParkingPositionId)
        : Promise.resolve(null),
    ]).then(async ([departureParkingPosition, departureRunway, arrivalRunway, arrivalParkingPosition]) => {
      if (cancelled) return;
      const [departureTerminals, arrivalTerminals] = await Promise.all([
        departureParkingPosition ? terminalService.fetchAll(departureAirportId) : Promise.resolve([] as Terminal[]),
        arrivalParkingPosition ? terminalService.fetchAll(destinationAirportId) : Promise.resolve([] as Terminal[]),
      ]);
      if (cancelled) return;
      setAssignments({
        departureParkingPosition: departureParkingPosition as ParkingPosition | null,
        departureParkingPositionTerminal: departureParkingPosition
          ? (departureTerminals.find((t) => t.id === (departureParkingPosition as ParkingPosition).terminalId) ?? null)
          : null,
        departureRunway: departureRunway as Runway | null,
        arrivalRunway: arrivalRunway as Runway | null,
        arrivalParkingPosition: arrivalParkingPosition as ParkingPosition | null,
        arrivalParkingPositionTerminal: arrivalParkingPosition
          ? (arrivalTerminals.find((t) => t.id === (arrivalParkingPosition as ParkingPosition).terminalId) ?? null)
          : null,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [
    departureAirportId,
    destinationAirportId,
    departureParkingPositionId,
    departureRunwayId,
    arrivalRunwayId,
    arrivalParkingPositionId,
    parkingPositionService,
    runwayService,
    terminalService,
  ]);

  if (!flight) return null;

  const canChangeDepartureParkingPosition = DEPARTURE_PARKING_POSITION_CHANGEABLE.has(flight.status);
  const canChangeDepartureRunway = DEPARTURE_RUNWAY_CHANGEABLE.has(flight.status);
  const canChangeArrivalRunway = ARRIVAL_RUNWAY_CHANGEABLE.has(flight.status);
  const canChangeArrivalParkingPosition = ARRIVAL_PARKING_POSITION_CHANGEABLE.has(flight.status);

  const handleAssign = async (call: () => Promise<void>, successText: string, failureText: string) => {
    try {
      await call();
      setOpenModal(null);
      await reload();
      success(successText);
    } catch {
      error(failureText);
    }
  };

  return (
    <Container padding="condensed">
      <ContainerTitle icon={HiOutlineLocationMarker} title="Travel plan" />

      <EndpointSection
        icon={FaPlaneDeparture}
        title="Departure"
        airport={flight.departureAirport}
        open={departureOpen}
        onToggle={() => setDepartureOpen((v) => !v)}
      >
        <AirportPreviewPanel airport={flight.departureAirport} />
        {assignments.departureParkingPositionTerminal ? (
          <AssignedTerminalPanel terminal={assignments.departureParkingPositionTerminal} />
        ) : (
          <TerminalEmptyPanel />
        )}
        {assignments.departureParkingPosition ? (
          <AssignedParkingPositionPanel
            parkingPosition={assignments.departureParkingPosition}
            terminal={assignments.departureParkingPositionTerminal}
          />
        ) : (
          <ParkingPositionEmptyPanel />
        )}
        {assignments.departureRunway ? (
          <AssignedRunwayPanel runway={assignments.departureRunway} />
        ) : (
          <RunwayEmptyPanel />
        )}
        <EndpointActions>
          {canChangeDepartureParkingPosition && (
            <ChangeButton
              icon={HiOutlineLocationMarker}
              onClick={() => setOpenModal("departureParkingPosition")}
              hasValue={!!assignments.departureParkingPosition}
              kind="parking position"
            />
          )}
          {canChangeDepartureRunway && (
            <ChangeButton
              icon={LuArrowDownToLine}
              iconClassName="rotate-180"
              onClick={() => setOpenModal("departureRunway")}
              hasValue={!!assignments.departureRunway}
              kind="runway"
            />
          )}
        </EndpointActions>
      </EndpointSection>

      <EndpointSection
        icon={FaPlaneArrival}
        title="Arrival"
        airport={flight.destinationAirport}
        open={arrivalOpen}
        onToggle={() => setArrivalOpen((v) => !v)}
        struck={Boolean(diversion)}
      >
        <AirportPreviewPanel airport={flight.destinationAirport} />
        {assignments.arrivalRunway ? <AssignedRunwayPanel runway={assignments.arrivalRunway} /> : <RunwayEmptyPanel />}
        {assignments.arrivalParkingPositionTerminal ? (
          <AssignedTerminalPanel terminal={assignments.arrivalParkingPositionTerminal} />
        ) : (
          <TerminalEmptyPanel />
        )}
        {assignments.arrivalParkingPosition ? (
          <AssignedParkingPositionPanel
            parkingPosition={assignments.arrivalParkingPosition}
            terminal={assignments.arrivalParkingPositionTerminal}
          />
        ) : (
          <ParkingPositionEmptyPanel />
        )}
        {!diversion && (
          <EndpointActions>
            {canChangeArrivalRunway && (
              <ChangeButton
                icon={LuArrowDownToLine}
                onClick={() => setOpenModal("arrivalRunway")}
                hasValue={!!assignments.arrivalRunway}
                kind="runway"
              />
            )}
            {canChangeArrivalParkingPosition && (
              <ChangeButton
                icon={HiOutlineLocationMarker}
                onClick={() => setOpenModal("arrivalParkingPosition")}
                hasValue={!!assignments.arrivalParkingPosition}
                kind="parking position"
              />
            )}
          </EndpointActions>
        )}
      </EndpointSection>

      {diversion && <DiversionEndpointSection diversion={diversion} />}

      {openModal === "departureParkingPosition" && canChangeDepartureParkingPosition && (
        <SelectParkingPositionModal
          airportId={flight.departureAirport.id}
          kind="departure"
          currentSelectionId={flight.departureParkingPositionId}
          select={(parkingPositionId) =>
            handleAssign(
              () => flightService.assignDepartureParkingPosition(flight.id, parkingPositionId),
              "Departure parking position updated.",
              "Failed to update departure parking position.",
            )
          }
          cancel={() => setOpenModal(null)}
        />
      )}
      {openModal === "departureRunway" && canChangeDepartureRunway && (
        <SelectRunwayModal
          airportId={flight.departureAirport.id}
          kind="departure"
          currentSelectionId={flight.departureRunwayId}
          select={(runwayId) =>
            handleAssign(
              () => flightService.assignDepartureRunway(flight.id, runwayId),
              "Departure runway updated.",
              "Failed to update departure runway.",
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
            handleAssign(
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
            handleAssign(
              () => flightService.assignArrivalParkingPosition(flight.id, parkingPositionId),
              "Arrival parking position updated.",
              "Failed to update arrival parking position.",
            )
          }
          cancel={() => setOpenModal(null)}
        />
      )}
    </Container>
  );
}

type EndpointSectionProps = {
  icon: IconType;
  title: string;
  airport: Airport;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  struck?: boolean;
};

function EndpointSection({
  icon: Icon,
  title,
  airport,
  open,
  onToggle,
  children,
  struck = false,
}: EndpointSectionProps) {
  const strikeClass = struck ? "line-through decoration-2 text-gray-400 dark:text-gray-500" : undefined;
  return (
    <section className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center gap-2 text-xs cursor-pointer text-start"
      >
        <Icon size={14} className={struck ? "text-gray-400 dark:text-gray-500" : "text-indigo-500"} />
        <span className={`font-bold uppercase tracking-widest ${strikeClass ?? "text-gray-600 dark:text-gray-300"}`}>
          {title}
        </span>
        <span className={`ms-auto ${strikeClass ?? "text-gray-400 dark:text-gray-500"}`}>{airport.city}</span>
        <span className="text-gray-300 dark:text-gray-600">→</span>
        <span className={`font-mono font-bold ${strikeClass ?? "text-gray-700 dark:text-gray-200"}`}>
          {airport.iataCode}
        </span>
        <FaChevronDown size={10} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className={`flex flex-col gap-2 ${struck ? "opacity-60" : ""}`}>{children}</div>}
    </section>
  );
}

function DiversionEndpointSection({ diversion }: { diversion: Diversion }) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border border-red-500/60 bg-red-50/60 p-3 dark:bg-red-950/30">
      <div className="flex items-center gap-2 text-xs">
        <FaPlaneCircleExclamation size={14} className="text-red-600 dark:text-red-500" />
        <span className="font-bold uppercase tracking-widest text-red-600 dark:text-red-500">Diverting to</span>
        <span className="ms-auto text-red-700/80 dark:text-red-400/80">{diversion.airport.city}</span>
        <span className="text-red-300 dark:text-red-700">→</span>
        <span className="font-mono font-bold text-red-700 dark:text-red-400">{diversion.airport.icaoCode}</span>
      </div>
      <AirportPreviewPanel airport={diversion.airport} />
      <dl className="grid grid-cols-3 gap-2 text-xs">
        <DiversionFact label="Severity" value={diversionSeverityLabel(diversion.severity)} />
        <DiversionFact label="Reason" value={diversionReasonLabel(diversion.reason)} />
        <DiversionFact
          label="ETA"
          value={
            <span className="font-mono">
              <FormattedIcaoDate date={diversion.estimatedTimeAtDestination} />{" "}
              <FormattedIcaoTime date={diversion.estimatedTimeAtDestination} />
            </span>
          }
        />
      </dl>
    </section>
  );
}

function DiversionFact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[0.65rem] font-bold uppercase tracking-widest text-red-600/80 dark:text-red-500/80">
        {label}
      </dt>
      <dd className="text-gray-800 dark:text-gray-100">{value}</dd>
    </div>
  );
}

function EndpointActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

type ChangeButtonProps = {
  icon: IconType;
  iconClassName?: string;
  onClick: () => void;
  hasValue: boolean;
  kind: "parking position" | "runway";
};

function ChangeButton({ icon: Icon, iconClassName, onClick, hasValue, kind }: ChangeButtonProps) {
  const label = `${hasValue ? "Change" : "Set"} ${kind}`;
  return (
    <Button color="gray" outline size="xs" onClick={onClick}>
      <Icon className={`me-1.5 ${iconClassName ?? ""}`} />
      {label}
    </Button>
  );
}
