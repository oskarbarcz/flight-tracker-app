import React from "react";
import {
  type AirportSection,
  type AirportSectionKey,
  airportSections,
  sectionPath,
} from "~/features/airport/components/Management/airportSections";
import { TabLinkNav } from "~/shared/ui/Tabs/TabLinkNav";

type Props = {
  basePath: string;
  airportId: string;
  activeSection: AirportSection;
  counts?: Partial<Record<AirportSectionKey, number>>;
};

export function AirportSectionTabs({ basePath, airportId, activeSection, counts }: Props) {
  const items = airportSections.map((section) => ({
    key: section.key,
    title: section.title,
    to: sectionPath(basePath, airportId, section),
    count: counts?.[section.key],
  }));

  return <TabLinkNav label="Airport infrastructure" items={items} activeKey={activeSection.key} />;
}
