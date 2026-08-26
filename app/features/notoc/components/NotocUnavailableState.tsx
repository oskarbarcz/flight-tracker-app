import React from "react";
import type { IconType } from "react-icons";
import { FaFileCircleExclamation, FaLock, FaTriangleExclamation } from "react-icons/fa6";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
import type { NotocGap } from "~/features/notoc/hooks/useFlightNotoc";

type Props = {
  gap: NotocGap;
};

type Notice = {
  tone: "info" | "warning" | "neutral";
  icon: IconType;
  title: string;
  description: string;
};

const NOTICES: Record<NotocGap, Notice> = {
  "not-issued": {
    tone: "info",
    icon: FaFileCircleExclamation,
    title: "No notification has been issued yet",
    description:
      "The notification to captain is issued from the preliminary loadsheet, and issued again when boarding finishes. It appears here as soon as operations fill one in.",
  },
  forbidden: {
    tone: "neutral",
    icon: FaLock,
    title: "The notification is closed to you",
    description: "Only the crew captaining this flight may read its notification to captain.",
  },
  failed: {
    tone: "warning",
    icon: FaTriangleExclamation,
    title: "The notification could not be retrieved",
    description: "Leave the tab and come back to ask for it again.",
  },
};

export function NotocUnavailableState({ gap }: Props) {
  const notice = NOTICES[gap];

  return <NoticePanel tone={notice.tone} icon={notice.icon} title={notice.title} description={notice.description} />;
}
