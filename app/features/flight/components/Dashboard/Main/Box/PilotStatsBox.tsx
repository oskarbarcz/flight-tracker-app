import React from "react";
import { FaChartLine } from "react-icons/fa6";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { TilePlaceholder } from "~/shared/ui/Layout/TilePlaceholder";

export function PilotStatsBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaChartLine} title="Last month summary" />
      <TilePlaceholder
        icon={FaChartLine}
        hint="Flight time, fuel and distance for the past month will summarise here."
      />
    </Container>
  );
}
