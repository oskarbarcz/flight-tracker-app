import React from "react";
import { DiversionBanner } from "~/features/flight/components/Dashboard/Tracking/Header/DiversionBanner";
import { FlightQuickStatus } from "~/features/flight/components/Dashboard/Tracking/Header/FlightQuickStatus";
import { TrackingRoute } from "~/features/flight/components/Dashboard/Tracking/Header/TrackingRoute";
import { TrackingViewSwitch } from "~/features/flight/components/Dashboard/Tracking/Header/TrackingViewSwitch";
import { FlightIdentity } from "~/features/flight/components/FlightIdentity";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import type { TrackingViewState } from "~/features/flight/hooks/useTrackingView";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  trackingView: TrackingViewState;
};

export function FlightTrackingHeader({ trackingView }: Props) {
  const { flight, diversion } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const { airframe } = flight.aircraft;

  return (
    <Container padding="spacious" className="@container">
      <h1 className="sr-only">Flight {flight.flightNumber}</h1>
      <div className="grid grid-cols-1 items-center gap-x-6 gap-y-4 [grid-template-areas:'identity'_'route'_'view'_'status'] @2xl:grid-cols-[auto_minmax(0,1fr)] @2xl:[grid-template-areas:'identity_route'_'view_status'] @4xl:grid-cols-[minmax(0,max-content)_minmax(min-content,18rem)_minmax(0,1fr)_auto_auto] @4xl:[grid-template-areas:'identity_route_._view_status']">
        <div className="min-w-0 [grid-area:identity]">
          <FlightIdentity
            operator={flight.operator}
            flightNumber={flight.flightNumber}
            aircraftId={flight.aircraft.id}
            registration={flight.aircraft.registration}
            detail={
              <span title={airframe.name}>
                <span aria-hidden={true}> · </span>
                <span className="italic">{airframe.name}</span>
              </span>
            }
          />
        </div>
        <TrackingRoute flight={flight} diverted={diversion !== null} className="[grid-area:route]" />
        <TrackingViewSwitch trackingView={trackingView} className="[grid-area:view] @2xl:w-fit" />
        <FlightQuickStatus className="[grid-area:status] @2xl:justify-self-end" />
      </div>
      {diversion && <DiversionBanner diversion={diversion} />}
    </Container>
  );
}
