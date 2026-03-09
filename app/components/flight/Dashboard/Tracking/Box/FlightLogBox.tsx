"use client";

import { Timeline, TimelineContent, TimelineItem, TimelinePoint, TimelineTime, TimelineTitle } from "flowbite-react";
import React from "react";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import Container, { type ContainerClassProps } from "~/components/shared/Layout/Container";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";
import { toHuman } from "~/i18n/translate";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

type FlightLogBoxProps = ContainerClassProps;

export default function FlightLogBox({ className }: FlightLogBoxProps) {
  const { events } = useTrackedFlight();

  return (
    <Container className={className} padding="condensed">
      <ContainerTitle>Flight log</ContainerTitle>
      <div className="overflow-y-auto px-1 h-162 md:h-auto">
        <Timeline>
          {events.map((event) => (
            <TimelineItem className="mb-4" key={event.id}>
              <TimelinePoint />
              <TimelineContent>
                <TimelineTime>
                  <FormattedIcaoDate date={event.createdAt} />
                  {" • "}
                  <FormattedIcaoTime date={event.createdAt} />
                </TimelineTime>
                <TimelineTitle>{toHuman.flight.eventType(event.type)}</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </Container>
  );
}
