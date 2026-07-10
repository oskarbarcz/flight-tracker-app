import React from "react";
import { FaArrowsSpin } from "react-icons/fa6";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { TilePlaceholder } from "~/shared/ui/Layout/TilePlaceholder";

export function CurrentRotationBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaArrowsSpin} title="Current rotation" />
      <TilePlaceholder
        icon={FaArrowsSpin}
        hint="Your assigned rotation and its flights will appear here once one is scheduled."
      />
    </Container>
  );
}
