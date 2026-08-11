import React from "react";
import type { Flight, Loadsheet } from "~/features/flight";
import { LoadsheetFormModal } from "~/features/flight/components/Modal/LoadsheetFormModal";

type Props = {
  flight: Flight;
  update: (flightId: string, loadsheet: Loadsheet) => void;
  cancel: () => void;
};

export function UpdatePreliminaryLoadsheetModal({ flight, update, cancel }: Props) {
  const oldLoadsheet = flight.loadsheets.preliminary ?? {
    flightCrew: { pilots: 0, reliefPilots: 0, cabinCrew: 0 },
    passengers: 0,
    zeroFuelWeight: 0,
    cargo: 0,
    payload: 0,
    blockFuel: 0,
    fuel: null,
  };

  return (
    <LoadsheetFormModal
      action={{ fuel: "Plan preliminary fuel", weights: "Plan preliminary weights" }}
      formId="updatePreliminaryLoadsheetForm"
      loadsheet={oldLoadsheet}
      timesheet={flight.timesheet}
      confirmLabel="Update loadsheet for flight"
      confirmTrailing={<span className="font-mono font-bold">{flight.flightNumberWithoutSpaces}</span>}
      submit={(loadsheet) => update(flight.id, loadsheet)}
      cancel={cancel}
    />
  );
}
