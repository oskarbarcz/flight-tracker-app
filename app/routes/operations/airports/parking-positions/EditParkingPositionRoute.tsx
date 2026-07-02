import type { Route } from ".react-router/types/app/routes/operations/airports/parking-positions/+types/EditParkingPositionRoute";
import { Formik, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import { AirportService } from "~/features/airport/service";
import { createParkingPositionSchema } from "~/features/parking-position/schema";
import { ParkingPositionService } from "~/features/parking-position/service";
import { parkingPositionFormDataToRequest, parkingPositionToFormData } from "~/features/parking-position/transformer";
import { TerminalService } from "~/features/terminal/service";
import type { CreateParkingPositionFormData } from "~/models";
import { ParkingPositionFormBody } from "~/routes/operations/airports/parking-positions/CreateParkingPositionRoute";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [airport, parkingPosition, terminals] = await Promise.all([
    new AirportService().fetchById(params.id),
    new ParkingPositionService().fetchById(params.id, params.parkingPositionId),
    new TerminalService().fetchAll(params.id),
  ]);
  return { airport, parkingPosition, terminals };
}

export default function EditParkingPositionRoute({ params, loaderData }: Route.ComponentProps) {
  const { airport, parkingPosition, terminals } = loaderData;
  usePageTitle(`Edit parking position ${parkingPosition.name}`);

  const { parkingPositionService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateParkingPositionFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateParkingPositionFormData>,
  ) => {
    try {
      await parkingPositionService.update(params.id, parkingPosition.id, parkingPositionFormDataToRequest(values));
      navigate(`/airports/${params.id}/parking-positions`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateParkingPositionFormData>(err, setErrors, error, "Failed to update parking position.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <SectionHeader title={`Edit parking position ${parkingPosition.name}`} />

      <Formik<CreateParkingPositionFormData>
        initialValues={parkingPositionToFormData(parkingPosition)}
        validationSchema={createParkingPositionSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <ParkingPositionFormBody
            airport={airport}
            terminals={terminals}
            isSubmitting={isSubmitting}
            submitLabel="Save changes"
          />
        )}
      </Formik>
    </div>
  );
}
