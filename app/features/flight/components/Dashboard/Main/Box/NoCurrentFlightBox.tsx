import React from "react";
import { FaCircleInfo, FaPlane } from "react-icons/fa6";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

export function NoCurrentFlightBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaPlane} title="Current flight" />
      <ContainerEmptyState>
        <FaCircleInfo className="inline mr-2" />
        <span>No ongoing flight now.</span>
      </ContainerEmptyState>
    </Container>
  );
}
