import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { expect, within } from "storybook/test";
import {
  type FlightEvent,
  FlightEventScope,
  FlightEventType,
  FlightServiceType,
  GroundServiceSource,
} from "~/features/flight";
import { FlightEventsTimeline } from "~/features/flight/components/Overview/FlightEventsTimeline";
import { atWidth, CARD_WIDTHS } from "../support/frames";

const PILOT = { id: "fcf6f4bc-290d-43a9-843c-409cd47e143d", name: "Rick Doe" };

function logEntry(
  id: number,
  type: FlightEventType,
  payload: FlightEvent["payload"] = {},
  actor: FlightEvent["actor"] = PILOT,
): FlightEvent {
  return {
    id: `event-${id}`,
    scope: actor === null ? FlightEventScope.System : FlightEventScope.User,
    type,
    payload,
    actor,
    createdAt: new Date(`2025-01-01T12:${String(10 + id).padStart(2, "0")}:00.000Z`),
  };
}

const startedByGsx = logEntry(1, FlightEventType.BoardingWasStarted, { source: GroundServiceSource.Gsx });
const startedInsteadOfGsx = logEntry(2, FlightEventType.OffboardingWasStarted, {
  source: GroundServiceSource.Override,
});

const meta = {
  title: "Tracking/Activity log",
  component: FlightEventsTimeline,
  args: {
    events: [startedByGsx, startedInsteadOfGsx],
    serviceType: FlightServiceType.Passenger,
  },
  argTypes: {
    serviceType: { control: "inline-radio", options: Object.values(FlightServiceType) },
  },
} satisfies Meta<typeof FlightEventsTimeline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StartedByGsx: Story = {
  args: { events: [startedByGsx] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Boarding started")).toBeVisible();
    await expect(canvas.getByText("Rick Doe")).toBeVisible();
    await expect(canvas.getByText("Started by GSX")).toBeVisible();
  },
};

export const StartedInsteadOfGsx: Story = {
  args: { events: [startedInsteadOfGsx] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Offboarding started")).toBeVisible();
    await expect(canvas.getByText("Started manually instead of GSX")).toBeVisible();
  },
};

export const CargoFlight: Story = {
  args: { events: [startedByGsx], serviceType: FlightServiceType.Cargo },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Loading started")).toBeVisible();
    await expect(canvas.getByText("Started by GSX")).toBeVisible();
  },
};

export const StartedManually: Story = {
  args: {
    events: [
      logEntry(3, FlightEventType.BoardingWasStarted, { source: GroundServiceSource.Manual }),
      logEntry(4, FlightEventType.OffboardingWasStarted),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Boarding started")).toBeVisible();
    await expect(canvas.getByText("Offboarding started")).toBeVisible();
    await expect(canvas.queryByText(/^Started/)).toBeNull();
  },
};

export const AtcCallsignChanged: Story = {
  args: { events: [logEntry(5, FlightEventType.AtcCallsignWasChanged)] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("ATC callsign changed")).toBeVisible();
    await expect(canvas.queryByText("flight.atc-callsign-changed")).toBeNull();
  },
};

export const DetectedAutomatically: Story = {
  args: { events: [logEntry(6, FlightEventType.TakeoffWasReported, { automaticallyDetected: true }, null)] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Detected automatically")).toBeVisible();
    await expect(canvas.queryByText(/^Started/)).toBeNull();
  },
};

export const OnAPhone: Story = {
  decorators: [atWidth(CARD_WIDTHS.phone)],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Started manually instead of GSX")).toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
