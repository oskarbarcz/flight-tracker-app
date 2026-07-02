import React, { useEffect, useMemo, useState } from "react";
import type { Airport } from "~/features/airport";
import { airportSelectOptions } from "~/features/airport/components/Airport/airportSelectOptions";
import { useApi } from "~/shared/api/useApi";
import { AdvancedSelect } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";

type Props = {
  excludeAirportId?: string;
};

export function TravelDestinationField({ excludeAirportId }: Props) {
  const { airportService } = useApi();
  const [airports, setAirports] = useState<Airport[]>([]);

  useEffect(() => {
    airportService.fetchAll().then(setAirports);
  }, [airportService]);

  const options = useMemo(() => {
    const selectable = airports
      .filter((airport) => airport.id !== excludeAirportId)
      .sort((a, b) => a.iataCode.localeCompare(b.iataCode));
    return airportSelectOptions(selectable);
  }, [airports, excludeAirportId]);

  return (
    <AdvancedSelect
      field="destinationAirportId"
      label="Destination airport"
      placeholder="Select destination"
      options={options}
    />
  );
}
