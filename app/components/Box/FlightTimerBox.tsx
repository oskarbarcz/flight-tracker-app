"use client";

import { FilledSchedule, Flight, FlightStatus } from "~/models";
import { OffBlockTimer } from "~/components/Box/Timer/OffBlockTimer";
import { TakeoffTimer } from "~/components/Box/Timer/TakeoffTimer";
import { ArrivalTimer } from "~/components/Box/Timer/ArrivalTimer";
import { OnBlockTimer } from "~/components/Box/Timer/OnBlockTimer";
import { SummaryTimer } from "~/components/Box/Timer/SummaryTimer";

type FlightTimeBoxProps = {
  flight: Flight;
};

export function FlightTimerBox({ flight }: FlightTimeBoxProps) {
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
    FlightStatus.Closed,
  ].includes(flight.status);

  return (
    <section className="flex flex-col justify-center rounded-2xl border bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800">
      {showOffBlockTimer && <OffBlockTimer schedule={schedule} />}
      {showTakeoffTimer && <TakeoffTimer schedule={schedule} />}
      {showArrivalTimer && <ArrivalTimer schedule={schedule} />}
      {showOnBlockTimer && <OnBlockTimer schedule={schedule} />}
      {showSummary && <SummaryTimer schedule={schedule} actual={actual} />}
    </section>
  );
}
