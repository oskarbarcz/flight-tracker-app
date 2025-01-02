"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton/SectionHeaderWithBackButton";
import { Form, redirect } from "react-router";
import getFormData from "~/functions/getFormData";
import { CreateOperatorDto } from "~/models";
import { OperatorService } from "~/state/services/operator.service";
import InputBlock from "~/components/Form/InputBlock";
import { Route } from "../../../.react-router/types/app/routes/operators/+types/OperatorsListRoute";

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<Response> {
  const form = await request.formData();
  const operator = getFormData<CreateOperatorDto>(form, [
    "icaoCode",
    "shortName",
    "fullName",
    "callsign",
  ]);

  await OperatorService.createNew(operator);

  return redirect("/operators");
}

export default function CreateOperatorRoute() {
  return (
    <ProtectedRoute expectedRole={"operations"}>
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
