import React from "react";
import { FaChartLine, FaCircleInfo } from "react-icons/fa6";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerEmptyState } from "~/components/shared/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";

export function PilotStatsBox() {
  return (
    <Container>
      <ContainerTitle icon={FaChartLine} title="Last month summary" />
      <ContainerEmptyState>
        <FaCircleInfo className="inline mr-2" />
        <span>Summary is not available right now.</span>
      </ContainerEmptyState>
    </Container>
  );
}
