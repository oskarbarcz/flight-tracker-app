import React, { useEffect, useState } from "react";
import { type Flight, FlightServiceType, type Loadsheet } from "~/features/flight";
import { LoadsheetFormModal } from "~/features/flight/components/Modal/LoadsheetFormModal";
import { type FlatLoadsheetFormData, loadsheetToFlatLoadsheet } from "~/features/flight/form-types";
import { useCabinCapacity } from "~/features/flight/hooks/useCabinCapacity";
import { NotocConfirmationStep } from "~/features/notoc/components/NotocConfirmationStep";
import { useApi } from "~/shared/api/useApi";

type Props = {
  flight: Flight;
  update: (loadsheet: Loadsheet) => void;
  cancel: () => void;
};

export function UpdateFinalLoadsheetModal({ flight, update, cancel }: Props) {
  const { flightService } = useApi();
  const capacity = useCabinCapacity(flight);
  const preliminary = flight.loadsheets.preliminary as Loadsheet;
  const [initialValues, setInitialValues] = useState<FlatLoadsheetFormData | null>(null);

  const isCargo = flight.serviceType === FlightServiceType.Cargo;
  const carriesPassengers = !isCargo && flight.aircraft.cabinLayout !== null;

  useEffect(() => {
    if (!carriesPassengers) {
      setInitialValues(loadsheetToFlatLoadsheet(preliminary));
      return;
    }

    let cancelled = false;

    flightService
      .fetchManifestByFlightId(flight.id)
      .then((manifest) => {
        if (!cancelled) {
          setInitialValues({
            ...loadsheetToFlatLoadsheet(preliminary),
            passengers: manifest.passengerCount,
            passengersByCabin: manifest.passengersByCabin,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setInitialValues(loadsheetToFlatLoadsheet(preliminary));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [flightService, flight.id, preliminary, carriesPassengers]);

  if (initialValues === null) {
    return null;
  }

  return (
    <LoadsheetFormModal
      action={{ load: "Confirm payload", fuel: "Confirm final fuel", notoc: "Confirm notification to captain" }}
      formId="updateFinalLoadsheetForm"
      loadsheet={preliminary}
      initialValues={initialValues}
      timesheet={flight.timesheet}
      capacity={capacity}
      serviceType={flight.serviceType}
      requiresConfirmation
      notoc={<NotocConfirmationStep flight={flight} />}
      confirmLabel={isCargo ? "Finish loading" : "Finish boarding"}
      confirmTrailing={<span className="font-mono font-bold">{flight.flightNumberWithoutSpaces}</span>}
      submit={update}
      cancel={cancel}
    />
  );
}
