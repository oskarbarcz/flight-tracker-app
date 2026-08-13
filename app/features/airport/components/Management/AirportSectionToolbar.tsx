import { Button } from "flowbite-react";
import React from "react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { type AirportSection, sectionCreatePath } from "~/features/airport/components/Management/airportSections";
import { FilterInput } from "~/shared/ui/Filter/FilterInput";

type Props = {
  airportId: string;
  section: AirportSection;
  filter: string;
  onFilterChange: (value: string) => void;
  meta?: React.ReactNode;
};

export function AirportSectionToolbar({ airportId, section, filter, onFilterChange, meta }: Props) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:max-w-xs">
        <FilterInput value={filter} onChange={onFilterChange} placeholder={section.filterPlaceholder} />
      </div>
      <div className="flex items-center gap-3">
        {meta}
        {section.addLabel && (
          <Button
            as={Link}
            to={sectionCreatePath(airportId, section)}
            viewTransition
            color="indigo"
            size="sm"
            className="w-fit shrink-0 space-x-1.5"
          >
            <HiPlus />
            <span>{section.addLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
