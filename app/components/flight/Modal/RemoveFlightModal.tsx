"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { formatDate } from "~/functions/time";
import { Flight } from "~/models";

type RemoveFlightModalProps = {
  flight: Flight;
  remove: (flightId: string) => void;
  cancel: () => void;
};

export default function RemoveFlightModal({
  flight,
  remove,
  cancel,
}: RemoveFlightModalProps) {
  return (
    <Modal show onClose={cancel}>
      <ModalHeader>Remove flight</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <p>
          You are going to remove flight{" "}
          <span className="font-bold">{flight.flightNumber} </span>
          from{" "}
          <span className="font-bold">
            {flight.departureAirport.city} ({flight.departureAirport.iataCode}){" "}
          </span>
          to{" "}
          <span className="font-bold">
            {flight.destinationAirport.city} (
            {flight.destinationAirport.iataCode})
          </span>
          , departing at{" "}
          <span className="font-bold">
            {formatDate(flight.timesheet.scheduled.takeoffTime)}
          </span>
          .
        </p>
        <p>
          <span className="font-bold">This action is unrecoverable.</span> Are
          you sure to proceed?
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel}>
            Back
          </Button>
          <Button onClick={() => remove(flight.id)} color="red">
            Remove flight {flight.flightNumber}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
