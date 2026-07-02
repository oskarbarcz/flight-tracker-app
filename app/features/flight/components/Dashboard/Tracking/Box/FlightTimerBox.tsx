import { ArrivalTimer } from "~/features/flight/components/Dashboard/Tracking/Timer/ArrivalTimer";
import { OffBlockTimer } from "~/features/flight/components/Dashboard/Tracking/Timer/OffBlockTimer";
import { OnBlockTimer } from "~/features/flight/components/Dashboard/Tracking/Timer/OnBlockTimer";
import { SummaryTimer } from "~/features/flight/components/Dashboard/Tracking/Timer/SummaryTimer";
import { TakeoffTimer } from "~/features/flight/components/Dashboard/Tracking/Timer/TakeoffTimer";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { type FilledSchedule, FlightStatus } from "~/models";

export function FlightTimerBox() {
  const { flight } = useTrackedFlight();
  if (!flight) {
    return <div>Loading...</div>;
  }
  const schedule = flight.timesheet.scheduled;
  const actual = flight.timesheet.actual as FilledSchedule;

  const showOffBlockTimer = [
    FlightStatus.Ready,
    FlightStatus.CheckedIn,
    FlightStatus.BoardingStarted,
    FlightStatus.BoardingFinished,
  ].includes(flight.status);

  const showTakeoffTimer = flight.status === FlightStatus.TaxiingOut;
  const showArrivalTimer = flight.status === FlightStatus.InCruise;
  const showOnBlockTimer = flight.status === FlightStatus.TaxiingIn;
  const showSummary = [
    FlightStatus.OnBlock,
    FlightStatus.OffboardingStarted,
    FlightStatus.OffboardingFinished,
  ].includes(flight.status);

  const showAny = showOffBlockTimer || showTakeoffTimer || showArrivalTimer || showOnBlockTimer || showSummary;
  if (!showAny) return null;

  return (
    <section className="flex flex-col justify-center py-2">
      {showOffBlockTimer && <OffBlockTimer schedule={schedule} />}
      {showTakeoffTimer && <TakeoffTimer schedule={schedule} />}
      {showArrivalTimer && <ArrivalTimer schedule={schedule} actual={actual} />}
      {showOnBlockTimer && <OnBlockTimer schedule={schedule} />}
      {showSummary && <SummaryTimer schedule={schedule} actual={actual} />}
    </section>
  );
}
