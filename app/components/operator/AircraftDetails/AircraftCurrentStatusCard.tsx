import React from "react";
import { HiOutlineLocationMarker, HiOutlinePaperAirplane } from "react-icons/hi";
import { LocationMap, MapPill, type MapTone } from "~/components/operator/AircraftDetails/LocationMap";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import { type AircraftStatusView, deriveAircraftStatus } from "~/functions/aircraftStatus";
import { formatDate } from "~/functions/time";
import type { Aircraft, Coordinates, FlightHistoryEntry } from "~/models";

type Props = {
  aircraft: Aircraft;
  history: FlightHistoryEntry[];
  mapPoint: Coordinates | null;
};

type TimelineStep = {
  key: string;
  when: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  now?: boolean;
};

function formatIso(iso: string | null | undefined): string | null {
  return iso ? formatDate(new Date(iso)) : null;
}

function MapShell({
  pill,
  overlay,
  children,
}: {
  pill: React.ReactNode;
  overlay: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="location-map relative h-[150px] overflow-hidden rounded-xl">
      <div className="location-map__grid absolute inset-0" />
      {children}
      <div className="absolute right-3 top-3">{pill}</div>
      <div className="absolute bottom-3 left-4">{overlay}</div>
    </div>
  );
}

function RoutePath({ dep, arr, planeAt }: { dep: string; arr: string; planeAt: string }) {
  return (
    <div className="absolute inset-x-[16%] top-[48%]">
      <div className="border-t-2 border-dashed border-indigo-400/60" />
      <span className="absolute -left-1 -top-1 size-2 rounded-full bg-indigo-500" />
      <span className="absolute -right-1 -top-1 size-2 rounded-full bg-indigo-500" />
      <span className="absolute -left-1 -top-7 font-mono text-xs font-bold text-gray-900 dark:text-white">{dep}</span>
      <span className="absolute -right-1 -top-7 font-mono text-xs font-bold text-gray-900 dark:text-white">{arr}</span>
      <span
        className="absolute -top-2.5 -translate-x-1/2 text-indigo-600 dark:text-indigo-300"
        style={{ left: planeAt }}
      >
        <HiOutlinePaperAirplane className="size-4 rotate-45" />
      </span>
    </div>
  );
}

function FlightOverlay({ flightNumber, route }: { flightNumber: string; route: string }) {
  return (
    <>
      <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">{flightNumber}</div>
      <div className="text-xs text-gray-600 dark:text-gray-300">{route}</div>
    </>
  );
}

function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="relative pl-[26px]">
      <div className="absolute bottom-1.5 left-1.5 top-1.5 w-0.5 bg-gradient-to-b from-indigo-200 to-indigo-500 dark:from-indigo-800 dark:to-indigo-500" />
      {steps.map((step, index) => (
        <div key={step.key} className={index === steps.length - 1 ? "relative" : "relative pb-4"}>
          <span
            className={`absolute -left-[26px] top-0.5 size-3.5 rounded-full border-2 ${
              step.now
                ? "border-indigo-600 bg-indigo-600 shadow-[0_0_0_4px] shadow-indigo-50 dark:shadow-indigo-950"
                : "border-indigo-200 bg-white dark:border-indigo-800 dark:bg-gray-900"
            }`}
          >
            {step.now && (
              <span className="absolute -inset-0.5 rounded-full border-2 border-indigo-500 motion-safe:animate-ping" />
            )}
          </span>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{step.when}</div>
          <div className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">{step.title}</div>
          {step.sub && <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{step.sub}</div>}
        </div>
      ))}
    </div>
  );
}

