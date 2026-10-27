import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FlightServiceType, FlightStatus } from "~/features/flight";
import { LifecycleTrack } from "~/features/flight/components/Dashboard/Tracking/Progress/LifecycleTrack";
import { lifecycleSteps } from "~/features/flight/lib/lifecycle";
import { type FlightFixtureOptions, flightFixture } from "../fixtures/flights";
import { onCard } from "../support/frames";

type LifecycleArgs = FlightFixtureOptions & {
  compact: boolean;
};

const meta = {
  title: "Tracking/Lifecycle track",
  render: ({ compact, ...fixture }) => {
    const flight = flightFixture(fixture);

    return (
      <div className="@container">
        <LifecycleTrack
          steps={lifecycleSteps(flight.status, flight.timesheet, [])}
          serviceType={flight.serviceType}
          compact={compact}
        />
      </div>
    );
  },
  decorators: [onCard],
  args: {
    route: "short",
    status: FlightStatus.InCruise,
    serviceType: FlightServiceType.Passenger,
    compact: false,
  },
  argTypes: {
    route: { control: "inline-radio", options: ["short", "longHaul"] },
    status: { control: "select", options: Object.values(FlightStatus) },
    serviceType: { control: "inline-radio", options: Object.values(FlightServiceType) },
    compact: {
      description:
        "Hides the stage labels at every width. The dashboard card sets it, because the labels need the flight's events to show times.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
The flight's nine stages, check-in to close, as one segmented bar.

- **Done** stages are gray-400, **upcoming** gray-200, and the **current** stage is Signal Indigo Mark and four times
  as wide. When the current stage has a known span, its segment fills with progress through it.
- **Labels and times** appear when the track's container is at least 42rem wide: the stage name in micro-caps, and its
  actual time, or its estimated or scheduled time with a certainty mark. Below that width they stay for screen readers
  only.
- **Compact** keeps the labels screen-reader-only at every width.

Cargo flights name the handling stages Loading and Unloading.
`,
      },
    },
  },
} satisfies Meta<LifecycleArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Labelled: Story = {
  parameters: {
    docs: { description: { story: "As on the tracking page: stage names and times under each segment." } },
  },
};

export const Compact: Story = {
  args: { compact: true },
  parameters: {
    docs: { description: { story: "As on the dashboard card: the bar alone, labels for screen readers only." } },
  },
};

export const BeforeDeparture: Story = {
  args: { status: FlightStatus.CheckedIn },
  parameters: { docs: { description: { story: "Crew checked in; everything after check-in is upcoming." } } },
};

export const CargoUnloading: Story = {
  args: { route: "longHaul", status: FlightStatus.OffboardingStarted, serviceType: FlightServiceType.Cargo },
  parameters: { docs: { description: { story: "A cargo flight unloading, with the cargo stage names." } } },
};
