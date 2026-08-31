import { Button } from "flowbite-react";
import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import { FlightServiceType, type Loadsheet } from "~/features/flight";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { UpdateFinalLoadsheetModal } from "~/features/flight/components/Modal/UpdateFinalLoadsheetModal";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { describeLoadsheetRefusal } from "~/features/flight/lib/loadsheetRefusal";
import { EMPTY_LOADSHEET } from "~/features/flight/lib/loadsheets";
import { describeReconciliation, reconcileManifest } from "~/features/flight/lib/reconciliation";
import type { FlightManifest } from "~/features/flight/model";
import { useApi } from "~/shared/api/useApi";

export function FinishBoardingButton({ disabled }: FlightProgressButtonProps) {
  const { flight, loadsheets, finishBoarding } = useTrackedFlight();
  const { flightService } = useApi();
  const { success, error } = useToast();
  const [showModal, setShowModal] = useState(false);
  const handlingNoun = flight?.serviceType === FlightServiceType.Cargo ? "loading" : "boarding";

  const readManifest = async (): Promise<FlightManifest | null> => {
    if (!flight || flight.aircraft.cabinLayout === null) {
      return null;
    }

    return flightService.fetchManifestByFlightId(flight.id).catch(() => null);
  };

  const reportReconciliation = async (released: FlightManifest | null): Promise<void> => {
    if (released === null) {
      return;
    }

    try {
      const boarded = await readManifest();

      if (boarded === null) {
        return;
      }

      const reconciliation = reconcileManifest(released, boarded);

      if (reconciliation !== null) {
        success(describeReconciliation(reconciliation));
      }
    } catch {
      return;
    }
  };

  const handleFinishBoarding = async (loadsheet: Loadsheet): Promise<void> => {
    const released = await readManifest();

    await finishBoarding(loadsheet)
      .then(async () => {
        setShowModal(false);
        await reportReconciliation(released);
      })
      .catch((err: unknown) => {
        const refusal = describeLoadsheetRefusal(err, flight?.aircraft.cabinLayout?.id ?? null);

        if (refusal === null) {
          console.error("Failed to finish boarding", err);
          error(`Could not finish ${handlingNoun}. Please try again.`);
          return;
        }

        error(refusal);
      });
  };

  if (!flight) {
    return null;
  }

  return (
    <>
      <Button color="indigo" outline onClick={() => setShowModal(true)} disabled={disabled}>
        Finish {handlingNoun}
      </Button>
      {showModal && (
        <UpdateFinalLoadsheetModal
          flight={flight}
          preliminary={loadsheets.preliminary ?? EMPTY_LOADSHEET}
          update={handleFinishBoarding}
          cancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
