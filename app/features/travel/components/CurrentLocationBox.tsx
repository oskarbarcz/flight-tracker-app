import { Button } from "flowbite-react";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaCircleCheck, FaCircleInfo, FaForward, FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router";
import { TravelType, type UserTravel, type UserTravelAirport } from "~/features/travel";
import { InitiateTravelModal } from "~/features/travel/components/InitiateTravelModal";
import { AirportEndpoint } from "~/shared/ui/Display/AirportEndpoint";
import { MetaRow } from "~/shared/ui/Display/MetaRow";
import { BoxFooter } from "~/shared/ui/Layout/BoxFooter";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

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
            <span className="flex size-12 flex-none items-center justify-center rounded-2xl bg-indigo-500 text-white dark:bg-indigo-600">
              <Pin size={20} />
            </span>
            <AirportEndpoint iataCode={airport.iataCode} name={airport.name} />
            {!inTransit && (
              <span className="ms-auto flex flex-none items-center gap-1.5 self-start text-xs font-semibold text-green-600 dark:text-green-400">
                <FaCircleCheck size={11} />
                You are here
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-3 dark:border-gray-800">
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

      <BoxFooter>
        <Button color="alternative" as={Link} to="/travels" viewTransition>
          History
        </Button>
        <Button color="indigo" onClick={() => setShowModal(true)} disabled={inTransit}>
          New travel
          <FaArrowRight className="inline ml-2" aria-hidden="true" />
        </Button>
      </BoxFooter>

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
