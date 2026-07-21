import React from "react";
import { AircraftIcon } from "~/features/aircraft/components/Aircraft/AircraftIcon";
import type { Airframe } from "~/features/airframe";
import type { AdvancedSelectOption } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";

export function airframeSelectOptions(airframes: Airframe[]): AdvancedSelectOption[] {
  return airframes
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((airframe) => ({
      value: airframe.type,
      keywords: [airframe.type, airframe.name],
      avatar: <AircraftIcon type={airframe.type} name={airframe.name} />,
      title: airframe.name,
      subtitle: airframe.type,
      selectedSubtitle: airframe.type,
    }));
}
