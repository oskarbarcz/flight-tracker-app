"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/CreateAircraftRoute";
import { Button } from "flowbite-react";
import React, { JSX } from "react";
import { Form, redirect } from "react-router";
import InputBlock from "~/components/shared/Form/InputBlock";
import Container from "~/components/shared/Layout/Container";
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
  const aircraft: CreateAircraftRequest = getFormData<CreateAircraftRequest>(
    form,
    ["icaoCode", "shortName", "fullName", "selcal", "registration", "livery"],
  );

  await aircraftService.createNew(params.operatorId, aircraft);

  return redirect(`/operators/${params.operatorId}/fleet`);
}

export default function CreateAirportRoute({
  params,
}: Route.ComponentProps): JSX.Element {
  usePageTitle("Create new aircraft");

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Create new aircraft"
          backText="Back to operator"
          backUrl={`/operators/${params.operatorId}/fleet`}
        />

        <Form method="post">
          <Container>
            <div className="flex flex-col gap-4">
              <InputBlock htmlName="icaoCode" label="ICAO code" />
              <InputBlock htmlName="shortName" label="Short name" />
              <InputBlock htmlName="fullName" label="Full name" />
              <InputBlock htmlName="registration" label="Registration" />
              <InputBlock htmlName="selcal" label="SELCAL" />
              <InputBlock htmlName="livery" label="Livery name" />
            </div>
          </Container>

          <div className="flex justify-end pt-4">
            <Button type="submit" color="indigo">
              Create new aircraft
            </Button>
          </div>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
