"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { Form, redirect, useLoaderData } from "react-router";
import { Route } from "../../../.react-router/types/app/routes/airports/+types/CreateAirportRoute";
import { AircraftService } from "~/state/services/aircraft.service";
import getFormData from "~/functions/getFormData";
import { CreateAircraftDto, Operator } from "~/models";
import { UserRole } from "~/models/user.model";
import { OperatorService } from "~/state/services/operator.service";
import InputBlock from "~/components/Form/InputBlock";
import SelectBlock from "~/components/Form/SelectBlock";

export async function clientLoader(): Promise<Operator[] | Response> {
  return OperatorService.fetchAll().catch(() => redirect("/sign-in"));
}

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<Response> {
  const aircraftService = new AircraftService();

  const form = await request.formData();
  const aircraft: CreateAircraftDto = getFormData<CreateAircraftDto>(form, [
    "icaoCode",
    "shortName",
    "fullName",
    "operatorId",
    "selcal",
    "registration",
    "livery",
  ]);

  await aircraftService.createNew(aircraft);

  return redirect("/aircraft");
}

export default function CreateAirportRoute() {
  const operators = useLoaderData<Operator[]>();

  if (!operators) {
    return <div>Loading...</div>;
  }

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
          sectionTitle="Create new aircraft"
          backText="Back to aircraft"
          backUrl="/aircraft"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock htmlName="icaoCode" label="ICAO code" />
          <InputBlock htmlName="shortName" label="Short name" />
          <InputBlock htmlName="fullName" label="Full name" />
          <InputBlock htmlName="registration" label="Registration" />
          <InputBlock htmlName="selcal" label="SELCAL" />
          <InputBlock htmlName="livery" label="Livery name" />
          <SelectBlock
            htmlName="operatorId"
            label="Operator"
            options={options}
          />

          <Button type="submit">Create new aircraft</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
