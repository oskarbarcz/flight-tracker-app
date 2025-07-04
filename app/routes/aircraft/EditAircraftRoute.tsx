"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { Form, redirect, useLoaderData } from "react-router";
import { Aircraft, CreateAircraftDto, Operator } from "~/models";
import { Route } from "../../../.react-router/types/app/routes/aircraft/+types/EditAircraftRoute";
import { AircraftService } from "~/state/api/aircraft.service";
import InputBlock from "~/components/BaseComponents/Form/InputBlock";
import getFormData from "~/functions/getFormData";
import { UserRole } from "~/models/user.model";
import { OperatorService } from "~/state/api/operator.service";
import SelectBlock from "~/components/BaseComponents/Form/SelectBlock";
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
