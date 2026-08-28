import React, { useEffect, useState } from "react";
import { type Flight, FlightStatus } from "~/features/flight";
import { CurrentFlightBox } from "~/features/flight/components/Dashboard/Main/Box/CurrentFlightBox";
import { DebugFlightListBox } from "~/features/flight/components/Dashboard/Main/Box/DebugFlightListBox";
import { LastFlightBox } from "~/features/flight/components/Dashboard/Main/Box/LastFlightBox";
import { CurrentFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/CurrentFlightBoxLoader";
import { LastFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/LastFlightBoxLoader";
import { NextScheduledFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/NextScheduledFlightBoxLoader";
import { NextScheduledFlightBox } from "~/features/flight/components/Dashboard/Main/Box/NextScheduledFlightBox";
import { NoCurrentFlightBox } from "~/features/flight/components/Dashboard/Main/Box/NoCurrentFlightBox";
import { UserHeader } from "~/features/flight/components/Dashboard/Main/UserHeader";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";
import { useLastFlight } from "~/features/flight/hooks/useLastFlight";
import { PostcardsBox } from "~/features/postcard/components/Dashboard/PostcardsBox";
import { CurrentRotationBox } from "~/features/rotation/components/CurrentRotationBox";
import { CurrentRotationBoxLoader } from "~/features/rotation/components/CurrentRotationBoxLoader";
import { useCurrentRotation } from "~/features/rotation/hooks/useCurrentRotation";
import { RecentActivityBox } from "~/features/stats/components/Dashboard/RecentActivityBox";
import { CurrentLocationBox } from "~/features/travel/components/CurrentLocationBox";
import { CurrentLocationBoxLoader } from "~/features/travel/components/CurrentLocationBoxLoader";
import { useUserTravels } from "~/features/user/hooks/useUserTravels";
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
  const { rotation, loading: loadingRotation } = useCurrentRotation();
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
      <div className="grid grid-cols-1 gap-3 pt-6 lg:grid-cols-2 lg:pt-12 xl:grid-cols-3">
        <div className="contents lg:flex lg:flex-col lg:gap-3 xl:col-span-2">
          {loadingCurrent ? (
            <CurrentFlightBoxLoader />
          ) : currentFlight ? (
            <CurrentFlightBox flight={currentFlight} />
          ) : (
            <NoCurrentFlightBox />
          )}
          <div className="order-1 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 md:grid-cols-1 lg:order-none xl:grid-cols-2">
            {loadingLast ? <LastFlightBoxLoader /> : <LastFlightBox flight={lastFlight} />}
            {loadingAll ? <NextScheduledFlightBoxLoader /> : <NextScheduledFlightBox flight={nextFlight} />}
          </div>
        </div>
        <div className="contents lg:flex lg:flex-col lg:gap-3">
          {loadingRotation ? <CurrentRotationBoxLoader /> : rotation && <CurrentRotationBox rotation={rotation} />}
          <div className="order-2 flex flex-col gap-3 lg:order-none">
            {!loadingCurrent &&
              !currentFlight &&
              (loadingTravels ? (
                <CurrentLocationBoxLoader />
              ) : (
                <CurrentLocationBox
                  currentLocation={currentLocation}
                  latestTravel={latestTravel}
                  flightNumber={travelFlightNumber}
                  onTravelCreated={refreshTravels}
                />
              ))}
            <PostcardsBox />
            <RecentActivityBox />
          </div>
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
