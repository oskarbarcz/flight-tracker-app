import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import { type CreateGateFormData, initCreateGateData } from "~/features/gate";
import { GateFormFields } from "~/features/gate/components/GateFormFields";
import { createGateSchema } from "~/features/gate/schema";
import { gateFormDataToRequest } from "~/features/gate/transformer";
import type { ParkingPosition } from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  airport: Airport;
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  close: () => void;
};

export function CreateGateModal({ airport, terminals, parkingPositions, close }: Props) {
  const { gateService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateGateFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateGateFormData>,
  ) => {
    try {
      const created = await gateService.createNew(airport.id, gateFormDataToRequest(values));
      success(`Gate ${created.name} created.`);
      close();
      revalidator.revalidate();
    } catch (err) {
      handleFormikApiError<CreateGateFormData>(err, setErrors, error, "Failed to create gate.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateGateFormData>
      context="Gate"
      title="Add"
      submitLabel="Create gate"
      initialValues={initCreateGateData(terminals[0]?.id ?? "")}
      validationSchema={createGateSchema}
      onSubmit={handleSubmit}
      close={close}
      size="4xl"
    >
      <GateFormFields airportLocation={airport.location} terminals={terminals} parkingPositions={parkingPositions} />
    </FormModal>
  );
}
