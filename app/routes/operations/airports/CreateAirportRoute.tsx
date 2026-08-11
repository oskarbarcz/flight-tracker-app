import React from "react";
import { useNavigate } from "react-router";
import type { Airport } from "~/features/airport";
import { CreateAirportModal } from "~/features/airport/components/Forms/CreateAirportModal";
import { airportListPath, useAirportList } from "~/features/airport/components/Table/airportListContext";

export default function CreateAirportRoute() {
  const { continent, reload } = useAirportList();
  const navigate = useNavigate();

  const handleCreated = (airport: Airport) => {
    if (airport.continent === continent) {
      reload();
    }
    navigate(airportListPath(airport.continent));
  };

  return <CreateAirportModal close={() => navigate(airportListPath(continent))} onCreated={handleCreated} />;
}
