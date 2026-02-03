"use client";

import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import Container from "~/components/shared/Layout/Container";
import ContainerEmptyState from "~/components/shared/Layout/ContainerEmptyState";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";

export default function NoCurrentFlightBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle>Current flight</ContainerTitle>
      <ContainerEmptyState>
        <FaCircleInfo className="inline mr-2" />
        <span>No ongoing flight now.</span>
      </ContainerEmptyState>
    </Container>
  );
}
