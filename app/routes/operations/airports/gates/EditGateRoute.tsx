import type { Route } from ".react-router/types/app/routes/operations/airports/gates/+types/EditGateRoute";
import { Formik, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import { createGateSchema } from "~/features/gate/schema";
import { GateService } from "~/features/gate/service";
import { gateFormDataToRequest, gateToFormData } from "~/features/gate/transformer";
import { ParkingPositionService } from "~/features/parking-position/service";
import { TerminalService } from "~/features/terminal/service";
import type { CreateGateFormData } from "~/models";
import { GateFormBody } from "~/routes/operations/airports/gates/CreateGateRoute";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [gate, terminals, parkingPositions] = await Promise.all([
    new GateService().fetchById(params.id, params.gateId),
    new TerminalService().fetchAll(params.id),
    new ParkingPositionService().fetchAll(params.id),
  ]);
  return { gate, terminals, parkingPositions };
}

export default function EditGateRoute({ params, loaderData }: Route.ComponentProps) {
  const { gate, terminals, parkingPositions } = loaderData;
  usePageTitle(`Edit gate ${gate.name}`);

  const { gateService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateGateFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateGateFormData>,
  ) => {
    try {
      await gateService.update(params.id, gate.id, gateFormDataToRequest(values));
      navigate(`/airports/${params.id}/gates`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateGateFormData>(err, setErrors, error, "Failed to update gate.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <SectionHeader title={`Edit gate ${gate.name}`} />

      <Formik<CreateGateFormData>
        initialValues={gateToFormData(gate)}
        validationSchema={createGateSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <GateFormBody
            terminals={terminals}
            parkingPositions={parkingPositions}
            isSubmitting={isSubmitting}
            submitLabel="Save changes"
          />
        )}
      </Formik>
    </div>
  );
}
