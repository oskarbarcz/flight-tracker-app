"use client";

import { TabItem, Tabs } from "flowbite-react";
import { FlightPrecedenceStatus } from "~/models";
import FlightListTable from "../FlightListTable";
import Container from "~/components/shared/Layout/Container";
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

export default function FlightStatusTabs() {
  return (
    <>
      <Tabs variant="underline" color="indigo">
        {Object.values(FlightPrecedenceStatus).map((precedence, i) => (
          <TabItem title={precedenceToLabel(precedence)} key={i}>
            <Container padding="none">
              <FlightListTable precedence={precedence} />
            </Container>
          </TabItem>
        ))}
      </Tabs>
    </>
  );
}
