import React from "react";
import { useLocation } from "react-router";
import { TabLinkNav } from "~/shared/ui/Tabs/TabLinkNav";

type Props = {
  operatorId: string;
  aircraftId: string;
};

function activeKeyOf(pathname: string, base: string): string {
  if (pathname.startsWith(`${base}/seat-layout`)) {
    return "seat-layout";
  }
  if (pathname.startsWith(`${base}/hold-layout`)) {
    return "hold-layout";
  }
  return "flights";
}

export function AircraftDetailsTabs({ operatorId, aircraftId }: Props) {
  const { pathname } = useLocation();
  const base = `/operators/${operatorId}/aircraft/${aircraftId}`;

  return (
    <TabLinkNav
      label="Aircraft sections"
      activeKey={activeKeyOf(pathname, base)}
      items={[
        { key: "flights", title: "Flights & position", to: base },
        { key: "seat-layout", title: "Cabin layout", to: `${base}/seat-layout` },
        { key: "hold-layout", title: "Cargo hold", to: `${base}/hold-layout` },
      ]}
    />
  );
}
