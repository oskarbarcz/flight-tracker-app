import React, { useEffect, useState } from "react";
import { CurrentFlightBox } from "~/components/flight/Dashboard/Main/Box/CurrentFlightBox";
import { CurrentRotationBox } from "~/components/flight/Dashboard/Main/Box/CurrentRotationBox";
import { DebugFlightListBox } from "~/components/flight/Dashboard/Main/Box/DebugFlightListBox";
import { LastFlightBox } from "~/components/flight/Dashboard/Main/Box/LastFlightBox";
import { CurrentFlightBoxLoader } from "~/components/flight/Dashboard/Main/Box/Loader/CurrentFlightBoxLoader";
import { LastFlightBoxLoader } from "~/components/flight/Dashboard/Main/Box/Loader/LastFlightBoxLoader";
import { NextScheduledFlightBoxLoader } from "~/components/flight/Dashboard/Main/Box/Loader/NextScheduledFlightBoxLoader";
import { NextScheduledFlightBox } from "~/components/flight/Dashboard/Main/Box/NextScheduledFlightBox";
import { NoCurrentFlightBox } from "~/components/flight/Dashboard/Main/Box/NoCurrentFlightBox";
import { PilotStatsBox } from "~/components/flight/Dashboard/Main/Box/PilotStatsBox";
import { UserHeader } from "~/components/flight/Dashboard/Main/UserHeader";
import { CurrentLocationBox } from "~/components/flight/Dashboard/Travel/CurrentLocationBox";
import { CurrentLocationBoxLoader } from "~/components/flight/Dashboard/Travel/CurrentLocationBoxLoader";
import { useUserTravels } from "~/features/user/hooks/useUserTravels";
import { type Flight, FlightStatus } from "~/models";
import { useApi } from "~/shared/api/useApi";
import { useAppEnvironment } from "~/shared/hooks/useAppEnvironment";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { useCurrentFlight } from "~/state/api/hooks/useCurrentFlight";
import { useLastFlight } from "~/state/api/hooks/useLastFlight";

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