function ParkedView({
  aircraft,
  status,
  mapPoint,
}: {
  aircraft: Aircraft;
  status: Extract<AircraftStatusView, { kind: "parked" }>;
  mapPoint: Coordinates | null;
}) {
  const { since, flight } = status;
  const airport = aircraft.lastAirport;
  const gate = aircraft.lastGate;
  const point = mapPoint ?? airport?.location ?? null;

  const steps: TimelineStep[] = [];

  if (flight) {
    steps.push({
      key: "arrived",
      when: since ? `Arrived ${formatDate(since)}` : "Last arrival",
      title: (
        <>
          Arrived on <span className="font-mono">{flight.flightNumber}</span>
        </>
      ),
      sub: (
        <>
          <span className="font-mono font-semibold">{flight.departureAirport.iataCode}</span> →{" "}
          <span className="font-mono font-semibold">{flight.arrivalAirport.iataCode}</span>
        </>
      ),
    });
  }

  steps.push({
    key: "now",
    now: true,
    when: "Now",
    title: airport ? <>Parked at {airport.name}</> : "Parked",
    sub: airport ? (
      <>
        {gate && (
          <>
            Gate <span className="font-semibold text-gray-700 dark:text-gray-300">{gate.name}</span> ·{" "}
          </>
        )}
        {airport.city}, {airport.country}
      </>
    ) : undefined,
  });

  return (
    <>
      {point && airport && (
        <LocationMap
          center={[point.latitude, point.longitude]}
          label={airport.iataCode}
          pill={<MapPill label="Parked" tone="parked" />}
        />
      )}
      <Timeline steps={steps} />
    </>
  );
}

function FlightView({
  flight,
  tone,
  label,
  planeAt,
  steps,
}: {
  flight: FlightHistoryEntry;
  tone: MapTone;
  label: string;
  planeAt: string;
  steps: TimelineStep[];
}) {
  return (
    <>
      <MapShell
        pill={<MapPill label={label} tone={tone} />}
        overlay={
          <FlightOverlay
            flightNumber={flight.flightNumber}
            route={`${flight.departureAirport.iataCode} → ${flight.arrivalAirport.iataCode}`}
          />
        }
      >
        <RoutePath dep={flight.departureAirport.iataCode} arr={flight.arrivalAirport.iataCode} planeAt={planeAt} />
      </MapShell>
      <Timeline steps={steps} />
    </>
  );
}

export function AircraftCurrentStatusCard({ aircraft, history, mapPoint }: Props) {
  const status = deriveAircraftStatus(aircraft, history);

  return (
    <Container>
      <ContainerTitle icon={HiOutlineLocationMarker} title="Current location" />

      {status.kind === "parked" && <ParkedView aircraft={aircraft} status={status} mapPoint={mapPoint} />}

      {status.kind === "cruise" && (
        <FlightView
          flight={status.flight}
          tone="cruise"
          label="In cruise"
          planeAt="58%"
          steps={[
            {
              key: "departed",
              when: formatIso(status.flight.actualTimesheet?.takeoffTime ?? status.flight.actualTimesheet?.offBlockTime)
                ? `Departed ${formatIso(status.flight.actualTimesheet?.takeoffTime ?? status.flight.actualTimesheet?.offBlockTime)}`
                : "Departed",
              title: (
                <>
                  Off from <span className="font-mono">{status.flight.departureAirport.iataCode}</span>
                </>
              ),
              sub: status.flight.departureAirport.name,
            },
            {
              key: "now",
              now: true,
              when: "Now · in cruise",
              title: (
                <>
                  En route to <span className="font-mono">{status.flight.arrivalAirport.iataCode}</span>
                </>
              ),
              sub: status.flight.arrivalAirport.name,
            },
          ]}
        />
      )}

      {status.kind === "assigned" && (
        <FlightView
          flight={status.flight}
          tone="assigned"
          label="Assigned"
          planeAt="22%"
          steps={[
            {
              key: "assigned",
              when: "Assigned",
              title: (
                <>
                  Flight <span className="font-mono">{status.flight.flightNumber}</span>
                </>
              ),
              sub: (
                <>
                  <span className="font-mono font-semibold">{status.flight.departureAirport.iataCode}</span> →{" "}
                  <span className="font-mono font-semibold">{status.flight.arrivalAirport.iataCode}</span>
                </>
              ),
            },
            {
              key: "now",
              now: true,
              when: "Next",
              title: (
                <>
                  Departing <span className="font-mono">{status.flight.departureAirport.iataCode}</span>
                </>
              ),
              sub: status.flight.departureAirport.name,
            },
          ]}
        />
      )}

      {status.kind === "unknown" && (
        <Timeline
          steps={[
            { key: "now", now: true, when: "Now", title: "Status unavailable", sub: "No operational status reported." },
          ]}
        />
      )}
    </Container>
  );
}
