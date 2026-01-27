"use client";

import { Button } from "flowbite-react";
import React from "react";
import { Form, redirect, useLoaderData } from "react-router";
import InputBlock from "~/components/shared/Form/InputBlock";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { CreateOperatorDto, Operator } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { OperatorService } from "~/state/api/operator.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { Route } from "../../../../.react-router/types/app/routes/operations/operators/+types/EditOperatorRoute";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<Response> {
  const operatorService = new OperatorService();

  const form = await request.formData();
  const operator = getFormData<CreateOperatorDto>(form, [
    "icaoCode",
    "iataCode",
    "shortName",
    "fullName",
    "callsign",
  ]);

  await operatorService.update(params.id, operator);

  return redirect("/operators");
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<Operator> {
  return new OperatorService().fetchById(params.id);
}

export default function EditOperatorRoute() {
  usePageTitle("Edit operator");

  const operator = useLoaderData<Operator>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Edit operator"
          backText="Back to operators"
          backUrl="/operators"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock
            htmlName="icaoCode"
            label="ICAO code"
            defaultValue={operator.icaoCode}
          />
          <InputBlock
            htmlName="iataCode"
            label="IATA code"
            defaultValue={operator.iataCode}
          />
          <InputBlock
            htmlName="shortName"
            label="Short name"
            defaultValue={operator.shortName}
          />
          <InputBlock
            htmlName="fullName"
            label="Full name"
            defaultValue={operator.fullName}
          />
          <InputBlock
            htmlName="callsign"
            label="Callsign"
            defaultValue={operator.callsign}
          />

          <Button color="indigo" type="submit">
            Save changes
          </Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
