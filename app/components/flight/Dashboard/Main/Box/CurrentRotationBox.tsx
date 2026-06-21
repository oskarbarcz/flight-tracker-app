import React from "react";
import { FaArrowsSpin, FaCircleInfo } from "react-icons/fa6";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerEmptyState } from "~/components/shared/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";

export function CurrentRotationBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaArrowsSpin} title="Current rotation" />
      <ContainerEmptyState>
        <FaCircleInfo className="inline mr-2" />
        <span>Rotation is not available right now.</span>
      </ContainerEmptyState>
    </Container>
  );
}
