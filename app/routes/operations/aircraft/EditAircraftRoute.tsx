"use client";

import { Button } from "flowbite-react";
import React from "react";
import { Form, redirect, useLoaderData } from "react-router";
import InputBlock from "~/components/shared/Form/InputBlock";
import SelectBlock from "~/components/shared/Form/SelectBlock";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { Aircraft, CreateAircraftDto, Operator } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { AircraftService } from "~/state/api/aircraft.service";
import { OperatorService } from "~/state/api/operator.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { Route } from "../../../../.react-router/types/app/routes/operations/aircraft/+types/EditAircraftRoute";

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

  await aircraftService.update(params.id, aircraft);

  return redirect("/aircraft");
}

type ClientLoaderData = {
  aircraft: Aircraft;
  operators: Operator[];
};

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<ClientLoaderData> {
  const aircraftService = new AircraftService();
  const operatorService = new OperatorService();

  return {
    aircraft: await aircraftService.getById(params.id),
    operators: await operatorService.fetchAll(),
  };
}

export default function EditAircraftRoute() {
  usePageTitle("Edit aircraft");
  const { aircraft, operators } = useLoaderData<typeof clientLoader>();

  const options = operators.map((option) => {
    return {
      value: option.id,
      label: `[${option.icaoCode}] ${option.shortName}`,
    };
  });

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Edit aircraft"
          backText="Back to aircrafts"
          backUrl="/aircraft"
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
          <SelectBlock
            htmlName="operatorId"
            label="Operator"
            options={options}
            defaultValue={aircraft.operator.id}
          />

          <Button type="submit">Save changes</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
