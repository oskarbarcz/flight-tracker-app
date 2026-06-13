"use client";

import { TabItem, Tabs } from "flowbite-react";

export enum FlightDataTab {
  Overview,
  FlightProgress,
  OperationalFlightPlan,
  RunwayAnalysis,
  EmergenciesDiversions,
  Delays,
}

type Props = {
  tab: FlightDataTab;
  setTab: (tab: FlightDataTab) => void;
  isSimbriefAvailable: boolean;
  hasActiveEmergency: boolean;
  hasUnsettledDelay: boolean;
};

export function FlightDataTabs({ tab, setTab, isSimbriefAvailable, hasActiveEmergency, hasUnsettledDelay }: Props) {
  const emergencyTitle = hasActiveEmergency ? (
    <span className="text-red-600 dark:text-red-500 font-semibold">Emergencies &amp; diversions</span>
  ) : (
    "Emergencies & diversions"
  );

  const delaysTitle = hasUnsettledDelay ? (
    <span className="text-amber-600 dark:text-amber-500 font-semibold">Delay report</span>
  ) : (
    "Delay report"
  );

  return (
    <Tabs variant="underline" onActiveTabChange={setTab}>
      <TabItem active={tab === FlightDataTab.Overview} title="Overview" />
      <TabItem active={tab === FlightDataTab.FlightProgress} title="Flight progress" />
      <TabItem active={tab === FlightDataTab.OperationalFlightPlan} title="OFP" disabled={!isSimbriefAvailable} />
      <TabItem active={tab === FlightDataTab.RunwayAnalysis} title="Runway analysis" disabled={!isSimbriefAvailable} />
      <TabItem active={tab === FlightDataTab.EmergenciesDiversions} title={emergencyTitle} />
      <TabItem active={tab === FlightDataTab.Delays} title={delaysTitle} />
    </Tabs>
  );
}
