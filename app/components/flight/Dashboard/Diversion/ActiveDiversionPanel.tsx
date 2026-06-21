import { Badge, Button } from "flowbite-react";
import React, { useState } from "react";
import { FaPencil, FaPlaneCircleExclamation } from "react-icons/fa6";
import { diversionReasonLabel, diversionSeverityLabel } from "~/components/flight/Dashboard/Diversion/diversionLabels";
import { UpdateDiversionModal } from "~/components/flight/Dashboard/Diversion/UpdateDiversionModal";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { type Diversion, DiversionSeverity } from "~/models";

type Props = {
  diversion: Diversion;
  readOnly?: boolean;
};

function severityBadgeColor(severity: DiversionSeverity): string {
  switch (severity) {
    case DiversionSeverity.Emergency:
      return "failure";
    case DiversionSeverity.Warning:
      return "warning";
    case DiversionSeverity.Caution:
      return "yellow";
    default:
      return "info";
  }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start">
      <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-sm text-gray-800 dark:text-gray-100">{value}</div>
    </div>
  );
}

function NotifyBadges({ diversion }: { diversion: Diversion }) {
  const notifications: string[] = [];
  if (diversion.notifySecurityOnGround) notifications.push("Security");
  if (diversion.notifyMedicalOnGround) notifications.push("Medical");
  if (diversion.notifyFirefightersOnGround) notifications.push("Firefighters");

  if (notifications.length === 0) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {notifications.map((name) => (
        <Badge key={name} color="warning">
          {name}
        </Badge>
      ))}
    </div>
  );
}

export function ActiveDiversionPanel({ diversion, readOnly = false }: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="overflow-hidden rounded-xl border border-red-500 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between gap-3 bg-red-600 px-5 py-3 text-white">
        <div className="flex items-center gap-2">
          <FaPlaneCircleExclamation />
          <span className="text-sm font-bold uppercase tracking-widest">Active diversion</span>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <Button size="xs" color="light" onClick={() => setEditing(true)}>
              <FaPencil className="me-1.5" />
              Edit
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 px-5 py-4 md:grid-cols-3">
        <Field
          label="Severity"
          value={
            <Badge color={severityBadgeColor(diversion.severity)}>{diversionSeverityLabel(diversion.severity)}</Badge>
          }
        />
        <Field label="Reason" value={diversionReasonLabel(diversion.reason)} />
        <Field
          label="Diversion airport"
          value={
            <span>
              <span className="font-mono font-bold">{diversion.airport.iataCode}</span> — {diversion.airport.city}
            </span>
          }
        />
        <Field
          label="Decision made"
          value={
            <span>
              <FormattedIcaoDate date={diversion.decisionTime} /> <FormattedIcaoTime date={diversion.decisionTime} />
            </span>
          }
        />
        <Field
          label="ETA at diversion airport"
          value={
            <span>
              <FormattedIcaoDate date={diversion.estimatedTimeAtDestination} />{" "}
              <FormattedIcaoTime date={diversion.estimatedTimeAtDestination} />
            </span>
          }
        />
        <Field
          label="Position at decision"
          value={
            <span className="font-mono text-xs">
              {diversion.position.latitude.toFixed(4)}, {diversion.position.longitude.toFixed(4)}
            </span>
          }
        />
      </div>

      <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-800">
        <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Notify on ground</div>
        <div className="mt-1">
          <NotifyBadges diversion={diversion} />
        </div>
      </div>

      <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-800">
        <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Description</div>
        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100">{diversion.freeText}</p>
      </div>

      {editing && <UpdateDiversionModal diversion={diversion} close={() => setEditing(false)} />}
    </section>
  );
}
