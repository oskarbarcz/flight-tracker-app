import React from "react";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import { NotamsPanel } from "~/features/notam/components/NotamsPanel";

export default function AirportNotamsRoute() {
  const { airport, notams, isFiltered, clearFilter } = useAirportManagement();

  return <NotamsPanel icaoCode={airport.icaoCode} notams={notams} isFiltered={isFiltered} clearFilter={clearFilter} />;
}
