import { Badge, Button } from "flowbite-react";
import React, { useState } from "react";
import { FaPencil, FaTriangleExclamation } from "react-icons/fa6";
import {
  categoryLabel,
  dangerousGoodsLabel,
  intentionLabel,
  squawkLabel,
  threatLevelLabel,
  urgencyLabel,
} from "~/components/flight/Dashboard/Emergency/emergencyLabels";
import { ResolveEmergencyConfirmModal } from "~/components/flight/Dashboard/Emergency/ResolveEmergencyConfirmModal";
import { UpdateEmergencyModal } from "~/components/flight/Dashboard/Emergency/UpdateEmergencyModal";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { UserName } from "~/components/shared/User/UserName";
import type { Emergency } from "~/models";
import { EmergencyThreatLevel } from "~/models";

type Props = {
  emergency: Emergency;
  readOnly?: boolean;
};

function threatBadgeColor(level: EmergencyThreatLevel): string {
  switch (level) {
    case EmergencyThreatLevel.Critical:
      return "failure";
    case EmergencyThreatLevel.High:
      return "warning";
    case EmergencyThreatLevel.Medium:
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

function FuelEnduranceValue({ minutes, declaredAt }: { minutes: number; declaredAt: Date }) {
  const elapsedMinutes = Math.floor((Date.now() - declaredAt.getTime()) / 60_000);
  const remaining = Math.max(0, minutes - elapsedMinutes);
  return (
    <div className="flex flex-col">
      <span>
        <span className="font-mono">{minutes}</span> minutes reported at <FormattedIcaoDate date={declaredAt} />{" "}
        <FormattedIcaoTime date={declaredAt} />
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        (<span className="font-mono">{remaining}</span> min remaining)
      </span>
    </div>
  );
}

export function ActiveEmergencyPanel({ emergency, readOnly = false }: Props) {
  const [editing, setEditing] = useState(false);
  const [resolving, setResolving] = useState(false);

  return (
    <section className="overflow-hidden rounded-xl border border-red-500 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between gap-3 bg-red-600 px-5 py-3 text-white">
        <div className="flex items-center gap-2">
          <FaTriangleExclamation />
          <span className="text-sm font-bold uppercase tracking-widest">Active emergency</span>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <Button size="xs" color="light" onClick={() => setEditing(true)}>
              <FaPencil className="me-1.5" />
              Edit
            </Button>
            <Button size="xs" color="light" onClick={() => setResolving(true)}>
              Mark resolved
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 px-5 py-4 md:grid-cols-3">
        <Field label="Urgency" value={<Badge color="failure">{urgencyLabel(emergency.urgency)}</Badge>} />
        <Field
          label="Threat level"
          value={
            <Badge color={threatBadgeColor(emergency.threatLevel)}>{threatLevelLabel(emergency.threatLevel)}</Badge>
          }
        />
        <Field
          label="Squawk"
          value={
            emergency.squawk ? (
              <span className="font-mono font-bold">{squawkLabel(emergency.squawk)}</span>
            ) : (
              <span className="text-gray-400">—</span>
            )
          }
        />
        <Field label="Category" value={categoryLabel(emergency.category)} />
        <Field label="Pilot intention" value={intentionLabel(emergency.intention)} />
        <Field
          label="Fuel endurance"
          value={<FuelEnduranceValue minutes={emergency.fuelEnduranceMinutes} declaredAt={emergency.declarationTime} />}
        />
        <Field label="Souls on board" value={<span className="font-mono">{emergency.soulsOnBoard}</span>} />
        <Field
          label="Declared"
          value={
            <span>
              <FormattedIcaoDate date={emergency.declarationTime} />{" "}
              <FormattedIcaoTime date={emergency.declarationTime} />
            </span>
          }
        />
        <Field label="Reported by" value={<UserName user={emergency.reportedBy} />} />
      </div>

      {emergency.dangerousGoodsOnBoard.length > 0 && (
        <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-800">
          <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Dangerous goods on board
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            {emergency.dangerousGoodsOnBoard.map((dg) => (
              <Badge key={dg} color="warning">
                {dangerousGoodsLabel(dg)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-800">
        <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Description</div>
        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100">{emergency.freeText}</p>
      </div>

      {editing && <UpdateEmergencyModal emergency={emergency} close={() => setEditing(false)} />}
      {resolving && <ResolveEmergencyConfirmModal emergency={emergency} close={() => setResolving(false)} />}
    </section>
  );
}
