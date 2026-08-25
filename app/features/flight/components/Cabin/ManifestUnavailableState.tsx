import React from "react";
import type { IconType } from "react-icons";
import { FaBoxesStacked, FaChair, FaHourglassHalf, FaLock, FaTriangleExclamation } from "react-icons/fa6";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from "react-router";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
import type { ManifestGap } from "~/features/flight/hooks/useFlightCabin";

type Props = {
  gap: ManifestGap;
  aircraftHref?: string;
};

const GAPS_FIXED_ON_THE_AIRCRAFT: ManifestGap[] = ["no-layout"];

type Notice = {
  tone: "info" | "warning" | "neutral";
  icon: IconType;
  title: string;
  description: string;
};

const NOTICES: Record<ManifestGap, Notice> = {
  cargo: {
    tone: "neutral",
    icon: FaBoxesStacked,
    title: "Cargo flight",
    description: "No passengers are carried, so this flight has no cabin manifest.",
  },
  "no-loadsheet": {
    tone: "info",
    icon: FaHourglassHalf,
    title: "Passengers are not seated yet",
    description:
      "The manifest is generated from the preliminary loadsheet. It appears here as soon as operations fill one in, and is regenerated whenever they change it.",
  },
  "no-layout": {
    tone: "neutral",
    icon: FaChair,
    title: "This flight has no manifest",
    description:
      "The aircraft flying it has no cabin layout assigned, so nobody can be seated. Operations can assign one from the aircraft record.",
  },
  forbidden: {
    tone: "neutral",
    icon: FaLock,
    title: "The manifest is closed to you",
    description: "Only the crew captaining this flight may read its passenger manifest.",
  },
  failed: {
    tone: "warning",
    icon: FaTriangleExclamation,
    title: "The manifest could not be retrieved",
    description: "Leave the tab and come back to ask for it again.",
  },
};

export function ManifestUnavailableState({ gap, aircraftHref }: Props) {
  const notice = NOTICES[gap];
  const showsAircraftLink = aircraftHref !== undefined && GAPS_FIXED_ON_THE_AIRCRAFT.includes(gap);

  return (
    <NoticePanel tone={notice.tone} icon={notice.icon} title={notice.title} description={notice.description}>
      {showsAircraftLink && (
        <Link
          to={aircraftHref}
          viewTransition
          className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-primary-500"
        >
          <span>Open the aircraft</span>
          <HiOutlineArrowRight className="size-4" />
        </Link>
      )}
    </NoticePanel>
  );
}
