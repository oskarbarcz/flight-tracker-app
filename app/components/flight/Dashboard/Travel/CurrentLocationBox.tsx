import { Button } from "flowbite-react";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaCircleCheck, FaCircleInfo, FaForward, FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router";
import { InitiateTravelModal } from "~/components/flight/Dashboard/Travel/InitiateTravelModal";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerEmptyState } from "~/components/shared/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import { TravelType, type UserTravel, type UserTravelAirport } from "~/models";

type Props = {
  currentLocation: UserTravelAirport | null;
  latestTravel: UserTravel | null;
  flightNumber?: string;
  onTravelCreated: () => void;
};

const ARRIVAL_VERB: Record<TravelType, string> = {
  [TravelType.PerformingFlight]: "Arrived from",
  [TravelType.DeadHeadManual]: "Moved from",
  [TravelType.DeadHeadAutomatic]: "Repositioned from",
};

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</span>
      <span className="truncate font-medium text-gray-700 dark:text-gray-200">{value}</span>
    </div>
  );
}

export function CurrentLocationBox({ currentLocation, latestTravel, flightNumber, onTravelCreated }: Props) {
  const [showModal, setShowModal] = useState(false);
  const inTransit = latestTravel?.isPending ?? false;
  const airport = inTransit && latestTravel ? latestTravel.destinationAirport : currentLocation;
  const Pin = inTransit ? FaForward : FaLocationDot;

  return (
    <Container padding="condensed">
      <ContainerTitle icon={Pin} title={inTransit ? "Travelling to" : "Current location"} />

      {airport && latestTravel ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-12 flex-none items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-400 text-white shadow-sm shadow-indigo-500/30 dark:from-indigo-600 dark:to-indigo-500">
              <Pin size={20} />
            </span>
            <div className="min-w-0">
              <span className="block text-2xl font-bold leading-none">{airport.iataCode}</span>
              <span className="mt-1 block truncate text-sm text-gray-500 dark:text-gray-400">{airport.name}</span>
            </div>
            {!inTransit && (
              <span className="ms-auto flex flex-none items-center gap-1.5 self-start text-xs font-semibold text-green-600 dark:text-green-400">
                <FaCircleCheck size={11} />
                You are here
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
            {inTransit ? (
              <>
                <MetaRow
                  label="Departed"
                  value={`${latestTravel.departureAirport.iataCode} · ${latestTravel.departureAirport.name}`}
                />
                {flightNumber && <MetaRow label="Flight number" value={flightNumber} />}
                <MetaRow label="Distance" value={`${latestTravel.distance} nm`} />
              </>
            ) : (
              <>
                <MetaRow
                  label={ARRIVAL_VERB[latestTravel.type]}
                  value={
                    flightNumber
                      ? `${latestTravel.departureAirport.iataCode} · ${flightNumber}`
                      : latestTravel.departureAirport.iataCode
                  }
                />
                <MetaRow label="Distance" value={`${latestTravel.distance} nm`} />
              </>
            )}
          </div>
        </div>
      ) : (
        <ContainerEmptyState>
          <FaCircleInfo className="inline mr-2" />
          <span>Location unknown.</span>
        </ContainerEmptyState>
      )}

      <div className="flex justify-end gap-2">
        <Button color="alternative" as={Link} to="/travels" viewTransition>
          History
        </Button>
        <Button color="indigo" onClick={() => setShowModal(true)} disabled={inTransit}>
          New travel
          <FaArrowRight className="inline ml-2" aria-hidden="true" />
        </Button>
      </div>

      {showModal && (
        <InitiateTravelModal
          close={() => setShowModal(false)}
          onTravelCreated={onTravelCreated}
          currentAirportId={currentLocation?.id}
        />
      )}
    </Container>
  );
}
