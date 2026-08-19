import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";

export function NoCurrentFlightBox() {
  return (
    <Container padding="condensed" className="hidden sm:flex" header={<CardHeader title="Current flight" />}>
      <ContainerEmptyState>
        <FaCircleInfo className="inline mr-2" />
        <span>No ongoing flight now.</span>
      </ContainerEmptyState>
    </Container>
  );
}
