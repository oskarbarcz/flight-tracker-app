"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/gates/+types/CreateGateRoute";
import { Button, Label, Textarea } from "flowbite-react";
import { Field, Formik, Form as FormikForm, type FormikHelpers, useFormikContext } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { InputErrorList } from "~/components/shared/Form/InputErrorList";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/components/shared/Form/Managed/ManagedSelectBlock";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { handleFormikApiError } from "~/functions/handleFormikApiError";
import {
  type Airport,
  bridgeOptions,
  type CreateGateFormData,
  DeicingCapability,
  deicingOptions,
  fuelingOptionsList,
  gateLocationOptions,
  groundUnitOptions,
  initCreateGateData,
  NoiseSensitivity,
  noiseSensitivityOptions,
  parkingAssistanceOptions,
  parkingPositionTypeOptions,
  parkingSpotTypeOptions,
  stairsOptions,
  type Terminal,
} from "~/models";
import { AirportService } from "~/state/api/airport.service";
import { useApi } from "~/state/api/context/useApi";
import { GateService } from "~/state/api/gate.service";
import { TerminalService } from "~/state/api/terminal.service";
import { gateFormDataToRequest, gateToFormData } from "~/state/api/transformer/gate.transformer";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { createGateSchema } from "~/validator/form/gate.schema";

export async function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  const duplicateFrom = new URL(request.url).searchParams.get("duplicateFrom");
  const [airport, terminals, source] = await Promise.all([
    new AirportService().fetchById(params.id),
    new TerminalService().fetchAll(params.id),
    duplicateFrom ? new GateService().fetchById(params.id, duplicateFrom) : Promise.resolve(null),
  ]);
  return { airport, terminals, source };
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: (data) => {
    const { airport } = data as { airport: Airport };
    return [
      { label: "Airports", to: "/airports" },
      {
        label: (
          <>
            <span className="font-mono">{airport.iataCode}</span> · {airport.name}
          </>
        ),
        to: `/airports/${airport.id}/overview`,
      },
      { label: "Gates", to: `/airports/${airport.id}/gates` },
      { label: "New gate" },
    ];
  },
};

export default function CreateGateRoute({ params, loaderData }: Route.ComponentProps) {
  usePageTitle("Create new gate");
  const { terminals, source } = loaderData;

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

  const initialTerminalId = terminals[0]?.id ?? "";
  const initialValues = source ? { ...gateToFormData(source), name: "" } : initCreateGateData(initialTerminalId);

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <SectionHeader title="Create new gate" />

      <Formik<CreateGateFormData>
        initialValues={initialValues}
        validationSchema={createGateSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <GateFormBody terminals={terminals} isSubmitting={isSubmitting} submitLabel="Create gate" />
        )}
      </Formik>
    </div>
  );
}

type FormBodyProps = {
  terminals: Terminal[];
  isSubmitting: boolean;
  submitLabel: string;
};

export function GateFormBody({ terminals, isSubmitting, submitLabel }: FormBodyProps) {
  const { values, errors, touched } = useFormikContext<CreateGateFormData>();
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
              <ManagedInputBlock field="name" label="Gate name" />
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
              field="parkingPositionType"
              label="Position"
              options={parkingPositionTypeOptions}
            />
            <ManagedSelectBlock
              className="basis-1/2"
              field="parkingSpotType"
              label="Spot type"
              options={parkingSpotTypeOptions}
            />
          </div>
          <ManagedSelectBlock field="parkingAssistance" label="Parking assistance" options={parkingAssistanceOptions} />

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
