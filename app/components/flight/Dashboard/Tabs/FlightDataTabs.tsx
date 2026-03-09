"use client";

import { TabItem, Tabs } from "flowbite-react";

export enum FlightDataTab {
  Overview,
  OperationalFlightPlan,
  RunwayAnalysis,
}

type Props = {
  tab: FlightDataTab;
  setTab: (tab: FlightDataTab) => void;
  isSimbriefAvailable: boolean;
};

export function FlightDataTabs({ tab, setTab, isSimbriefAvailable }: Props) {
  return (
    <Tabs variant="underline" onActiveTabChange={setTab}>
      <TabItem active={tab === FlightDataTab.Overview} title="Overview" />
      <TabItem active={tab === FlightDataTab.OperationalFlightPlan} title="OFP" disabled={!isSimbriefAvailable} />
      <TabItem active={tab === FlightDataTab.RunwayAnalysis} title="Runway analysis" disabled={!isSimbriefAvailable} />
    </Tabs>
  );
}
