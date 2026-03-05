"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import LegPreview from "~/components/operator/Form/Preview/LegPreview";
import { Flight, FlightPhase, FlightStatus, RotationResponse } from "~/models";
import { useApi } from "~/state/contexts/content/api.context";

type PickFlightModalProps = {
  rotation: RotationResponse;
  close: () => void;
};

function excludeNonCreatedFlights(flights: Flight[]) {
  return flights.filter((flight) => flight.status === FlightStatus.Created);
}

function excludeFlightsWithRotations(flights: Flight[]) {
  console.log(flights);
  return flights.filter((flight) => !flight.rotationId);
}

export default function PickFlightModal({
  rotation,
  close,
}: PickFlightModalProps) {
  const { flightService, rotationService } = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [addedFlightsIds, setAddedFlightsIds] = useState<string[]>([]);

  useEffect(() => {
    flightService
      .fetchAllFlights({ phase: FlightPhase.Upcoming })
      .then((paginated) => paginated.flights)
      .then(excludeNonCreatedFlights)
      .then(excludeFlightsWithRotations)
      .then(setFlights);
  }, [flightService]);

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
        <Button outline color="gray" onClick={close}>
          Back to rotation
        </Button>
      </ModalFooter>
    </Modal>
  );
}
