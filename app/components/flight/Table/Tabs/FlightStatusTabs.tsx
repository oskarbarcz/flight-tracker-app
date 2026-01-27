"use client";

import { TabItem, Tabs } from "flowbite-react";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FlightPhase } from "~/models";

const phaseToLabel = (phase: FlightPhase): string => {
  switch (phase) {
    case FlightPhase.Upcoming:
      return "Upcoming flights";
    case FlightPhase.Ongoing:
      return "Ongoing flights";
    case FlightPhase.Finished:
      return "Finished flights";
  }
};

export default function FlightStatusTabs() {
  const phases = [
    FlightPhase.Upcoming,
    FlightPhase.Ongoing,
    FlightPhase.Finished,
  ];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPhase = searchParams.get("phase") || phases[0];

  function handleChange(index: number) {
    const newPhase = phases[index];

    const newParams = new URLSearchParams();
    newParams.set("phase", newPhase);
    navigate({ search: newParams.toString() }, { replace: true });
  }

  return (
    <Tabs variant="underline" onActiveTabChange={handleChange}>
      {phases.map((phase, i) => (
        <TabItem
          active={currentPhase === phase}
          title={phaseToLabel(phase)}
          key={phase}
        />
      ))}
    </Tabs>
  );
}
