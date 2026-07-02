import React from "react";
import { FaArrowsSpin, FaCircleInfo } from "react-icons/fa6";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

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
