"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/EditAircraftRoute";
import { Button } from "flowbite-react";
import React from "react";
import { Form, redirect, useLoaderData } from "react-router";
import InputBlock from "~/components/shared/Form/InputBlock";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { CreateAircraftDto } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { AircraftService } from "~/state/api/aircraft.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<Response> {
  const aircraftService = new AircraftService();

  const form = await request.formData();
  const aircraft = getFormData<CreateAircraftDto>(form, [
    "icaoCode",
    "shortName",
    "fullName",
    "selcal",
    "registration",
    "livery",
  ]);

  await aircraftService.update(params.operatorId, aircraft);

  return redirect("/aircraft");
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const aircraft = await new AircraftService().getById(params.operatorId);
  return { operatorId: params.operatorId, aircraft };
}

export default function EditAircraftRoute() {
  usePageTitle("Edit aircraft");
  const { operatorId, aircraft } = useLoaderData<typeof clientLoader>();
  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Edit aircraft"
          backText="Back to operator"
          backUrl={`/operators/${operatorId}/fleet`}
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock
            htmlName="icaoCode"
            label="ICAO code"
            defaultValue={aircraft.icaoCode}
          />
          <InputBlock
            htmlName="shortName"
            label="Short name"
            defaultValue={aircraft.shortName}
          />
          <InputBlock
            htmlName="fullName"
            label="Full name"
            defaultValue={aircraft.fullName}
          />
          <InputBlock
            htmlName="selcal"
            label="SELCAL"
            defaultValue={aircraft.selcal}
          />
          <InputBlock
            htmlName="registration"
            label="Registration"
            defaultValue={aircraft.registration}
          />
          <InputBlock
            htmlName="livery"
            label="Livery"
            defaultValue={aircraft.livery}
          />

          <Button type="submit">Save changes</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
