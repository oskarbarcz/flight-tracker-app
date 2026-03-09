"use client";

import type { Route } from ".react-router/types/app/routes/operations/operators/+types/CreateOperatorRoute";
import { Button } from "flowbite-react";
import React from "react";
import { Form, redirect } from "react-router";
import { InputBlock } from "~/components/shared/Form/InputBlock";
import { SelectBlock } from "~/components/shared/Form/SelectBlock";
import { SectionHeaderWithBackButton } from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { Continent, OperatorType } from "~/models";
import { OperatorService } from "~/state/api/operator.service";
import type { CreateOperatorRequest } from "~/state/api/request/operator.request";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export async function clientAction({ request }: Route.ClientActionArgs): Promise<Response> {
  const operatorService = new OperatorService();

  const form = await request.formData();
  const operator = getFormData<CreateOperatorRequest>(form, [
    "icaoCode",
    "iataCode",
    "shortName",
    "fullName",
    "callsign",
    "avgFleetAge",
    "logoUrl",
    "hubs",
    "continent",
    "type",
  ]);

  await operatorService.createNew(operator);

  return redirect("/operators");
}

const continentOptions = [
  { label: "Europe", value: Continent.Europe },
  { label: "North America", value: Continent.NorthAmerica },
  { label: "South America", value: Continent.SouthAmerica },
  { label: "Oceania", value: Continent.Oceania },
  { label: "Asia", value: Continent.Asia },
  { label: "Africa", value: Continent.Africa },
];

const typeOptions = [
  { label: "Legacy", value: OperatorType.Legacy },
  { label: "Charter", value: OperatorType.Charter },
  { label: "Low-cost", value: OperatorType.LowCost },
  { label: "Government / military", value: OperatorType.GovernmentMilitary },
];

export default function CreateOperatorRoute() {
  usePageTitle("Create new operators");

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeaderWithBackButton
        sectionTitle="Create new operator"
        backText="Back to operators"
        backUrl="/operators"
      />

      <Form className="flex max-w-md flex-col gap-4" method="post">
        <InputBlock htmlName="icaoCode" label="ICAO code" />
        <InputBlock htmlName="iataCode" label="IATA code" />
        <InputBlock htmlName="shortName" label="Short name" />
        <InputBlock htmlName="fullName" label="Full name" />
        <InputBlock htmlName="callsign" label="Callsign" />
        <InputBlock htmlName="avgFleetAge" label="Average fleet age" />
        <InputBlock htmlName="logoUrl" label="Logo URL" />
        <InputBlock htmlName="hubs" label="Hubs" />
        <SelectBlock htmlName="continent" label="Continent" options={continentOptions} />
        <SelectBlock htmlName="type" label="Operator type" options={typeOptions} />

        <Button type="submit">Create new operator</Button>
      </Form>
    </div>
  );
}
