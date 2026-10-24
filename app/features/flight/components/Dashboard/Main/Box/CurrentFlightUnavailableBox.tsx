import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { TilePlaceholder } from "~/shared/ui/Layout/TilePlaceholder";

export function CurrentFlightUnavailableBox() {
  return (
    <Container padding="condensed" header={<CardHeader title="Current flight" />}>
      <TilePlaceholder
        icon={FaTriangleExclamation}
        hint="Your current flight could not be loaded. Reload the page to try again."
      />
    </Container>
  );
}
