"use client";

import { Button } from "flowbite-react";
import React from "react";
import { Form, redirect } from "react-router";
import InputBlock from "~/components/shared/Form/InputBlock";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { CreateOperatorDto } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { OperatorService } from "~/state/api/operator.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { Route } from "../../../../.react-router/types/app/routes/operations/operators/+types/OperatorsListRoute";

export async function clientAction({
  request,
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

  await operatorService.createNew(operator);

  return redirect("/operators");
}

export default function CreateOperatorRoute() {
  usePageTitle("Create new operator");

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
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

          <Button type="submit">Create new operator</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
