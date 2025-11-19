"use client";

import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
} from "flowbite-react";
import React from "react";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import Container, {
  ContainerClassProps,
} from "~/components/shared/Layout/Container";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";
import { translateFlightEventType } from "~/models/translate/flight.translate";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

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
