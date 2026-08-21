import React from "react";
import { useLocation } from "react-router";
import { TabLinkNav } from "~/shared/ui/Tabs/TabLinkNav";

type Props = {
  operatorId: string;
  aircraftId: string;
};

export function AircraftDetailsTabs({ operatorId, aircraftId }: Props) {
  const { pathname } = useLocation();
  const base = `/operators/${operatorId}/aircraft/${aircraftId}`;
  const isSeatLayout = pathname.startsWith(`${base}/seat-layout`);

  return (
    <TabLinkNav
      label="Aircraft sections"
      activeKey={isSeatLayout ? "seat-layout" : "flights"}
      items={[
        { key: "flights", title: "Flights & position", to: base },
        { key: "seat-layout", title: "Cabin layout", to: `${base}/seat-layout` },
      ]}
    />
  );
}
