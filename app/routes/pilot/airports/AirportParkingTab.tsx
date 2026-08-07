import React, { useState } from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { PreviewEmptyState } from "~/features/airport/components/Library/PreviewEmptyState";
import { ParkingPositionList } from "~/features/parking-position/components/ParkingPositionList";
import { matchesFilter, normalizeFilter } from "~/shared/lib/textFilter";
import { FilterInput } from "~/shared/ui/Filter/FilterInput";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportParkingTab() {
  const { airport, parkingPositions, terminals } = useAirportPreview();
  const [filter, setFilter] = useState("");

  if (parkingPositions.length === 0) {
    return <PreviewEmptyState message="No parking positions recorded for this airport." />;
  }

  const query = normalizeFilter(filter);
  const terminalsById = new Map(terminals.map((terminal) => [terminal.id, terminal]));
  const visible = parkingPositions.filter((parkingPosition) => {
    const terminal = terminalsById.get(parkingPosition.terminalId);
    return matchesFilter(query, parkingPosition.name, terminal?.shortName, terminal?.fullName);
  });

  return (
    <div className="space-y-4">
      <div className="w-full sm:max-w-xs">
        <FilterInput value={filter} onChange={setFilter} placeholder="Filter by name or terminal" />
      </div>
      {visible.length === 0 ? (
        <NoFilterMatchesState subject="parking positions" onClear={() => setFilter("")} />
      ) : (
        <ParkingPositionList
          airportId={airport.id}
          parkingPositions={visible}
          terminals={terminals}
          readOnly
          isFiltered={query !== ""}
        />
      )}
    </div>
  );
}
