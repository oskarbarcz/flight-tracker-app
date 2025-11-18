"use client";

import { TabItem, Tabs } from "flowbite-react";
import { useNavigate, useSearchParams } from "react-router";
import { allContinents, continentToDisplayName } from "~/models";

export default function ContinentFilterTabs() {
  const continents = allContinents();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentContinent = searchParams.get("continent") || continents[0];

  function handleChange(index: number) {
    const newContinent = continents[index];

    const newParams = new URLSearchParams(searchParams);
    newParams.set("continent", newContinent);
    navigate({ search: newParams.toString() }, { replace: true });
  }

  return (
    <Tabs
      aria-label="Tabs with icons"
      variant="underline"
      onActiveTabChange={handleChange}
    >
      {continents.map((continent) => (
        <TabItem
          active={currentContinent === continent}
          title={continentToDisplayName(continent)}
          key={continent}
        />
      ))}
    </Tabs>
  );
}
