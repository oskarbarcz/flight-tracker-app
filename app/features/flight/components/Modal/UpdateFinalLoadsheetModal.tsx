import React from "react";
import type { Flight, Loadsheet } from "~/features/flight";
import { LoadsheetFormModal } from "~/features/flight/components/Modal/LoadsheetFormModal";

type UpdateFinalLoadsheetModalProps = {
  flight: Flight;
  update: (loadsheet: Loadsheet) => void;
  cancel: () => void;
};

export function UpdateFinalLoadsheetModal({ flight, update, cancel }: UpdateFinalLoadsheetModalProps) {
  return (
    <LoadsheetFormModal
      action={{ fuel: "Confirm final fuel", weights: "Confirm final weights" }}
      formId="updateFinalLoadsheetForm"
      loadsheet={flight.loadsheets.preliminary as Loadsheet}
      confirmLabel="Confirm weights and continue to pushback"
      submit={update}
      cancel={cancel}
    />
  );
}
