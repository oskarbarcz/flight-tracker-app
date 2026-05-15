"use client";

import React from "react";
import { FaCircleInfo, FaPlane } from "react-icons/fa6";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerEmptyState } from "~/components/shared/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";

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
