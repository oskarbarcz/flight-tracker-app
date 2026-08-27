import React from "react";
import type { IconType } from "react-icons";
import { LuCircleAlert, LuCircleDashed, LuLoaderCircle } from "react-icons/lu";
import { type PlacedPostcard, PostcardStatus } from "~/features/postcard/model";

type Props = {
  postcards: PlacedPostcard[];
  citiesWithoutPostcard: number;
  statuses: PostcardStatus[];
  showingCitiesWithoutPostcard: boolean;
  onToggleStatus: (status: PostcardStatus) => void;
  onToggleCitiesWithoutPostcard: () => void;
};

type ChipProps = {
  icon: IconType;
  label: string;
  value: number;
  tone: string;
  active: boolean;
  onClick: () => void;
};

const SHELL =
  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300";

const ACTIVE =
  "border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-500/50 dark:bg-indigo-900/30 dark:text-indigo-200";

const RESTING =
  "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/60";

function Chip({ icon: Icon, label, value, tone, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${SHELL} ${active ? ACTIVE : RESTING} cursor-pointer`}
    >
      <Icon className={`size-3.5 shrink-0 ${tone}`} aria-hidden={true} />
      <span className="flex items-baseline gap-1.5">
        <span className="font-mono tabular-nums">{value}</span>
        <span>{label}</span>
      </span>
    </button>
  );
}

export function PostcardAttentionStrip({
  postcards,
  citiesWithoutPostcard,
  statuses,
  showingCitiesWithoutPostcard,
  onToggleStatus,
  onToggleCitiesWithoutPostcard,
}: Props) {
  const count = (status: PostcardStatus) => postcards.filter((postcard) => postcard.status === status).length;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Chip
        icon={LuCircleAlert}
        label="failed"
        value={count(PostcardStatus.Failed)}
        tone="text-red-500"
        active={statuses.includes(PostcardStatus.Failed)}
        onClick={() => onToggleStatus(PostcardStatus.Failed)}
      />
      <Chip
        icon={LuLoaderCircle}
        label="being drawn"
        value={count(PostcardStatus.Pending)}
        tone="text-sky-500"
        active={statuses.includes(PostcardStatus.Pending)}
        onClick={() => onToggleStatus(PostcardStatus.Pending)}
      />
      <Chip
        icon={LuCircleDashed}
        label="cities with no postcard"
        value={citiesWithoutPostcard}
        tone="text-gray-400"
        active={showingCitiesWithoutPostcard}
        onClick={onToggleCitiesWithoutPostcard}
      />
    </div>
  );
}
