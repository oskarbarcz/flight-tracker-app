"use client";

import { TabItem, Tabs } from "flowbite-react";
import { FlightPrecedenceStatus } from "~/models";
import FlightListTable from "../FlightListTable";

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
            <FlightListTable precedence={precedence} />
          </TabItem>
        ))}
      </Tabs>
    </>
  );
}
