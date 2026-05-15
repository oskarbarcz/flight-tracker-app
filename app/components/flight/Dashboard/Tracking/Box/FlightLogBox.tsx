"use client";

import { Timeline, TimelineContent, TimelineItem, TimelinePoint, TimelineTime, TimelineTitle } from "flowbite-react";
import React from "react";
import { FaListCheck } from "react-icons/fa6";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { Container, type ContainerClassProps } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import { toHuman } from "~/i18n/translate";
import { isEmergencyEvent } from "~/models";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

type Props = ContainerClassProps;

export function FlightLogBox({ className }: Props) {
  const { events } = useTrackedFlight();

  return (
    <Container className={className} padding="condensed">
      <ContainerTitle icon={FaListCheck} title="Flight log" />
      <div className="overflow-y-auto px-1 h-162 md:h-auto">
        <Timeline>
          {events.map((event) => (
            <TimelineItem className="mb-4" key={event.id}>
              <TimelinePoint />
              <TimelineContent>
                <TimelineTime>
                  <FormattedIcaoDate date={event.createdAt} /> <FormattedIcaoTime date={event.createdAt} />
                </TimelineTime>
                <TimelineTitle className={isEmergencyEvent(event.type) ? "text-red-600 dark:text-red-500" : undefined}>
                  {toHuman.flight.eventType(event.type)}
                </TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </Container>
  );
}
