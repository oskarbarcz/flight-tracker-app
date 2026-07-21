import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/OperatorFleetRoute";
import React, { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { AircraftService } from "~/features/aircraft/service";
import { AirportService } from "~/features/airport/service";
import { AircraftListTable } from "~/features/operator/components/Table/AircraftListTable";
import { FleetListEmptyState } from "~/features/operator/components/Table/EmptyState/FleetListEmptyState";
import { FleetControls } from "~/features/operator/components/Table/FleetControls";
import { OperatorService } from "~/features/operator/service";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [aircrafts, operator, airports] = await Promise.all([
    new AircraftService().fetchAll(params.operatorId),
    new OperatorService().fetchById(params.operatorId),
    new AirportService().fetchAll(),
  ]);

  aircrafts.sort((a, b) => a.airframe.type.localeCompare(b.airframe.type));

  return { aircrafts, operator, airports };
}

export default function OperatorFleetRoute({ params }: Route.ComponentProps) {
  const { aircrafts, operator, airports } = useLoaderData<typeof clientLoader>();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!selectedType) return aircrafts;

    return aircrafts.filter((aircraft) => aircraft.airframe.type === selectedType);
  }, [aircrafts, selectedType]);

  if (aircrafts.length === 0) {
    return <FleetListEmptyState operatorId={params.operatorId} />;
  }

  return (
    <div>
      <FleetControls operator={operator} type={selectedType} changeType={setSelectedType} />
      <TransparentContainer className="overflow-x-auto">
        <AircraftListTable operatorId={params.operatorId} aircraft={filtered} airports={airports} />
      </TransparentContainer>
    </div>
  );
}
