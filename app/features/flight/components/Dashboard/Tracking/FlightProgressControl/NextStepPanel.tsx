import React, { type ReactElement } from "react";
import { LuArrowRight, LuCheck, LuTriangleAlert } from "react-icons/lu";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { type Flight, FlightStatus } from "~/features/flight";
import { CheckInButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/CheckInButton";
import { CloseFlightButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/CloseFlightButton";
import { FinishBoardingButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/FinishBoardingButton";
import { ReportButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/ReportButton";
import type {
  FlightProgressButtonProps,
  FlightProgressTone,
} from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/progressButton";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import {
  type AutomationCondition,
  type AutomationState,
  flightAutomation,
  manualReportLabel,
} from "~/features/flight/lib/flightAutomation";
import { type ClosureBlock, closureBlock } from "~/features/flight/lib/flightClosure";
import { FlightDataTab, flightDataTabSlug } from "~/features/flight/lib/flightDataTabs";
import { toHuman } from "~/i18n/translate";

type TrackedFlight = ReturnType<typeof useTrackedFlight>;

function handlingNoun(status: FlightStatus, flight: Flight): string {
  return toHuman.flight.status.short(status, flight.serviceType).toLowerCase();
}

function mapStatusToButton(
  flight: Flight,
  props: FlightProgressButtonProps,
  tracked: TrackedFlight,
): ReactElement | null {
  const onboarding = handlingNoun(FlightStatus.BoardingStarted, flight);
  const offboarding = handlingNoun(FlightStatus.OffboardingStarted, flight);

  switch (flight.status) {
    case FlightStatus.Ready:
      return <CheckInButton {...props} />;
    case FlightStatus.CheckedIn:
      return (
        <ReportButton
          {...props}
          report={tracked.startBoarding}
          failureMessage={`Could not start ${onboarding}. Try again.`}
        />
      );
    case FlightStatus.BoardingStarted:
      return <FinishBoardingButton {...props} />;
    case FlightStatus.BoardingFinished:
      return (
        <ReportButton
          {...props}
          report={tracked.reportOffBlock}
          failureMessage="Could not report off-block. Try again."
        />
      );
    case FlightStatus.TaxiingOut:
      return (
        <ReportButton {...props} report={tracked.reportTakeoff} failureMessage="Could not report takeoff. Try again." />
      );
    case FlightStatus.InCruise:
      return (
        <ReportButton {...props} report={tracked.reportArrival} failureMessage="Could not report arrival. Try again." />
      );
    case FlightStatus.TaxiingIn:
      return (
        <ReportButton
          {...props}
          report={tracked.reportOnBlock}
          failureMessage="Could not report on-block. Try again."
        />
      );
    case FlightStatus.OnBlock:
      return (
        <ReportButton
          {...props}
          report={tracked.startOffboarding}
          failureMessage={`Could not start ${offboarding}. Try again.`}
        />
      );
    case FlightStatus.OffboardingStarted:
      return (
        <ReportButton
          {...props}
          report={tracked.finishOffboarding}
          failureMessage={`Could not finish ${offboarding}. Try again.`}
        />
      );
    case FlightStatus.OffboardingFinished:
      return <CloseFlightButton {...props} />;
    default:
      return null;
  }
}

type NextStep = {
  heading: string;
  detail: string | null;
};

const CLOSURE_WARNINGS: Record<ClosureBlock, { message: string; link: string; tab: FlightDataTab }> = {
  delay: {
    message: "Settle the delay report before closing this flight.",
    link: "Open delay report",
    tab: FlightDataTab.Delays,
  },
  emergency: {
    message: "Resolve the active emergency before closing this flight.",
    link: "Open emergencies",
    tab: FlightDataTab.EmergenciesDiversions,
  },
};

function ClosureWarning({ flightId, block }: { flightId: string; block: ClosureBlock }) {
  const warning = CLOSURE_WARNINGS[block];

  return (
    <div className="mt-2 flex flex-col gap-1.5 text-sm">
      <p className="flex items-start gap-2 font-semibold text-amber-700 dark:text-amber-400">
        <LuTriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden={true} />
        <span>{warning.message}</span>
      </p>
      <Link
        to={`/track/${flightId}/${flightDataTabSlug(warning.tab)}`}
        viewTransition
        className="group ms-6 inline-flex w-fit items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 hover:underline dark:text-gray-200 dark:hover:text-white"
      >
        {warning.link}
        <LuArrowRight
          className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden={true}
        />
      </Link>
    </div>
  );
}

const AUTOMATIC_DETAILS: Record<string, string> = {
  "off-block": "Reported automatically once the aircraft starts moving.",
  takeoff: "Reported automatically once airborne.",
  arrival: "Reported automatically after landing at the destination.",
};

function nextStep(flight: Flight, automation: AutomationState | null): NextStep {
  if (automation?.isAutomatic === true) {
    return {
      heading: `Watching for ${automation.subject}`,
      detail: AUTOMATIC_DETAILS[automation.subject] ?? automation.description,
    };
  }

  const onboarding = handlingNoun(FlightStatus.BoardingStarted, flight);
  const offboarding = handlingNoun(FlightStatus.OffboardingStarted, flight);
  const manualDetail = automation?.description ?? null;

  switch (flight.status) {
    case FlightStatus.Ready:
      return { heading: "Ready to check in?", detail: "Check-in opens the schedule and your estimates." };
    case FlightStatus.CheckedIn:
      return {
        heading: `Ready to begin ${onboarding}?`,
        detail: `${toHuman.flight.status.short(FlightStatus.BoardingStarted, flight.serviceType)} runs until you file the final loadsheet.`,
      };
    case FlightStatus.BoardingStarted:
      return { heading: `Is ${onboarding} complete?`, detail: `Finishing ${onboarding} opens the final loadsheet.` };
    case FlightStatus.BoardingFinished:
      return { heading: "Ready for off-block?", detail: manualDetail };
    case FlightStatus.TaxiingOut:
      return { heading: "Airborne?", detail: manualDetail };
    case FlightStatus.InCruise:
      return { heading: "Landed?", detail: manualDetail };
    case FlightStatus.TaxiingIn:
      return { heading: "Parked on stand?", detail: "Report on-block once the aircraft is parked." };
    case FlightStatus.OnBlock:
      return { heading: `Ready to begin ${offboarding}?`, detail: null };
    case FlightStatus.OffboardingStarted:
      return { heading: `Is ${offboarding} complete?`, detail: null };
    case FlightStatus.OffboardingFinished:
      return { heading: "Ready to close the flight?", detail: "Closing the flight asks for the fuel burned." };
    default:
      return { heading: "Check-in not open yet", detail: "It opens once operations releases this flight." };
  }
}

function progressTone(automation: AutomationState | null): FlightProgressTone {
  if (automation === null) {
    return "indigo";
  }

  return automation.isAutomatic ? "alternative" : "warning";
}

function manualOverrideNote(automation: AutomationState | null): string | undefined {
  if (automation === null || !automation.isAutomatic) {
    return undefined;
  }

  return `Automatic ${automation.subject} detection is active. Report manually only if it missed the ${automation.subject}.`;
}

function Condition({ condition }: { condition: AutomationCondition }) {
  const Icon = condition.ok ? LuCheck : LuTriangleAlert;

  return (
    <li
      className={twMerge(
        "flex items-center gap-2 font-semibold",
        condition.ok ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400",
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden={true} />
      {condition.text}
    </li>
  );
}

type Props = {
  className?: string;
};

export function NextStepPanel({ className }: Props) {
  const tracked = useTrackedFlight();
  const { flight, events } = tracked;

  if (!flight) {
    return null;
  }

  const automation = flightAutomation(flight, events);
  const step = nextStep(flight, automation);
  const block =
    flight.status === FlightStatus.OffboardingFinished
      ? closureBlock(tracked.activeEmergency, tracked.delayRequest)
      : null;
  const label = automation?.isAutomatic === true ? manualReportLabel(automation) : undefined;
  const action = mapStatusToButton(
    flight,
    { tone: progressTone(automation), label, confirmNote: manualOverrideNote(automation) },
    tracked,
  );

  return (
    <div
      className={twMerge(
        "flex h-full flex-col gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60",
        "@2xl:flex-row @2xl:items-center @2xl:justify-between @2xl:gap-6 @5xl:flex-col @5xl:items-stretch @5xl:justify-between @5xl:gap-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="text-balance text-xl font-bold text-gray-900 dark:text-white">{step.heading}</h3>
        {step.detail !== null && block === null && (
          <p className="mt-1 text-pretty text-sm text-gray-600 dark:text-gray-300">{step.detail}</p>
        )}
        {block !== null && <ClosureWarning flightId={flight.id} block={block} />}
        {automation !== null && (
          <ul className="mt-2 flex flex-col gap-1 text-xs">
            {automation.conditions.map((condition) => (
              <Condition key={condition.text} condition={condition} />
            ))}
          </ul>
        )}
      </div>
      {action !== null && <div className="shrink-0 *:w-full @2xl:w-64 @5xl:w-auto">{action}</div>}
    </div>
  );
}
