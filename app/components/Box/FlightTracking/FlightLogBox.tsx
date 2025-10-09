"use client";

import React from "react";
import Container, { ContainerClassProps } from "~/components/Layout/Container";
import ContainerTitle from "~/components/Layout/ContainerTitle";
import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
} from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { translateFlightEventType } from "~/functions/translate";
import { FormattedIcaoDate } from "~/components/Intrinsic/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/Intrinsic/Date/FormattedIcaoTime";

type FlightLogBoxProps = ContainerClassProps;

export default function FlightLogBox({ className }: FlightLogBoxProps) {
  const { events } = useTrackedFlight();

  return (
    <Container className={className} padding="condensed">
      <ContainerTitle>Flight log</ContainerTitle>
      <div className="overflow-y-auto px-1 h-[650px]">
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
                <TimelineTitle>
                  {translateFlightEventType(event.type)}
                </TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </Container>
  );
}
