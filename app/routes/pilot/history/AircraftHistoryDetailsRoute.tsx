import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Aircraft } from "~/features/aircraft";
import { AircraftBaseAirportSummaryCard } from "~/features/aircraft/components/AircraftDetails/AircraftBaseAirportSummaryCard";
import { AircraftDetailsHeader } from "~/features/aircraft/components/AircraftDetails/AircraftDetailsHeader";
import { AircraftStatusSummaryCard } from "~/features/aircraft/components/AircraftDetails/AircraftStatusSummaryCard";
import { AircraftTechnicalStatusCard } from "~/features/aircraft/components/AircraftDetails/AircraftTechnicalStatusCard";
import type { Airport } from "~/features/airport";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { SectionHeaderWithBackButton } from "~/shared/ui/Section/SectionHeaderWithBackButton";

export default function AircraftHistoryDetailsRoute() {
  const { id } = useParams();
  const { aircraftService, airportService } = useApi();
  const [aircraft, setAircraft] = useState<Aircraft | null>(null);
  const [baseAirport, setBaseAirport] = useState<Airport | null>(null);
  const [lastAirport, setLastAirport] = useState<Airport | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  usePageTitle(aircraft ? `Aircraft ${aircraft.registration}` : "Aircraft");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    aircraftService
      .fetchFlownByCurrentUser()
      .then((entries) => {
        const entry = entries.find((candidate) => candidate.id === id);
        if (!entry) {
          if (!cancelled) setNotFound(true);
          return null;
        }
        return aircraftService.fetchById(entry.operator.id, id);
      })
      .then(async (result) => {
        if (!result) return;
        const [base, last] = await Promise.all([
          result.baseAirport ? airportService.fetchById(result.baseAirport.id) : Promise.resolve(null),
          result.lastAirport ? airportService.fetchById(result.lastAirport.id) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setAircraft(result);
        setBaseAirport(base);
        setLastAirport(last);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [aircraftService, airportService, id]);

  return (
    <div className="pb-8">
      <SectionHeaderWithBackButton backText="Back to aircraft history" backUrl="/aircraft-history" />

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner color="indigo" size="xl" />
        </div>
      )}

      {!loading && notFound && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
          This aircraft is not in your history.
        </div>
      )}

      {!loading && aircraft && (
        <>
          <AircraftDetailsHeader aircraft={aircraft} />
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <AircraftBaseAirportSummaryCard airport={baseAirport} />
            <AircraftStatusSummaryCard aircraft={aircraft} lastAirport={lastAirport} />
            <AircraftTechnicalStatusCard />
          </div>
        </>
      )}
    </div>
  );
}
