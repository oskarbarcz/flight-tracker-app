"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/OperatorFleetRoute";
import React, { JSX, useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import AircraftListTable from "~/components/operator/Table/AircraftListTable";
import { FleetListEmptyState } from "~/components/operator/Table/EmptyState/FleetListEmptyState";
import FleetControls from "~/components/operator/Table/FleetControls";
import Container from "~/components/shared/Layout/Container";
import { AircraftService } from "~/state/api/aircraft.service";
import { OperatorService } from "~/state/api/operator.service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [aircrafts, operator] = await Promise.all([
    new AircraftService().fetchAllByOperator(params.operatorId),
    new OperatorService().fetchById(params.operatorId),
  ]);

  aircrafts.sort((a, b) => a.icaoCode.localeCompare(b.icaoCode));

  return { aircrafts, operator };
}

export default function OperatorFleetRoute({
  params,
}: Route.ComponentProps): JSX.Element {
  const { aircrafts, operator } = useLoaderData<typeof clientLoader>();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!selectedType) return aircrafts;

    return aircrafts.filter((aircraft) => aircraft.icaoCode === selectedType);
  }, [aircrafts, selectedType]);

  if (aircrafts.length === 0) {
    return <FleetListEmptyState operatorId={params.operatorId} />;
  }

  return (
    <div>
      <FleetControls
        operator={operator}
        type={selectedType}
        changeType={setSelectedType}
      />
      <Container className="overflow-x-auto" padding="none">
        <AircraftListTable operatorId={params.operatorId} aircraft={filtered} />
      </Container>
    </div>
  );
}
