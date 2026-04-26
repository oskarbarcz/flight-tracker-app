"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/gates/+types/EditGateRoute";
import { Formik, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { handleFormikApiError } from "~/functions/handleFormikApiError";
import type { Airport, CreateGateFormData, Gate } from "~/models";
import { GateFormBody } from "~/routes/operations/airports/gates/CreateGateRoute";
import { AirportService } from "~/state/api/airport.service";
import { useApi } from "~/state/api/context/useApi";
import { GateService } from "~/state/api/gate.service";
import { TerminalService } from "~/state/api/terminal.service";
import { gateFormDataToRequest, gateToFormData } from "~/state/api/transformer/gate.transformer";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { createGateSchema } from "~/validator/form/gate.schema";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [airport, gate, terminals] = await Promise.all([
    new AirportService().fetchById(params.id),
    new GateService().fetchById(params.id, params.gateId),
    new TerminalService().fetchAll(params.id),
  ]);
  return { airport, gate, terminals };
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: (data) => {
    const { airport, gate } = data as { airport: Airport; gate: Gate };
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
      { label: <span className="font-mono">{gate.name}</span> },
      { label: "Edit" },
    ];
  },
};

export default function EditGateRoute({ params, loaderData }: Route.ComponentProps) {
  const { gate, terminals } = loaderData;
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
          <GateFormBody terminals={terminals} isSubmitting={isSubmitting} submitLabel="Save changes" />
        )}
      </Formik>
    </div>
  );
}
