import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { expect, userEvent, within } from "storybook/test";
import { FlightServiceType, FlightStatus } from "~/features/flight";
import { NextStepPanel } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/NextStepPanel";
import { TrackedFlightContext } from "~/features/flight/hooks/useTrackedFlight";
import { type FlightFixtureOptions, flightFixture, livePositionEvents, trackedFlight } from "../fixtures/flights";
import { atWidth, onCard } from "../support/frames";

type NextStepArgs = FlightFixtureOptions & {
  liveSignal: boolean;
};

const SIDE_COLUMN = 304;

const meta = {
  title: "Tracking/Next step panel",
  render: ({ liveSignal, ...fixture }) => (
    <TrackedFlightContext.Provider
      value={trackedFlight(flightFixture(fixture), liveSignal ? livePositionEvents() : [])}
    >
      <NextStepPanel />
    </TrackedFlightContext.Provider>
  ),
  decorators: [onCard, atWidth(SIDE_COLUMN)],
  args: {
    route: "short",
    status: FlightStatus.InCruise,
    serviceType: FlightServiceType.Passenger,
    liveSignal: true,
  },
  argTypes: {
    route: { control: "inline-radio", options: ["short", "longHaul"] },
    status: {
      control: "select",
      options: Object.values(FlightStatus),
      description: "Flight status. Off-block, takeoff and arrival can be detected automatically.",
    },
    serviceType: { control: "inline-radio", options: Object.values(FlightServiceType) },
    liveSignal: {
      description:
        "Whether a live ADS-B position has been received. With it, and with the airport mapped, automatic detection is active.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
The tracking page's answer to "what do I do now?". It sits in the phase card: in the side column on wide screens, under
the lifecycle track on narrow ones.

**States**

- **A step to take.** A question heading ("Landed?", "Ready to close the flight?"), one line of context, and the action
  button.
- **Automatic detection watching.** For off-block, takeoff and arrival, when ADS-B is live and the airport is mapped,
  the heading reads "Watching for …" and the manual report is only a fallback. The panel then shows the heading, one
  line on how detection works, and a **See details** toggle that reveals the detection conditions and the manual report
  button.
- **Detection unavailable.** When a condition fails, the conditions and the warning-toned report button show straight
  away, because the pilot has to report by hand.
- **Closure blocked.** Before closing, an unsettled delay report or an active emergency replaces the context line with
  a warning and a link to fix it.

Cargo flights use loading and unloading wording throughout.
`,
      },
    },
  },
} satisfies Meta<NextStepArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WatchingForArrival: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Automatic detection is watching, so the manual report and its conditions are tucked behind See details.",
      },
    },
  },
};

export const WatchingForArrivalExpanded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /see details/i }));
    await expect(canvas.getByRole("button", { name: /manually report arrival/i })).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: "After See details: the conditions in green and the alternative-toned manual report button.",
      },
    },
  },
};

export const ArrivalNeedsManualReport: Story = {
  args: { liveSignal: false },
  parameters: {
    docs: {
      description: {
        story:
          "No ADS-B signal, so detection can't work. The amber condition and the warning-toned button show at once.",
      },
    },
  },
};

export const WatchingForTakeoff: Story = {
  args: { status: FlightStatus.TaxiingOut },
  parameters: { docs: { description: { story: "Taxiing out with detection active." } } },
};

export const WatchingForOffBlock: Story = {
  args: { status: FlightStatus.BoardingFinished },
  parameters: {
    docs: { description: { story: "Boarding finished with detection active, waiting for the aircraft to move." } },
  },
};

export const CargoLoading: Story = {
  args: { route: "longHaul", status: FlightStatus.BoardingStarted, serviceType: FlightServiceType.Cargo },
  parameters: {
    docs: { description: { story: "A cargo flight mid-loading: the panel asks whether loading is complete." } },
  },
};

export const ReadyToClose: Story = {
  args: { route: "longHaul", status: FlightStatus.OffboardingFinished, serviceType: FlightServiceType.Cargo },
  parameters: { docs: { description: { story: "Unloading finished; the last step is to close the flight." } } },
};

export const WideRow: Story = {
  decorators: [
    (Story) => (
      <div className="@container w-[720px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "In a mid-width phase card (42rem and up) the panel lays its text and action side by side.",
      },
    },
  },
};
