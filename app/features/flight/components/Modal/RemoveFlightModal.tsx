import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import type { Flight } from "~/features/flight";
import { formatDate } from "~/shared/lib/time";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  flight: Flight;
  remove: (flightId: string) => void;
  cancel: () => void;
};

export function RemoveFlightModal({ flight, remove, cancel }: Props) {
  return (
    <Modal show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Flight" action="Remove" />
      </ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <p>
          You are going to remove flight <span className="font-bold">{flight.flightNumber} </span>
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
        <p>
          <span className="font-bold">This action is unrecoverable.</span> Are you sure to proceed?
        </p>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back", onClick: cancel }}
        confirm={{ label: `Remove flight ${flight.flightNumber}`, onClick: () => remove(flight.id), tone: "danger" }}
      />
    </Modal>
  );
}
