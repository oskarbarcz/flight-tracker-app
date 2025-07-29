"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { Flight, RotationResponse } from "~/models";
import LegPreview from "~/components/Form/Preview/LegPreview";
import { FaCheck } from "react-icons/fa";
import { useApi } from "~/state/contexts/api.context";

type PickFlightModalProps = {
  rotation: RotationResponse;
  close: () => void;
};

export default function PickFlightModal({
  rotation,
  close,
}: PickFlightModalProps) {
  const { flightService, rotationService } = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [addedFlightsIds, setAddedFlightsIds] = useState<string[]>([]);

  useEffect(() => {
    const currentRotationFlightsIds = rotation.flights.map(
      (flight) => flight.id,
    );
    flightService
      .fetchAllCreatedFlights()
      .then((flights) =>
        flights.filter(
          (flight) => !currentRotationFlightsIds.includes(flight.id),
        ),
      )
      .then(setFlights);
  }, [flightService, rotation.flights, addedFlightsIds]);

  const addLegAction = (flightId: string) => {
    setAddedFlightsIds((prev) => [...prev, flightId]);
    rotationService.addFlight(rotation.id, flightId).then();
  };

  return (
    <Modal show onClose={close}>
      <ModalHeader>Add leg</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <div>
          {flights.length > 0 &&
            flights.map((flight) => (
              <LegPreview
                key={flight.id}
                flight={flight}
                actionButton={
                  <Button
                    disabled={addedFlightsIds.includes(flight.id)}
                    color="light"
                    onClick={() => addLegAction(flight.id)}
                  >
                    {addedFlightsIds.includes(flight.id) ? (
                      <span>
                        Added <FaCheck className="inline-block" />
                      </span>
                    ) : (
                      <span>Add</span>
                    )}
                  </Button>
                }
              />
            ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button onClick={close}>Back to rotation</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
