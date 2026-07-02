import React from "react";
import { FaCircleInfo, FaPlane } from "react-icons/fa6";
import { AircraftSummaryCard } from "~/components/flight/Dashboard/History/Box/AircraftSummaryCard";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function AircraftBox() {
  const { flight } = useTrackedFlight();

  if (!flight) {
    return (
      <Container padding="condensed">
        <ContainerTitle icon={FaPlane} title="Aircraft" />
        <div className="min-h-25 flex items-center justify-center text-gray-500">
          <FaCircleInfo className="inline mr-2" />
          <span>Aircraft details will be available soon.</span>
        </div>
      </Container>
    );
  }

  return <AircraftSummaryCard flight={flight} />;
}
