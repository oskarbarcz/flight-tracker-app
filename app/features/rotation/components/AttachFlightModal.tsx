import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { type Flight, FlightPhase, FlightStatus } from "~/features/flight";
import type { RotationLeg } from "~/features/rotation";
import { useApi } from "~/shared/api/useApi";

type Props = {
  operatorId: string;
  leg: RotationLeg;
  onAttach: (flightId: string) => Promise<boolean>;
  onClose: () => void;
};

function normalize(flightNumber: string): string {
  return flightNumber.replace(/\s+/g, "").toUpperCase();
}

function matchesLeg(flight: Flight, leg: RotationLeg, operatorId: string): boolean {
  return (
    flight.status === FlightStatus.Created &&
    flight.operator.id === operatorId &&
    flight.departureAirport.id === leg.departure.id &&
    flight.destinationAirport.id === leg.arrival.id &&
    normalize(flight.flightNumber) === normalize(leg.flightNumber)
  );
}

export function AttachFlightModal({ operatorId, leg, onAttach, onClose }: Props) {
  const { flightService } = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    flightService
      .fetchAllFlights({ phase: FlightPhase.Upcoming })
      .then(({ flights: fetched }) => fetched.filter((flight) => matchesLeg(flight, leg, operatorId)))
      .then(setFlights)
      .finally(() => setLoading(false));
  }, [flightService, operatorId, leg]);

  const attach = async (flightId: string) => {
    const attached = await onAttach(flightId);
    if (attached) {
      onClose();
    }
  };

  return (
    <Modal show onClose={onClose}>
      <ModalHeader>
        Attach flight to {leg.departure.iataCode} → {leg.arrival.iataCode}
      </ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        {loading ? (
          <p className="text-sm text-gray-500">Loading matching flights…</p>
        ) : flights.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40">
            No available <span className="font-semibold">{leg.flightNumber}</span> flight ({leg.departure.iataCode} →{" "}
            {leg.arrival.iataCode}) was found. Create one in “Plan new flight” first.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {flights.map((flight) => (
              <li
                key={flight.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
              >
                <div>
                  <span className="block font-mono font-semibold text-gray-900 dark:text-white">
                    {flight.flightNumber}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {flight.departureAirport.iataCode} → {flight.destinationAirport.iataCode} ·{" "}
                    {flight.aircraft.registration}
                  </span>
                </div>
                <Button size="xs" color="indigo" onClick={() => attach(flight.id)}>
                  Attach
                </Button>
              </li>
            ))}
          </ul>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="gray" outline onClick={onClose} className="ms-auto">
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
