"use client";

import React from "react";
import Container from "~/components/shared/Layout/Container";

export default function FlightWasClosedBox() {
  return (
    <Container
      padding="condensed"
      className="border-indigo-200 dark:border-indigo-900 bg-indigo-100 font-bold dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 mb-4"
    >
      <span>This flight was closed.</span>
    </Container>
  );
}
