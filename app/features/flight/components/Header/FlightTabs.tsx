import { TabItem, Tabs } from "flowbite-react";
import React from "react";
import { useLocation, useNavigate } from "react-router";

const ALL_TABS = [
  { title: "Overview", path: "overview" },
  { title: "Timesheet", path: "timesheet" },
  { title: "Fuel & load", path: "loadsheet" },
  { title: "OFP", path: "ofp" },
  { title: "Alternates & Emergencies", path: "emergencies" },
  { title: "Delays", path: "delays" },
];

type Props = {
  id: string;
  showOfp: boolean;
  hasActiveEmergency: boolean;
  hasPendingDelays: boolean;
};

export function FlightTabs({ id, showOfp, hasActiveEmergency, hasPendingDelays }: Props) {
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

  const renderTitle = (tab: { title: string; path: string }): React.ReactNode => {
    if (tab.path === "emergencies") {
      return hasActiveEmergency ? (
        <span className="text-red-600 dark:text-red-500 font-semibold">{tab.title}</span>
      ) : (
        tab.title
      );
    }
    if (tab.path === "delays" && hasPendingDelays) {
      return <span className="text-amber-600 dark:text-amber-500 font-semibold">{tab.title}</span>;
    }
    return tab.title;
  };

  return (
    <Tabs key={activeIndex} variant="underline" className="mt-1.5" onActiveTabChange={onClick}>
      {tabs.map((tab, i) => (
        <TabItem key={tab.path} title={renderTitle(tab)} active={activeIndex === i} />
      ))}
    </Tabs>
  );
}
