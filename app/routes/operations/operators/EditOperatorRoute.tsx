"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/+types/EditOperatorRoute";
import { Button } from "flowbite-react";
import React, { JSX } from "react";
import { Form, redirect, useLoaderData } from "react-router";
import InputBlock from "~/components/shared/Form/InputBlock";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { CreateOperatorDto, Operator } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { OperatorService } from "~/state/api/operator.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";

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

  await operatorService.update(params.operatorId, operator);

  return redirect("/operators");
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<Operator> {
  return new OperatorService().fetchById(params.operatorId);
}

export default function EditOperatorRoute(): JSX.Element {
  usePageTitle("Edit operators");

  const operator = useLoaderData<Operator>();

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeaderWithBackButton
        sectionTitle="Edit operator"
        backText="Back to operators"
        backUrl={`/operators/${operator.id}/fleet`}
      />

      <Form method="post">
        <Container>
          <div className="flex flex-col gap-4">
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
          </div>
        </Container>

        <div className="flex justify-end pt-4">
          <Button color="indigo" type="submit">
            Save changes
          </Button>
        </div>
      </Form>
    </div>
  );
}
