import type { Route } from ".react-router/types/app/routes/operations/airports/parking-positions/+types/CreateParkingPositionRoute";
import { Button, Label, Textarea } from "flowbite-react";
import { Field, Formik, Form as FormikForm, type FormikHelpers, useFormikContext } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import { createParkingPositionSchema } from "~/features/parking-position/schema";
import { ParkingPositionService } from "~/features/parking-position/service";
import { parkingPositionFormDataToRequest, parkingPositionToFormData } from "~/features/parking-position/transformer";
import { TerminalService } from "~/features/terminal/service";
import {
  type Airport,
  bridgeOptions,
  type CreateParkingPositionFormData,
  DeicingCapability,
  deicingOptions,
  fuelingOptionsList,
  gateLocationOptions,
  groundUnitOptions,
  initCreateParkingPositionData,
  NoiseSensitivity,
  noiseSensitivityOptions,
  parkingAssistanceOptions,
  parkingPositionTypeOptions,
  parkingSpotTypeOptions,
  stairsOptions,
  type Terminal,
} from "~/models";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/shared/ui/Form/Managed/ManagedSelectBlock";
import { PointCoordinatesPicker } from "~/shared/ui/Form/MapPicker/PointCoordinatesPicker";
import { Container } from "~/shared/ui/Layout/Container";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";
import { AirportService } from "~/state/api/airport.service";

export async function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  const duplicateFrom = new URL(request.url).searchParams.get("duplicateFrom");
  const [airport, terminals, source] = await Promise.all([
    new AirportService().fetchById(params.id),
    new TerminalService().fetchAll(params.id),
    duplicateFrom ? new ParkingPositionService().fetchById(params.id, duplicateFrom) : Promise.resolve(null),
  ]);
  return { airport, terminals, source };
}

export default function CreateParkingPositionRoute({ params, loaderData }: Route.ComponentProps) {
  usePageTitle("Create new parking position");
  const { airport, terminals, source } = loaderData;

  const { parkingPositionService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateParkingPositionFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateParkingPositionFormData>,
  ) => {
    try {
      await parkingPositionService.createNew(params.id, parkingPositionFormDataToRequest(values));
      navigate(`/airports/${params.id}/parking-positions`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateParkingPositionFormData>(err, setErrors, error, "Failed to create parking position.");
    } finally {
      setSubmitting(false);
    }
  };

  const initialTerminalId = terminals[0]?.id ?? "";
  const initialValues = source
    ? { ...parkingPositionToFormData(source), name: "" }
    : initCreateParkingPositionData(initialTerminalId);

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <SectionHeader title="Create new parking position" />

      <Formik<CreateParkingPositionFormData>
        initialValues={initialValues}
        validationSchema={createParkingPositionSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <ParkingPositionFormBody
            airport={airport}
            terminals={terminals}
            isSubmitting={isSubmitting}
            submitLabel="Create parking position"
          />
        )}
      </Formik>
    </div>
  );
}

type FormBodyProps = {
  airport: Airport;
  terminals: Terminal[];
  isSubmitting: boolean;
  submitLabel: string;
};

export function ParkingPositionFormBody({ airport, terminals, isSubmitting, submitLabel }: FormBodyProps) {
  const { values, errors, touched } = useFormikContext<CreateParkingPositionFormData>();
  const noiseActive = values.noiseSensitivity === NoiseSensitivity.Yes;
  const deicingActive = values.deicing !== DeicingCapability.No;

  const terminalOptions = terminals.map((t) => ({ value: t.id, label: `${t.shortName} · ${t.fullName}` }));

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
              <ManagedInputBlock field="name" label="Parking position name" />
            </div>
          </div>
          <ManagedSelectBlock field="location" label="Parking location" options={gateLocationOptions} />

          <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3">Boarding</h3>
          <div className="flex gap-4">
            <ManagedSelectBlock className="basis-1/2" field="bridge" label="Jet bridge" options={bridgeOptions} />
            <ManagedSelectBlock className="basis-1/2" field="stairs" label="Stairs boarding" options={stairsOptions} />
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3">Parking</h3>
          <div className="flex gap-4">
            <ManagedSelectBlock
              className="basis-1/2"
              field="type"
              label="Position"
              options={parkingPositionTypeOptions}
            />
            <ManagedSelectBlock
              className="basis-1/2"
              field="spotType"
              label="Spot type"
              options={parkingSpotTypeOptions}
            />
          </div>
          <ManagedSelectBlock field="assistance" label="Parking assistance" options={parkingAssistanceOptions} />

          <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3">Services</h3>
          <div className="flex gap-4">
            <ManagedSelectBlock className="basis-1/2" field="gpu" label="GPU" options={groundUnitOptions} />
            <ManagedSelectBlock className="basis-1/2" field="pca" label="PCA" options={groundUnitOptions} />
          </div>
          <ManagedSelectBlock field="fuelingOptions" label="Fueling" options={fuelingOptionsList} />

          <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3">Deicing</h3>
          <ManagedSelectBlock field="deicing" label="Deicing capability" options={deicingOptions} />
          {deicingActive ? (
            <div className="mb-4 w-full">
              <div className="mb-2 block">
                <Label htmlFor="deicingDescription">Deicing notes</Label>
              </div>
              <Field
                as={Textarea}
                id="deicingDescription"
                name="deicingDescription"
                rows={3}
                placeholder="Free-text notes about deicing logistics."
              />
              <InputErrorList
                errorFocus={Boolean(touched.deicingDescription && errors.deicingDescription)}
                errors={touched.deicingDescription && errors.deicingDescription ? [errors.deicingDescription] : []}
              />
            </div>
          ) : null}

          <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3">Noise sensitivity</h3>
          <ManagedSelectBlock
            field="noiseSensitivity"
            label="Noise-sensitive area?"
            options={noiseSensitivityOptions}
          />
          {noiseActive ? (
            <>
              <div className="flex gap-4">
                <ManagedInputBlock
                  field="noiseSensitivityStartTime"
                  label="Curfew start (UTC HH:mm)"
                  required={false}
                />
                <ManagedInputBlock field="noiseSensitivityEndTime" label="Curfew end (UTC HH:mm)" required={false} />
              </div>
              <div className="mb-4 w-full">
                <div className="mb-2 block">
                  <Label htmlFor="noiseSensitivityText">Noise restrictions notes</Label>
                </div>
                <Field
                  as={Textarea}
                  id="noiseSensitivityText"
                  name="noiseSensitivityText"
                  rows={3}
                  placeholder="Free-text notes about noise restrictions."
                />
                <InputErrorList
                  errorFocus={Boolean(touched.noiseSensitivityText && errors.noiseSensitivityText)}
                  errors={
                    touched.noiseSensitivityText && errors.noiseSensitivityText ? [errors.noiseSensitivityText] : []
                  }
                />
              </div>
            </>
          ) : null}

          <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3">Parking position</h3>
          <PointCoordinatesPicker
            field="coordinates"
            airportLocation={airport.location}
            label="Click on the map to pick the parking position"
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
