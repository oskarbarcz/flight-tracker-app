"use client";

import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaPlaneCircleCheck } from "react-icons/fa6";
import PublicFlightCard from "~/components/flight/Public/PublicFlightCard";
import Container from "~/components/shared/Layout/Container";
import ContainerEmptyState from "~/components/shared/Layout/ContainerEmptyState";
import PublicNavigation from "~/components/shared/Layout/PublicNavigation";
import { Flight } from "~/models";
import { usePublicApi } from "~/state/contexts/content/public-api.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export default function PublicFlightsListRoute() {
  const { publicFlightService } = usePublicApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  usePageTitle("Live Flight Tracking");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const publicFlights = await publicFlightService.fetchAllPublicFlights();
        setFlights(publicFlights);
      } catch (error) {
        console.error("Error fetching public flights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [publicFlightService]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner color="indigo" size="xl" />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <PublicNavigation />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Live Flight Tracking
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track public flights in real-time
          </p>
        </div>

        {flights.length === 0 ? (
          <Container>
            <ContainerEmptyState>
              <div className="flex flex-col items-center gap-4">
                <FaPlaneCircleCheck className="text-6xl text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    No public flights available
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    There are currently no flights available for public
                    tracking. Please check back later.
                  </p>
                </div>
              </div>
            </ContainerEmptyState>
          </Container>
        ) : (
          <div className="flex flex-col gap-4">
            {flights.map((flight) => (
              <PublicFlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
