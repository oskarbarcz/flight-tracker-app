"use client";

import { TabItem, Tabs } from "flowbite-react";

export enum FlightDataTab {
  Overview,
  FlightProgress,
  OperationalFlightPlan,
  RunwayAnalysis,
  EmergenciesDiversions,
}

type Props = {
  tab: FlightDataTab;
  setTab: (tab: FlightDataTab) => void;
  isSimbriefAvailable: boolean;
  hasActiveEmergency: boolean;
};

export function FlightDataTabs({ tab, setTab, isSimbriefAvailable, hasActiveEmergency }: Props) {
  const emergencyTitle = hasActiveEmergency ? (
    <span className="text-red-600 dark:text-red-500 font-semibold">Emergencies &amp; diversions</span>
  ) : (
    "Emergencies & diversions"
  );

  return (
    <Tabs variant="underline" onActiveTabChange={setTab}>
      <TabItem active={tab === FlightDataTab.Overview} title="Overview" />
      <TabItem active={tab === FlightDataTab.FlightProgress} title="Flight progress" />
      <TabItem active={tab === FlightDataTab.OperationalFlightPlan} title="OFP" disabled={!isSimbriefAvailable} />
      <TabItem active={tab === FlightDataTab.RunwayAnalysis} title="Runway analysis" disabled={!isSimbriefAvailable} />
      <TabItem active={tab === FlightDataTab.EmergenciesDiversions} title={emergencyTitle} />
    </Tabs>
  );
}
