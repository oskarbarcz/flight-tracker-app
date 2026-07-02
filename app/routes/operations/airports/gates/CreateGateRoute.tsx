import type { Route } from ".react-router/types/app/routes/operations/airports/gates/+types/CreateGateRoute";
import { Button } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers, useFormikContext } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import { AirportService } from "~/features/airport/service";
import { type CreateGateFormData, gateCategoryOptions, initCreateGateData } from "~/features/gate";
import { createGateSchema } from "~/features/gate/schema";
import { GateService } from "~/features/gate/service";
import { gateFormDataToRequest } from "~/features/gate/transformer";
import type { ParkingPosition } from "~/features/parking-position";
import { ParkingPositionService } from "~/features/parking-position/service";
import type { Terminal } from "~/features/terminal";
import { TerminalService } from "~/features/terminal/service";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/shared/ui/Form/Managed/ManagedSelectBlock";
import { PointCoordinatesPicker } from "~/shared/ui/Form/MapPicker/PointCoordinatesPicker";
import { Container } from "~/shared/ui/Layout/Container";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [airport, terminals, parkingPositions] = await Promise.all([
    new AirportService().fetchById(params.id),
    new TerminalService().fetchAll(params.id),
    new ParkingPositionService().fetchAll(params.id),
  ]);
  return { airport, terminals, parkingPositions };
}

export default function CreateGateRoute({ params, loaderData }: Route.ComponentProps) {
  usePageTitle("Create new gate");
  const { airport, terminals, parkingPositions } = loaderData;

  const { gateService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateGateFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateGateFormData>,
  ) => {
    try {
      await gateService.createNew(params.id, gateFormDataToRequest(values));
      navigate(`/airports/${params.id}/gates`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateGateFormData>(err, setErrors, error, "Failed to create gate.");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = initCreateGateData(terminals[0]?.id ?? "");

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <SectionHeader title="Create new gate" />

      <Formik<CreateGateFormData>
        initialValues={initialValues}
        validationSchema={createGateSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <GateFormBody
            airport={airport}
            terminals={terminals}
            parkingPositions={parkingPositions}
            isSubmitting={isSubmitting}
            submitLabel="Create gate"
          />
        )}
      </Formik>
    </div>
  );
}

type FormBodyProps = {
  airport: Airport;
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  isSubmitting: boolean;
  submitLabel: string;
};

export function GateFormBody({ airport, terminals, parkingPositions, isSubmitting, submitLabel }: FormBodyProps) {
  const { values } = useFormikContext<CreateGateFormData>();
  const terminalOptions = terminals.map((t) => ({ value: t.id, label: `${t.shortName} · ${t.fullName}` }));
  const parkingPositionOptions = [
    { value: "", label: "— No parking position —" },
    ...parkingPositions.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <FormikForm noValidate>
      <Container>
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Identification</h3>
          <div className="flex gap-4">
            <div className="basis-1/2">
              <ManagedSelectBlock field="terminalId" label="Terminal" options={terminalOptions} />
            </div>
            <div className="basis-1/2">
              <ManagedInputBlock field="name" label="Gate name" />
            </div>
          </div>
          <ManagedSelectBlock field="category" label="Category" options={gateCategoryOptions} />
          <ManagedSelectBlock
            field="parkingPositionId"
            label="Served parking position"
            required={false}
            options={parkingPositionOptions}
          />

          <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3">Location</h3>
          <PointCoordinatesPicker
            field="coordinates"
            airportLocation={airport.location}
            label="Click on the map to pick the gate location (optional)"
            pinLabel={values.name}
          />
        </div>
      </Container>

      <div className="flex justify-end pt-4">
        <Button type="submit" color="indigo" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </FormikForm>
  );
}
