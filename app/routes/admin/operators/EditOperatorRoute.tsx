"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { Form, redirect, useLoaderData } from "react-router";
import { CreateOperatorDto, Operator } from "~/models";
import { OperatorService } from "~/state/api/operator.service";
import getFormData from "~/functions/getFormData";
import InputBlock from "~/components/Intrinsic/Form/InputBlock";
import { Route } from ".react-router/types/app/routes/admin/operators/+types/EditOperatorRoute";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<Response> {
  const operatorService = new OperatorService();

  const form = await request.formData();
  const operator = getFormData<CreateOperatorDto>(form, [
    "icaoCode",
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
          sectionTitle="Edit airport"
          backText="Back to airports"
          backUrl="/airports"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock
            htmlName="icaoCode"
            label="ICAO code"
            defaultValue={operator.icaoCode}
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

          <Button type="submit">Save changes</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
