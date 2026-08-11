import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import {
  type CreateParkingPositionFormData,
  initCreateParkingPositionData,
  type ParkingPosition,
} from "~/features/parking-position";
import { ParkingPositionFormFields } from "~/features/parking-position/components/ParkingPositionFormFields";
import { createParkingPositionSchema } from "~/features/parking-position/schema";
import { parkingPositionFormDataToRequest, parkingPositionToFormData } from "~/features/parking-position/transformer";
import type { Terminal } from "~/features/terminal";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  airport: Airport;
  terminals: Terminal[];
  duplicateOf: ParkingPosition | null;
  close: () => void;
};

export function CreateParkingPositionModal({ airport, terminals, duplicateOf, close }: Props) {
  const { parkingPositionService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateParkingPositionFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateParkingPositionFormData>,
  ) => {
    try {
      const created = await parkingPositionService.createNew(airport.id, parkingPositionFormDataToRequest(values));
      success(`Parking position ${created.name} created.`);
      close();
      revalidator.revalidate();
    } catch (err) {
      handleFormikApiError<CreateParkingPositionFormData>(err, setErrors, error, "Failed to create parking position.");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = duplicateOf
    ? { ...parkingPositionToFormData(duplicateOf), name: "" }
    : initCreateParkingPositionData(terminals[0]?.id ?? "");

  return (
    <FormModal<CreateParkingPositionFormData>
      context="Parking stand"
      title={duplicateOf ? `Duplicate ${duplicateOf.name}` : "Add"}
      submitLabel="Create parking stand"
      initialValues={initialValues}
      validationSchema={createParkingPositionSchema}
      onSubmit={handleSubmit}
      close={close}
      size="5xl"
    >
      <ParkingPositionFormFields airportLocation={airport.location} terminals={terminals} />
    </FormModal>
  );
}
