"use client";

import { TabItem, Tabs } from "flowbite-react";
import { FlightPrecedenceStatus } from "~/models";
import FlightListTable from "../FlightListTable";
import RotationListTable from "~/components/Tables/RotationListTable";
import Container from "~/components/Container";
import React from "react";

const precedenceToLabel = (precedence: FlightPrecedenceStatus): string => {
  switch (precedence) {
    case FlightPrecedenceStatus.Upcoming:
      return "Upcoming flights";
    case FlightPrecedenceStatus.Ongoing:
      return "Ongoing flights";
    case FlightPrecedenceStatus.Finished:
      return "Finished flights";
  }
};

export default function FlightStatusSelector() {
  return (
    <>
      <Tabs variant="underline">
        {Object.values(FlightPrecedenceStatus).map((precedence, i) => (
          <TabItem title={precedenceToLabel(precedence)} key={i}>
            <Container className="overflow-x-auto" noPadding>
              <FlightListTable precedence={precedence} />
            </Container>
          </TabItem>
        ))}
      </Tabs>
    </>
  );
}
