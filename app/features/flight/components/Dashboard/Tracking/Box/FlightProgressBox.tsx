import { FaGaugeHigh } from "react-icons/fa6";
import { FlightStatus } from "~/features/flight";
import { ChangeFlightProgressButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { AutoTakeoffNotice } from "~/features/flight/components/Dashboard/Tracking/Progress/AutoTakeoffNotice";
import { DelayNotice } from "~/features/flight/components/Dashboard/Tracking/Progress/DelayNotice";
import { LifecycleTrack } from "~/features/flight/components/Dashboard/Tracking/Progress/LifecycleTrack";
import { PhaseMetrics } from "~/features/flight/components/Dashboard/Tracking/Progress/PhaseMetrics";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { BoxFooter } from "~/shared/ui/Layout/BoxFooter";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

const NO_ACTION_STATUSES = [FlightStatus.Created, FlightStatus.Closed];

export function FlightProgressBox() {
  const { flight } = useTrackedFlight();

  if (!flight) return null;

  const showAction = !NO_ACTION_STATUSES.includes(flight.status);

  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaGaugeHigh} title="Flight progress" />
      <div>
        <FieldLabel>Phase</FieldLabel>
        <p className="mt-0.5 text-xl font-semibold text-gray-900 dark:text-gray-100">
          {toHuman.flight.status.standard(flight.status)}
        </p>
      </div>
      <LifecycleTrack status={flight.status} />
      <hr className="border-gray-200 dark:border-gray-700" />
      <PhaseMetrics flight={flight} />
      <AutoTakeoffNotice />
      <DelayNotice />
      {showAction && (
        <div className="mt-auto">
          <BoxFooter>
            <ChangeFlightProgressButton />
          </BoxFooter>
        </div>
      )}
    </Container>
  );
}
