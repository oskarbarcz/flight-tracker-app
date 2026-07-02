import React from "react";
import { FaCircleInfo, FaPlane } from "react-icons/fa6";
import { AircraftSummaryCard } from "~/features/flight/components/Dashboard/History/Box/AircraftSummaryCard";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

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
