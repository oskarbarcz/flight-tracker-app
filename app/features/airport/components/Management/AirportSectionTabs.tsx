import React from "react";
import {
  type AirportSection,
  airportSections,
  sectionPath,
} from "~/features/airport/components/Management/airportSections";
import { TabLinkNav } from "~/shared/ui/Tabs/TabLinkNav";

type Props = {
  basePath: string;
  airportId: string;
  activeSection: AirportSection;
};

export function AirportSectionTabs({ basePath, airportId, activeSection }: Props) {
  const items = airportSections.map((section) => ({
    key: section.key,
    title: section.title,
    to: sectionPath(basePath, airportId, section),
  }));

  return <TabLinkNav label="Airport infrastructure" items={items} activeKey={activeSection.key} />;
}
