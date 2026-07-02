import React, { useEffect, useState } from "react";
import { CurrentFlightBox } from "~/features/flight/components/Dashboard/Main/Box/CurrentFlightBox";
import { CurrentRotationBox } from "~/features/flight/components/Dashboard/Main/Box/CurrentRotationBox";
import { DebugFlightListBox } from "~/features/flight/components/Dashboard/Main/Box/DebugFlightListBox";
import { LastFlightBox } from "~/features/flight/components/Dashboard/Main/Box/LastFlightBox";
import { CurrentFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/CurrentFlightBoxLoader";
import { LastFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/LastFlightBoxLoader";
import { NextScheduledFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/NextScheduledFlightBoxLoader";
import { NextScheduledFlightBox } from "~/features/flight/components/Dashboard/Main/Box/NextScheduledFlightBox";
import { NoCurrentFlightBox } from "~/features/flight/components/Dashboard/Main/Box/NoCurrentFlightBox";
import { PilotStatsBox } from "~/features/flight/components/Dashboard/Main/Box/PilotStatsBox";
import { UserHeader } from "~/features/flight/components/Dashboard/Main/UserHeader";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";
import { useLastFlight } from "~/features/flight/hooks/useLastFlight";
import { CurrentLocationBox } from "~/features/travel/components/CurrentLocationBox";
import { CurrentLocationBoxLoader } from "~/features/travel/components/CurrentLocationBoxLoader";
import { useUserTravels } from "~/features/user/hooks/useUserTravels";
import { type Flight, FlightStatus } from "~/models";
import { useApi } from "~/shared/api/useApi";
import { useAppEnvironment } from "~/shared/hooks/useAppEnvironment";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export default function PilotDashboardRoute() {
  const { flightService } = useApi();
  const { isDebug } = useAppEnvironment();
  const [flights, setFlights] = useState<Flight[]>([]);
  const { lastFlight, loading: loadingLast } = useLastFlight();
  const { currentFlight, loading: loadingCurrent } = useCurrentFlight();
  const { currentLocation, latestTravel, loading: loadingTravels, refresh: refreshTravels } = useUserTravels();
  usePageTitle("Dashboard");

  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    setLoadingAll(true);
    flightService
      .fetchAllFlights()
      .then((res) => setFlights(res.flights))
      .finally(() => setLoadingAll(false));
  }, [flightService]);

  const nextFlight = flights.filter((flight) => flight.status === FlightStatus.Ready)[0];
  const travelFlightNumber = latestTravel?.flightId
    ? flights.find((flight) => flight.id === latestTravel.flightId)?.flightNumberWithoutSpaces
    : undefined;

  return (
    <>
      <UserHeader />
      <div className="grid grid-cols-1 gap-4 pt-12 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {loadingCurrent ? (
            <CurrentFlightBoxLoader />
          ) : currentFlight ? (
            <CurrentFlightBox flight={currentFlight} />
          ) : (
            <NoCurrentFlightBox />
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {loadingLast ? <LastFlightBoxLoader /> : <LastFlightBox flight={lastFlight} />}
            {loadingAll ? (
              <NextScheduledFlightBoxLoader />
            ) : (
              <NextScheduledFlightBox flight={nextFlight} isCurrentFlight={currentFlight !== null} />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {loadingTravels ? (
            <CurrentLocationBoxLoader />
          ) : (
            <CurrentLocationBox
              currentLocation={currentLocation}
              latestTravel={latestTravel}
              flightNumber={travelFlightNumber}
              onTravelCreated={refreshTravels}
            />
          )}
          <PilotStatsBox />
          <CurrentRotationBox />
        </div>
      </div>
      {isDebug && (
        <div className="pt-4">
          <DebugFlightListBox flights={flights} />
        </div>
      )}
    </>
  );
}
