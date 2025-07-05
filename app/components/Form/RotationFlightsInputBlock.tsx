"use client";

import React from "react";
import { Flight, RotationFlight, RotationResponse } from "~/models";
import LegPreview from "./Section/LegPreview";
import { useFlightService } from "~/state/hooks/api/useFlightService";
import { useRotationService } from "~/state/hooks/api/useRotationService";

type RotationFlightsInputBlockProps = {
  rotation: RotationResponse;
  legs: RotationFlight[];
};

export default function RotationFlightsInputBlock({
  rotation,
  legs,
}: RotationFlightsInputBlockProps) {
  const flightService = useFlightService();
  const rotationService = useRotationService();
  const [flights, setFlights] = React.useState<Flight[]>([]);

  React.useEffect(() => {
    if (legs.length === 0) {
      setFlights([]);
      return;
    }

    Promise.all(legs.map((leg) => flightService.getById(leg.id))).then(
      setFlights,
    );
  }, [legs, flightService]);

  const addLegAction = () => {};

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
              removeLegAction={() => removeLegAction(flight)}
            />
          ))}
          <button
            type="button"
            onClick={addLegAction}
            className="mx-auto my-4 block font-bold text-blue-500 hover:text-blue-600"
          >
            Add next leg
          </button>
        </div>
      ) : (
        <span>No flights added yet.</span>
      )}
    </div>
  );
}
