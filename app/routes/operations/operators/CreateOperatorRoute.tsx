"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import { Form, redirect } from "react-router";
import getFormData from "~/functions/getFormData";
import { CreateOperatorDto } from "~/models";
import { OperatorService } from "~/state/api/operator.service";
import { Route } from "../../../../.react-router/types/app/routes/operations/operators/+types/OperatorsListRoute";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import InputBlock from "~/components/shared/Form/InputBlock";

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<Response> {
  const operatorService = new OperatorService();

  const form = await request.formData();
  const operator = getFormData<CreateOperatorDto>(form, [
    "icaoCode",
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
          <InputBlock htmlName="shortName" label="Short name" />
          <InputBlock htmlName="fullName" label="Full name" />
          <InputBlock htmlName="callsign" label="Callsign" />

          <Button type="submit">Create new operator</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
