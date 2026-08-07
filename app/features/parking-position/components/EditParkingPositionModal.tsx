import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import type { CreateParkingPositionFormData, ParkingPosition } from "~/features/parking-position";
import { ParkingPositionFormFields } from "~/features/parking-position/components/ParkingPositionFormFields";
import { createParkingPositionSchema } from "~/features/parking-position/schema";
import { parkingPositionFormDataToRequest, parkingPositionToFormData } from "~/features/parking-position/transformer";
import type { Terminal } from "~/features/terminal";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  airport: Airport;
  parkingPosition: ParkingPosition;
  terminals: Terminal[];
  close: () => void;
};

export function EditParkingPositionModal({ airport, parkingPosition, terminals, close }: Props) {
  const { parkingPositionService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateParkingPositionFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateParkingPositionFormData>,
  ) => {
    try {
      await parkingPositionService.update(airport.id, parkingPosition.id, parkingPositionFormDataToRequest(values));
      success(`Parking position ${parkingPosition.name} updated.`);
      close();
      revalidator.revalidate();
    } catch (err) {
      handleFormikApiError<CreateParkingPositionFormData>(err, setErrors, error, "Failed to update parking position.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateParkingPositionFormData>
      title={`Edit parking stand ${parkingPosition.name}`}
      submitLabel="Save changes"
      initialValues={parkingPositionToFormData(parkingPosition)}
      validationSchema={createParkingPositionSchema}
      onSubmit={handleSubmit}
      close={close}
    >
      <ParkingPositionFormFields airportLocation={airport.location} terminals={terminals} />
    </FormModal>
  );
}
