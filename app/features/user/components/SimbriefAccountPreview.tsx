import { FaCircleCheck } from "react-icons/fa6";
import type { SimbriefAccount, SimbriefAircraft } from "~/features/user";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { MetaRow } from "~/shared/ui/Display/MetaRow";

type Props = {
  account: SimbriefAccount;
};

function describeAircraft({ name, type, registration }: SimbriefAircraft): string | null {
  const model = name ?? type;

  if (model === null) {
    return registration;
  }

  return registration === null ? model : `${model} · ${registration}`;
}

function toDate(value: string | null): Date | null {
  return value === null ? null : new Date(value);
}

export function SimbriefAccountPreview({ account }: Props) {
  const { origin, destination, callsign, aircraft, scheduledOffBlockTime, generatedAt } = account.latestFlight;
  const aircraftLabel = describeAircraft(aircraft);
  const departure = toDate(scheduledOffBlockTime);
  const generated = toDate(generatedAt);

  return (
    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 dark:border-green-900 dark:bg-green-900/30">
      <p className="flex items-start gap-2 text-sm font-medium text-green-800 dark:text-green-300">
        <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
        <span>SimBrief account verified, this is your recent flight plan.</span>
      </p>

      <div className="mt-3 space-y-1.5 text-sm">
        <MetaRow label="Latest plan" value={<span className="font-mono">{callsign}</span>} />
        <MetaRow
          label="Route"
          value={
            <span className="font-mono">
              {origin.icaoCode} → {destination.icaoCode}
            </span>
          }
        />
        {departure !== null && (
          <MetaRow
            label="Departure"
            value={
              <>
                <FormattedIcaoDate date={departure} /> <FormattedIcaoTime date={departure} />
              </>
            }
          />
        )}
        {aircraftLabel !== null && <MetaRow label="Aircraft" value={aircraftLabel} />}
        {generated !== null && (
          <MetaRow
            label="Generated"
            value={
              <>
                <FormattedIcaoDate date={generated} /> <FormattedIcaoTime date={generated} />
              </>
            }
          />
        )}
      </div>
    </div>
  );
}
