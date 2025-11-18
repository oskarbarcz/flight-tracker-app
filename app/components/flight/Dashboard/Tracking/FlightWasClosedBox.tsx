"use client";

import React from "react";
import Container, {
  ContainerClassProps,
} from "~/components/shared/Layout/Container";

export default function FlightWasClosedBox({ className }: ContainerClassProps) {
  return (
    <Container padding="condensed" className={className}>
      <span>This flight was closed.</span>
    </Container>
  );
}
