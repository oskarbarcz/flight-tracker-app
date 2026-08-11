import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import type { CreateGateFormData, Gate } from "~/features/gate";
import { GateFormFields } from "~/features/gate/components/GateFormFields";
import { createGateSchema } from "~/features/gate/schema";
import { gateFormDataToRequest, gateToFormData } from "~/features/gate/transformer";
import type { ParkingPosition } from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  airport: Airport;
  gate: Gate;
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  close: () => void;
};

export function EditGateModal({ airport, gate, terminals, parkingPositions, close }: Props) {
  const { gateService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateGateFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateGateFormData>,
  ) => {
    try {
      await gateService.update(airport.id, gate.id, gateFormDataToRequest(values));
      success(`Gate ${gate.name} updated.`);
      close();
      revalidator.revalidate();
    } catch (err) {
      handleFormikApiError<CreateGateFormData>(err, setErrors, error, "Failed to update gate.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateGateFormData>
      context="Gate"
      title={`Edit ${gate.name}`}
      submitLabel="Save changes"
      initialValues={gateToFormData(gate)}
      validationSchema={createGateSchema}
      onSubmit={handleSubmit}
      close={close}
    >
      <GateFormFields airportLocation={airport.location} terminals={terminals} parkingPositions={parkingPositions} />
    </FormModal>
  );
}
