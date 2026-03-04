"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/OperatorFleetRoute";
import React, { JSX, useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import AircraftListTable from "~/components/operator/Table/AircraftListTable";
import { FleetListEmptyState } from "~/components/operator/Table/EmptyState/FleetListEmptyState";
import FleetControls from "~/components/operator/Table/FleetControls";
import Container from "~/components/shared/Layout/Container";
import type { Aircraft } from "~/models";
import { AircraftService } from "~/state/api/aircraft.service";
import { OperatorService } from "~/state/api/operator.service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [aircrafts, operator] = await Promise.all([
    new AircraftService().fetchAllByOperator(params.operatorId),
    new OperatorService().fetchById(params.operatorId),
  ]);

  return { operatorId: params.operatorId, aircrafts, operator };
}

export default function OperatorFleetRoute(): JSX.Element {
  const { operatorId, aircrafts, operator } =
    useLoaderData<typeof clientLoader>();
  const [selectedType, setselectedType] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!selectedType) return aircrafts;

    return aircrafts.filter((aircraft) => aircraft.icaoCode === selectedType);
  }, [aircrafts, selectedType]);

  if ((aircrafts as Aircraft[]).length === 0) {
    return <FleetListEmptyState operatorId={operatorId} />;
  }

  return (
    <div>
      <FleetControls
        operator={operator}
        type={selectedType}
        changeType={setselectedType}
      />
      <Container className="overflow-x-auto" padding="none">
        <AircraftListTable operatorId={operatorId} aircraft={filtered} />
      </Container>
    </div>
  );
}
