import React from "react";
import type { Flight, Loadsheet } from "~/features/flight";
import { LoadsheetFormModal } from "~/features/flight/components/Modal/LoadsheetFormModal";
import { useCabinCapacity } from "~/features/flight/hooks/useCabinCapacity";
import { EMPTY_LOADSHEET } from "~/features/flight/lib/loadsheets";

type Props = {
  flight: Flight;
  preliminary: Loadsheet | null;
  update: (flightId: string, loadsheet: Loadsheet) => void;
  cancel: () => void;
};

export function UpdatePreliminaryLoadsheetModal({ flight, preliminary, update, cancel }: Props) {
  const capacity = useCabinCapacity(flight);
  const oldLoadsheet = preliminary ?? EMPTY_LOADSHEET;

  return (
    <LoadsheetFormModal
      action={{ load: "Plan preliminary payload", fuel: "Plan preliminary fuel", notoc: "" }}
      formId="updatePreliminaryLoadsheetForm"
      loadsheet={oldLoadsheet}
      timesheet={flight.timesheet}
      capacity={capacity}
      serviceType={flight.serviceType}
      confirmLabel="Update loadsheet for flight"
      confirmTrailing={<span className="font-mono font-bold">{flight.flightNumberWithoutSpaces}</span>}
      submit={(loadsheet) => update(flight.id, loadsheet)}
      cancel={cancel}
    />
  );
}
