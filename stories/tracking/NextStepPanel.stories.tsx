import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { expect, userEvent, within } from "storybook/test";
import { FlightServiceType, FlightStatus } from "~/features/flight";
import { NextStepPanel } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/NextStepPanel";
import { TrackedFlightContext } from "~/features/flight/hooks/useTrackedFlight";
import type { GsxSettingsResponse } from "~/features/user/request";
import { type FlightFixtureOptions, flightFixture, livePositionEvents, trackedFlight } from "../fixtures/flights";
import { atWidth, onCard } from "../support/frames";

type NextStepArgs = FlightFixtureOptions & {
  liveSignal: boolean;
  gsxSettings: GsxSettingsResponse | null;
};

const SIDE_COLUMN = 304;

const gsxBothAutomatic: GsxSettingsResponse = {
  integrationEnabled: true,
  autoBoardingEnabled: true,
  autoDeboardingEnabled: true,
};

const meta = {
  title: "Tracking/Next step panel",
  render: ({ liveSignal, gsxSettings, ...fixture }) => (
    <TrackedFlightContext.Provider
      value={trackedFlight(flightFixture(fixture), liveSignal ? livePositionEvents() : [], gsxSettings)}
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
    gsxSettings: null,
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
    gsxSettings: {
      description: "The crew member's GSX settings from the account page, or null when they could not be read.",
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
- **GSX starts the phase.** With the GSX integration and the matching automatic setting on, a checked-in flight reads
  "Board passengers" and a flight on block reads "Deboard passengers". There is no button to press. GSX can fail to
  start the phase and the panel can't tell, so **Didn’t work? Troubleshoot** reveals a manual start and a link to the
  GSX integration setup.
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

export const BoardWithGsx: Story = {
  args: { status: FlightStatus.CheckedIn, gsxSettings: gsxBothAutomatic },
  parameters: {
    docs: {
      description: { story: "Automatic boarding is on, so the panel waits for GSX instead of asking." },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { name: "Board passengers" })).toBeVisible();
    await expect(canvas.getByText("GSX will tell us if you started boarding.")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: /start boarding/i })).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Didn’t work? Troubleshoot" })).toBeVisible();
  },
};

export const BoardWithGsxExpanded: Story = {
  args: { status: FlightStatus.CheckedIn, gsxSettings: gsxBothAutomatic },
  parameters: {
    docs: {
      description: {
        story:
          "After Troubleshoot: the outlined button that starts boarding by hand, and the GSX integration setup link.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: /troubleshoot/i }));
    await expect(canvas.getByRole("button", { name: "Hide troubleshooting" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Manually start boarding" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "GSX integration setup" })).toHaveAttribute(
      "href",
      "/me/account#gsx",
    );
  },
};

export const DeboardWithGsx: Story = {
  args: { status: FlightStatus.OnBlock, gsxSettings: gsxBothAutomatic },
  parameters: {
    docs: { description: { story: "On block with automatic deboarding on." } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { name: "Deboard passengers" })).toBeVisible();
    await expect(canvas.getByText("GSX will tell us if you started deboarding.")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: /start offboarding/i })).not.toBeInTheDocument();
  },
};

export const LoadCargoWithGsx: Story = {
  args: {
    route: "longHaul",
    status: FlightStatus.CheckedIn,
    serviceType: FlightServiceType.Cargo,
    gsxSettings: gsxBothAutomatic,
  },
  parameters: {
    docs: { description: { story: "A cargo flight says load and unload, as the rest of the panel does." } },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("heading", { name: "Load cargo" })).toBeVisible();
  },
};

export const BoardingByHandWithGsxOff: Story = {
  args: {
    status: FlightStatus.CheckedIn,
    gsxSettings: { integrationEnabled: false, autoBoardingEnabled: true, autoDeboardingEnabled: true },
  },
  parameters: {
    docs: {
      description: {
        story:
          "The integration is off, so the kept automatic setting has no effect and the usual question and button show.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Start boarding" })).toBeVisible();
  },
};

export const BoardingByHandWithAutomaticOff: Story = {
  args: {
    status: FlightStatus.CheckedIn,
    gsxSettings: { integrationEnabled: true, autoBoardingEnabled: false, autoDeboardingEnabled: true },
  },
  parameters: {
    docs: { description: { story: "Automatic boarding is off, so boarding is still started here by hand." } },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Start boarding" })).toBeVisible();
  },
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
