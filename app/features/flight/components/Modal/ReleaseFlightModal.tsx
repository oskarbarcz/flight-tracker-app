import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import type { Flight } from "~/features/flight";
import { formatDate } from "~/shared/lib/time";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  flight: Flight;
  release: (flightId: string) => void;
  cancel: () => void;
};

export function ReleaseFlightModal({ flight, release, cancel }: Props) {
  return (
    <Modal show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Flight" action="Release" />
      </ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <p>
          You are going to release flight <span className="font-bold">{flight.flightNumber} </span>
          from{" "}
          <span className="font-bold">
            {flight.departureAirport.city} ({flight.departureAirport.iataCode}){" "}
          </span>
          to{" "}
          <span className="font-bold">
            {flight.destinationAirport.city} ({flight.destinationAirport.iataCode})
          </span>
          , departing at <span className="font-bold">{formatDate(flight.timesheet.scheduled.takeoffTime)}</span>.
        </p>
        <p className="my-4">
          After you release the flight, the pilot will be able to start the flight plan.{" "}
          <span className="font-bold">Removing a flight </span>
          and
          <span className="font-bold"> changing the schedule </span>
          won't be available anymore.
        </p>
        <p className="my-4">Are you sure to proceed?</p>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back", onClick: cancel }}
        confirm={{
          label: "Release flight",
          onClick: () => release(flight.id),
          trailing: <span className="font-mono font-bold">{flight.flightNumberWithoutSpaces}</span>,
        }}
      />
    </Modal>
  );
}
