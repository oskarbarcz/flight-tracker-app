import { TabItem, Tabs } from "flowbite-react";
import React from "react";
import { useLocation, useNavigate } from "react-router";

const tabs = [
  { title: "Fleet", path: "fleet" },
  { title: "Rotations", path: "rotations" },
];

type Props = {
  id: string;
};

export function OperatorTabs({ id }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeIndex = tabs.findIndex((t) => pathname.includes(t.path));
  const onClick = (index: number) => {
    navigate(`/operators/${id}/${tabs[index].path}`, {
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
