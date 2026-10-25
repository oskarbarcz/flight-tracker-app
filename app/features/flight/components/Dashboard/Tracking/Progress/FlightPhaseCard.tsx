import React from "react";
import { FlightStatus } from "~/features/flight";
import { NextStepPanel } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/NextStepPanel";
import { LifecycleTrack } from "~/features/flight/components/Dashboard/Tracking/Progress/LifecycleTrack";
import { PhaseMetrics } from "~/features/flight/components/Dashboard/Tracking/Progress/PhaseMetrics";
import { useCountdown } from "~/features/flight/components/Dashboard/Tracking/Progress/useCountdown";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { lifecycleSteps, phaseStartedAt } from "~/features/flight/lib/lifecycle";
import { toHuman } from "~/i18n/translate";
import { formatCompactDuration } from "~/shared/lib/time";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { Container } from "~/shared/ui/Layout/Container";

const PHASE_START_EVENTS: Partial<Record<FlightStatus, string>> = {
  [FlightStatus.Ready]: "Released",
  [FlightStatus.CheckedIn]: "Checked in",
  [FlightStatus.BoardingStarted]: "Started",
  [FlightStatus.BoardingFinished]: "Finished",
  [FlightStatus.TaxiingOut]: "Off-block",
  [FlightStatus.InCruise]: "Takeoff",
  [FlightStatus.TaxiingIn]: "Landed",
  [FlightStatus.OnBlock]: "On-block",
  [FlightStatus.OffboardingStarted]: "Started",
  [FlightStatus.OffboardingFinished]: "Finished",
};

function Elapsed({ since }: { since: Date }) {
  const minutes = Math.floor(-useCountdown(since) / 60);

  return <>{minutes < 1 ? "just now" : `${formatCompactDuration(minutes)} ago`}</>;
}

export function FlightPhaseCard() {
  const { flight, events } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const steps = lifecycleSteps(flight.status, flight.timesheet, events);
  const startedAt = phaseStartedAt(flight.status, flight.timesheet, events);
  const startEvent = PHASE_START_EVENTS[flight.status] ?? "Since";
  const phase = toHuman.flight.status.phase(flight.status, flight.serviceType);

  return (
    <Container padding="spacious" className="@container">
      <div className="grid gap-x-6 gap-y-5 [grid-template-areas:'phase'_'track'_'figure'_'action'] @2xl:grid-cols-[minmax(0,1fr)_auto] @2xl:[grid-template-areas:'phase_figure'_'track_track'_'action_action'] @5xl:grid-cols-[minmax(0,1fr)_auto_19rem] @5xl:[grid-template-areas:'phase_figure_action'_'track_track_action']">
        <div className="min-w-0 [grid-area:phase]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{phase}</h2>
          {startedAt && (
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {startEvent} <FormattedIcaoTime date={startedAt} /> · <Elapsed since={startedAt} />
            </p>
          )}
          <p role="status" className="sr-only">
            {phase}
          </p>
        </div>

        <LifecycleTrack steps={steps} serviceType={flight.serviceType} className="self-end [grid-area:track]" />

        <PhaseMetrics flight={flight} className="[grid-area:figure]" />

        <NextStepPanel className="[grid-area:action]" />
      </div>
    </Container>
  );
}
