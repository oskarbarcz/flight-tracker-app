import React from "react";
import { useLocation } from "react-router";
import { airportPreviewTabs, pathForTab, resolveActiveTab } from "~/features/airport/components/Library/previewTabs";
import { TabLinkNav } from "~/shared/ui/Tabs/TabLinkNav";

type Props = {
  airportId: string;
};

export function AirportPreviewTabs({ airportId }: Props) {
  const { pathname } = useLocation();
  const activeTab = resolveActiveTab(pathname, airportId);

  const items = airportPreviewTabs.map((tab) => ({
    key: tab.key || "details",
    title: tab.title,
    to: pathForTab(airportId, tab),
  }));

  return <TabLinkNav label="Airport details" items={items} activeKey={activeTab.key || "details"} />;
}
