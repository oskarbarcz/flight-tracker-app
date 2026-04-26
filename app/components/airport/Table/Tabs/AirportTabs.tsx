"use client";

import { TabItem, Tabs } from "flowbite-react";
import React from "react";
import { useLocation, useNavigate } from "react-router";

const tabs = [
  { title: "Overview", path: "overview" },
  { title: "Terminals", path: "terminals" },
  { title: "Gates", path: "gates" },
  { title: "Runways", path: "runways" },
];

type Props = {
  id: string;
};

export function AirportTabs({ id }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeIndex = tabs.findIndex((t) => pathname.includes(t.path));
  const onClick = (index: number) => {
    navigate(`/airports/${id}/${tabs[index].path}`, {
      viewTransition: true,
      preventScrollReset: true,
    });
  };

  return (
    <Tabs variant="underline" className="mt-1.5" onActiveTabChange={onClick}>
      {tabs.map((tab, i) => (
        <TabItem key={tab.path} title={tab.title} active={activeIndex === i} />
      ))}
    </Tabs>
  );
}
