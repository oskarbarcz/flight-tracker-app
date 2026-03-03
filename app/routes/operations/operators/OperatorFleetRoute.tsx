"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/+types/OperatorFleetRoute";
import React, { JSX } from "react";
import { useLoaderData } from "react-router";
import AircraftListTable from "~/components/aircraft/Table/AircraftListTable";
import Container from "~/components/shared/Layout/Container";
import { AircraftService } from "~/state/api/aircraft.service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const aircrafts = await new AircraftService().fetchAllByOperator(params.id);
  return { aircrafts };
}

export default function OperatorFleetRoute(): JSX.Element {
  const { aircrafts } = useLoaderData<typeof clientLoader>();

  return (
    <div>
      <Container className="overflow-x-auto" padding="none">
        <AircraftListTable aircraft={aircrafts} />
      </Container>
    </div>
  );
}
