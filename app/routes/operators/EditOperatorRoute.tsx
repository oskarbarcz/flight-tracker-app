"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { Form, redirect, useLoaderData } from "react-router";
import { CreateOperatorDto, Operator } from "~/models";
import { OperatorService } from "~/state/services/operator.service";
import getFormData from "~/functions/getFormData";
import InputBlock from "~/components/InputBlock";
import { Route } from "../../../.react-router/types/app/routes/operators/+types/EditOperatorRoute";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<Response> {
  const form = await request.formData();
  const operator = getFormData<CreateOperatorDto>(form, [
    "icaoCode",
    "shortName",
    "fullName",
    "callsign",
  ]);

  await OperatorService.update(params.id, operator);

  return redirect("/operators");
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<Operator | Response> {
  return OperatorService.fetchById(params.id).catch(() => redirect("/sign-in"));
}

export default function EditOperatorRoute() {
  const operator = useLoaderData<Operator>();

  return (
    <ProtectedRoute expectedRole={"operations"}>
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
