"use client";

import { TabItem, Tabs } from "flowbite-react";
import React from "react";
import { useLocation, useNavigate } from "react-router";

const ALL_TABS = [
  { title: "Overview", path: "overview" },
  { title: "Timesheet", path: "timesheet" },
  { title: "Loadsheet", path: "loadsheet" },
  { title: "OFP", path: "ofp" },
];

type Props = {
  id: string;
  showOfp: boolean;
};

export function FlightTabs({ id, showOfp }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = showOfp ? ALL_TABS : ALL_TABS.filter((t) => t.path !== "ofp");

  const activeIndex = tabs.findIndex((t) => pathname.includes(t.path));
  const onClick = (index: number) => {
    navigate(`/flights/${id}/${tabs[index].path}`, {
      viewTransition: true,
      preventScrollReset: true,
    });
  };

  return (
    <Tabs key={activeIndex} variant="underline" className="mt-1.5" onActiveTabChange={onClick}>
      {tabs.map((tab, i) => (
        <TabItem key={tab.path} title={tab.title} active={activeIndex === i} />
      ))}
    </Tabs>
  );
}
