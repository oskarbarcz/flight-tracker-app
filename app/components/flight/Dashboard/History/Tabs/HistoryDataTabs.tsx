"use client";

import { TabItem, Tabs } from "flowbite-react";

export enum HistoryDataTab {
  Overview,
  Events,
  Map,
  OperationalFlightPlan,
  Delays,
}

type Props = {
  tab: HistoryDataTab;
  setTab: (tab: HistoryDataTab) => void;
  isSimbriefAvailable: boolean;
};

export function HistoryDataTabs({ tab, setTab, isSimbriefAvailable }: Props) {
  return (
    <Tabs variant="underline" onActiveTabChange={setTab}>
      <TabItem active={tab === HistoryDataTab.Overview} title="Overview" />
      <TabItem active={tab === HistoryDataTab.Events} title="Events" />
      <TabItem active={tab === HistoryDataTab.Map} title="Map" />
      <TabItem active={tab === HistoryDataTab.OperationalFlightPlan} title="OFP" disabled={!isSimbriefAvailable} />
      <TabItem active={tab === HistoryDataTab.Delays} title="Delay report" />
    </Tabs>
  );
}
