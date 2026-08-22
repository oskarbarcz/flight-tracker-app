import { Badge, Checkbox } from "flowbite-react";
import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { OsmFieldDiff } from "~/features/airport/components/Enrichment/OsmFieldDiff";
import { OsmValue } from "~/features/airport/components/Enrichment/OsmValue";
import { formatOsmFieldName, writesRecords } from "~/features/airport/lib/osmProposal";
import { OsmChangeStatus, type OsmProposedChange } from "~/features/airport/model";
import { toHuman } from "~/i18n/translate";

const STATUS_TONE = {
  [OsmChangeStatus.Added]: "success",
  [OsmChangeStatus.Updated]: "info",
  [OsmChangeStatus.Removed]: "failure",
  [OsmChangeStatus.NotChanged]: "gray",
} as const;

type Props = {
  change: OsmProposedChange;
  requirements: OsmProposedChange[];
  isSelected: boolean;
  onToggle: () => void;
};

function ChangeDigest({ change }: { change: OsmProposedChange }) {
  if (change.status === OsmChangeStatus.Removed) {
    return <span className="text-xs text-gray-500 dark:text-gray-400">No longer in OpenStreetMap</span>;
  }

  if (change.status !== OsmChangeStatus.Updated || change.fields.length === 0) {
    return null;
  }

  const [first, ...rest] = change.fields;

  return (
    <span className="flex flex-wrap items-baseline gap-x-1.5 text-xs">
      <span className="text-gray-500 dark:text-gray-400">{formatOsmFieldName(first.field).toLowerCase()}</span>
      <OsmValue field={first.field} value={first.current} />
      <span className="text-gray-400 dark:text-gray-500">→</span>
      <OsmValue field={first.field} value={first.proposed} />
      {rest.length > 0 && (
        <span className="text-gray-500 dark:text-gray-400">
          and {rest.length} more {rest.length === 1 ? "field" : "fields"}
        </span>
      )}
    </span>
  );
}

function RequirementNote({ requirements }: { requirements: OsmProposedChange[] }) {
  if (requirements.length === 0) {
    return null;
  }

  return (
    <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
      Applied together with{" "}
      {requirements.map((requirement, index) => (
        <React.Fragment key={requirement.key}>
          {index > 0 && ", "}
          {toHuman.airport.osm.record(requirement.resource)}{" "}
          <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">{requirement.label}</span>
        </React.Fragment>
      ))}
    </span>
  );
}

export function OsmChangeRow({ change, requirements, isSelected, onToggle }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelectable = writesRecords(change);
  const hasFields = change.fields.length > 0;
  const statusLabel = toHuman.airport.osm.changeStatus(change.status);

  const heading = (
    <>
      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <Badge color={STATUS_TONE[change.status]} size="xs">
          {statusLabel}
        </Badge>
        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{change.label}</span>
        {!isExpanded && <ChangeDigest change={change} />}
      </span>
      <RequirementNote requirements={requirements} />
    </>
  );

  return (
    <li
      className={twMerge(
        "border-b border-gray-200 last:border-b-0 dark:border-gray-800",
        isSelected && "bg-indigo-50/60 dark:bg-indigo-950/30",
      )}
    >
      <div className="flex items-start gap-3 px-3.5 py-2.5">
        {isSelectable ? (
          <Checkbox
            className="mt-1 shrink-0"
            checked={isSelected}
            onChange={onToggle}
            aria-label={`${statusLabel} ${toHuman.airport.osm.record(change.resource)} ${change.label}`}
          />
        ) : (
          <span className="mt-1 size-4 shrink-0" aria-hidden={true} />
        )}

        {hasFields ? (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="flex min-w-0 flex-1 items-start justify-between gap-3 text-left"
          >
            <span className="min-w-0">{heading}</span>
            <HiChevronDown
              className={twMerge(
                "mt-0.5 size-4 shrink-0 text-gray-400 transition-transform dark:text-gray-500",
                isExpanded && "rotate-180",
              )}
              aria-hidden={true}
            />
          </button>
        ) : (
          <span className="min-w-0 flex-1">{heading}</span>
        )}
      </div>

      {isExpanded && hasFields && (
        <div className="border-t border-gray-200 bg-gray-50 px-3.5 py-3 dark:border-gray-800 dark:bg-gray-900/40">
          <OsmFieldDiff change={change} />
        </div>
      )}
    </li>
  );
}
