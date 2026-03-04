"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/CreateAircraftRoute";
import { Button } from "flowbite-react";
import React from "react";
import { Form, redirect, useLoaderData } from "react-router";
import InputBlock from "~/components/shared/Form/InputBlock";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { CreateAircraftRequest } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { AircraftService } from "~/state/api/aircraft.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs): Promise<Response> {
  const aircraftService = new AircraftService();

  const form = await request.formData();
  const aircraft: CreateAircraftRequest = getFormData<CreateAircraftRequest>(form, [
    "icaoCode",
    "shortName",
    "fullName",
    "selcal",
    "registration",
    "livery",
  ]);

  await aircraftService.createNew(params.operatorId, aircraft);

  return redirect(`/operators/${params.operatorId}/fleet`);
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { operatorId: params.operatorId };
}

export default function CreateAirportRoute() {
  usePageTitle("Create new aircraft");
  const { operatorId } = useLoaderData<typeof clientLoader>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Create new aircraft"
          backText="Back to operator"
          backUrl={`/operators/${operatorId}/fleet`}
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock htmlName="icaoCode" label="ICAO code" />
          <InputBlock htmlName="shortName" label="Short name" />
          <InputBlock htmlName="fullName" label="Full name" />
          <InputBlock htmlName="registration" label="Registration" />
          <InputBlock htmlName="selcal" label="SELCAL" />
          <InputBlock htmlName="livery" label="Livery name" />

          <Button type="submit">Create new aircraft</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
