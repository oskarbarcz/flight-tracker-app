"use client";

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
import { type Flight, FlightStatus } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import useCurrentFlight from "~/state/api/hooks/useCurrentFlight";
import useLastFlight from "~/state/api/hooks/useLastFlight";
import { useAppEnvironment } from "~/state/app/hooks/useAppEnvironment";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export default function PilotDashboardRoute() {
  const { flightService } = useApi();
  const { isDebug } = useAppEnvironment();
  const [flights, setFlights] = useState<Flight[]>([]);
  const { lastFlight, loading: loadingLast } = useLastFlight();
  const { currentFlight, loading: loadingCurrent } = useCurrentFlight();
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

  return (
    <>
      <UserHeader />
      <div className="grid grid-cols-1 gap-4 pt-12 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          {loadingAll ? (
            <NextScheduledFlightBoxLoader />
          ) : (
            <NextScheduledFlightBox flight={nextFlight} isCurrentFlight={currentFlight !== null} />
          )}
          {loadingLast ? <LastFlightBoxLoader /> : <LastFlightBox flight={lastFlight} />}
        </div>
        <div className="flex flex-col gap-4">
          {loadingCurrent ? (
            <CurrentFlightBoxLoader />
          ) : currentFlight ? (
            <CurrentFlightBox flight={currentFlight} />
          ) : (
            <NoCurrentFlightBox />
          )}
          <CurrentRotationBox />
        </div>
        <div className="flex flex-col gap-4">
          <PilotStatsBox />
          {isDebug && <DebugFlightListBox flights={flights} />}
        </div>
      </div>
    </>
  );
}
