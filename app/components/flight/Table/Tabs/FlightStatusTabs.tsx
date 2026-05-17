"use client";

import { TabItem, Tabs } from "flowbite-react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FlightPhase } from "~/models";
import { useFlightList } from "~/state/api/context/useFlightList";

const phaseToLabel = (phase: FlightPhase): React.ReactNode => {
  switch (phase) {
    case FlightPhase.Emergency:
      return <span className="text-red-600 dark:text-red-500 font-semibold">Emergency flights</span>;
    case FlightPhase.Upcoming:
      return "Upcoming flights";
    case FlightPhase.Ongoing:
      return "Ongoing flights";
    case FlightPhase.Finished:
      return "Finished flights";
  }
};

export function FlightStatusTabs() {
  const { emergencyCount } = useFlightList();
  const phases: FlightPhase[] = [
    ...(emergencyCount > 0 ? [FlightPhase.Emergency] : []),
    FlightPhase.Upcoming,
    FlightPhase.Ongoing,
    FlightPhase.Finished,
  ];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPhase = searchParams.get("phase") || FlightPhase.Upcoming;

  function handleChange(index: number) {
    const newPhase = phases[index];

    const newParams = new URLSearchParams(searchParams);
    newParams.set("phase", newPhase);
    newParams.delete("page");
    navigate({ search: newParams.toString() });
  }

  return (
    <Tabs key={`${currentPhase}-${phases.length}`} variant="underline" onActiveTabChange={handleChange}>
      {phases.map((phase) => (
        <TabItem active={currentPhase === phase} title={phaseToLabel(phase)} key={phase} />
      ))}
    </Tabs>
  );
}
