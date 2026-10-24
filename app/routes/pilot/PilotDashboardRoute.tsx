import React from "react";
import { useAuth } from "~/app-state/useAuth";
import { CurrentFlightBox } from "~/features/flight/components/Dashboard/Main/Box/CurrentFlightBox";
import { CurrentFlightUnavailableBox } from "~/features/flight/components/Dashboard/Main/Box/CurrentFlightUnavailableBox";
import { DebugFlightListBox } from "~/features/flight/components/Dashboard/Main/Box/DebugFlightListBox";
import { LastFlightBox } from "~/features/flight/components/Dashboard/Main/Box/LastFlightBox";
import { CurrentFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/CurrentFlightBoxLoader";
import { LastFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/LastFlightBoxLoader";
import { NextScheduledFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/NextScheduledFlightBoxLoader";
import { NextScheduledFlightBox } from "~/features/flight/components/Dashboard/Main/Box/NextScheduledFlightBox";
import { NoCurrentFlightBox } from "~/features/flight/components/Dashboard/Main/Box/NoCurrentFlightBox";
import { UserHeader } from "~/features/flight/components/Dashboard/Main/UserHeader";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";
import { useFlightNumber } from "~/features/flight/hooks/useFlightNumber";
import { useLastFlight } from "~/features/flight/hooks/useLastFlight";
import { useNextScheduledFlight } from "~/features/flight/hooks/useNextScheduledFlight";
import { PostcardsBox } from "~/features/postcard/components/Dashboard/PostcardsBox";
import { CurrentRotationBox } from "~/features/rotation/components/CurrentRotationBox";
import { CurrentRotationBoxLoader } from "~/features/rotation/components/CurrentRotationBoxLoader";
import { useCurrentRotation } from "~/features/rotation/hooks/useCurrentRotation";
import { RecentActivityBox } from "~/features/stats/components/Dashboard/RecentActivityBox";
import { CurrentLocationBox } from "~/features/travel/components/CurrentLocationBox";
import { CurrentLocationBoxLoader } from "~/features/travel/components/CurrentLocationBoxLoader";
import { useUserTravels } from "~/features/user/hooks/useUserTravels";
import { useAppEnvironment } from "~/shared/hooks/useAppEnvironment";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export default function PilotDashboardRoute() {
  const { user } = useAuth();
  const { isDebug } = useAppEnvironment();
  const currentFlightId = user?.currentFlightId ?? null;
  const { lastFlight, loading: loadingLast, failed: failedLast } = useLastFlight();
  const { currentFlight, loading: loadingCurrent, failed: failedCurrent } = useCurrentFlight();
  const { nextFlight, loading: loadingNext, failed: failedNext } = useNextScheduledFlight(currentFlightId);
  const {
    currentLocation,
    latestTravel,
    loading: loadingTravels,
    failed: failedTravels,
    refresh: refreshTravels,
  } = useUserTravels();
  const { rotation, loading: loadingRotation } = useCurrentRotation();
  usePageTitle("Dashboard");

  const showLocation = !loadingCurrent && !currentFlight && !failedCurrent;
  const travelFlightNumber = useFlightNumber(showLocation ? (latestTravel?.flightId ?? null) : null);

  return (
    <>
      <UserHeader />
      <div className="grid grid-cols-1 gap-3 pt-6 lg:grid-cols-2 lg:pt-12 xl:grid-cols-3">
        <div className="flex flex-col gap-3 xl:col-span-2">
          {loadingCurrent ? (
            <CurrentFlightBoxLoader expectsFlight={currentFlightId !== null} />
          ) : currentFlight ? (
            <CurrentFlightBox flight={currentFlight} />
          ) : failedCurrent ? (
            <CurrentFlightUnavailableBox />
          ) : (
            <NoCurrentFlightBox />
          )}
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
            {loadingLast ? <LastFlightBoxLoader /> : <LastFlightBox flight={lastFlight} failed={failedLast} />}
            {loadingNext ? (
              <NextScheduledFlightBoxLoader />
            ) : (
              <NextScheduledFlightBox flight={nextFlight} failed={failedNext} />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {loadingRotation ? <CurrentRotationBoxLoader /> : rotation && <CurrentRotationBox rotation={rotation} />}
          {showLocation &&
            (loadingTravels ? (
              <CurrentLocationBoxLoader />
            ) : (
              <CurrentLocationBox
                currentLocation={currentLocation}
                latestTravel={latestTravel}
                flightNumber={travelFlightNumber}
                failed={failedTravels}
                onTravelCreated={refreshTravels}
              />
            ))}
          <PostcardsBox />
          <RecentActivityBox />
        </div>
      </div>
      {isDebug && (
        <div className="pt-4">
          <DebugFlightListBox />
        </div>
      )}
    </>
  );
}
