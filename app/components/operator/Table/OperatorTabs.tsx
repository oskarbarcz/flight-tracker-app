"use client";

import { TabItem, Tabs } from "flowbite-react";
import React from "react";
import {useLocation, useNavigate} from "react-router";


const tabs = [
  { title: "Rotations", path: "rotations" },
  { title: "Fleet",     path: "fleet" },
];

export default function OperatorTabs({ id }: { id: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeIndex = tabs.findIndex(t => pathname.includes(t.path));

  return (
    <Tabs
      variant="underline"
      className="mt-1.5"
      onActiveTabChange={(index) => navigate(`/operators/${id}/${tabs[index].path}`)}
    >
      {tabs.map((tab, i) => (
        <TabItem key={tab.path} title={tab.title} active={activeIndex === i} />
      ))}
    </Tabs>
  );
}
