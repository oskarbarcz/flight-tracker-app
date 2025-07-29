"use client";

import React from "react";
import { Flight, RotationFlight, RotationResponse } from "~/models";
import LegPreview from "./Section/LegPreview";
import PickFlightModal from "~/components/Modal/PickFlightModal";
import { Button } from "flowbite-react";
import { useApi } from "~/state/contexts/api.context";

type RotationFlightsInputBlockProps = {
  rotation: RotationResponse;
  legs: RotationFlight[];
  updateLegs: () => void;
};

export default function RotationFlightsInputBlock({
  rotation,
  legs,
  updateLegs,
}: RotationFlightsInputBlockProps) {
  const { flightService, rotationService } = useApi();
  const [flights, setFlights] = React.useState<Flight[]>([]);
  const [showFlightPicker, setShowFlightPicker] = React.useState(false);

  React.useEffect(() => {
    if (legs.length === 0) {
      setFlights([]);
      return;
    }

    Promise.all(legs.map((leg) => flightService.getById(leg.id))).then(
      setFlights,
    );
  }, [legs, flightService]);

  const onPickerClose = () => {
    setShowFlightPicker(false);
    updateLegs();
  };

  const removeLegAction = (flight: Flight) => {
    rotationService.removeFlight(rotation.id, flight.id).then(() => {
      setFlights(flights.filter((eachFlight) => eachFlight.id !== flight.id));
    });
  };

  return (
    <div>
      <div className="mb-2 block text-sm">Legs</div>
      {flights.length > 0 ? (
        <div>
          {flights.map((flight) => (
            <LegPreview
              key={flight.id}
              flight={flight}
              actionButton={
                <Button color="light" onClick={() => removeLegAction(flight)}>
                  Remove
                </Button>
              }
            />
          ))}
          <button
            type="button"
            onClick={() => setShowFlightPicker(true)}
            className="mx-auto my-4 block font-bold text-blue-500 hover:text-blue-600"
          >
            Add next leg
          </button>
        </div>
      ) : (
        <div>
          <p className="mt-4 block text-center">
            Currently there are no legs in this rotation.
          </p>
          <button
            type="button"
            onClick={() => setShowFlightPicker(true)}
            className="mx-auto mb-4 mt-1 block font-bold text-blue-500 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-400"
          >
            Add first leg
          </button>
        </div>
      )}

      {showFlightPicker && (
        <PickFlightModal rotation={rotation} close={onPickerClose} />
      )}
    </div>
  );
}
