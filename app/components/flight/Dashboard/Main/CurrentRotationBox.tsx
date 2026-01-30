"use client";

import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import Container from "~/components/shared/Layout/Container";
import ContainerEmptyState from "~/components/shared/Layout/ContainerEmptyState";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";

export default function CurrentRotationBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle>Current rotation</ContainerTitle>
      <ContainerEmptyState>
        <FaCircleInfo className="inline mr-2" />
        <span>Rotation is not available right now.</span>
      </ContainerEmptyState>
    </Container>
  );
}
