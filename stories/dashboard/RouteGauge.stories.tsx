import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FlightServiceType, FlightStatus } from "~/features/flight";
import { RouteGauge } from "~/features/flight/components/Dashboard/Main/Box/RouteGauge";
import { type FlightFixtureOptions, flightFixture, recordedTrack, syntheticTrack } from "../fixtures/flights";
import { atWidth, CARD_WIDTHS, onCard } from "../support/frames";

type RouteGaugeArgs = FlightFixtureOptions & {
  position: "none" | "recorded" | "synthetic";
  flownFraction: number;
};

function trackFor({ position, flownFraction, ...fixture }: RouteGaugeArgs) {
  const flight = flightFixture(fixture);

  if (position === "recorded") {
    return { flight, path: recordedTrack };
  }

  return { flight, path: position === "synthetic" ? syntheticTrack(flight, flownFraction) : [] };
}

const meta = {
  title: "Dashboard/Current flight/Route gauge",
  render: (args) => <RouteGauge {...trackFor(args)} />,
  decorators: [onCard, atWidth(CARD_WIDTHS.laptop)],
  args: {
    route: "short",
    status: FlightStatus.InCruise,
    serviceType: FlightServiceType.Passenger,
    delayMinutes: 0,
    blockDeltaMinutes: 0,
    position: "none",
    flownFraction: 0.45,
  },
  argTypes: {
    route: { control: "inline-radio", options: ["short", "longHaul"], description: "Seeded route." },
    status: {
      control: "select",
      options: Object.values(FlightStatus),
      description: "Flight status. Before off-block the gauge is empty, after on-block it is full.",
    },
    serviceType: { control: "inline-radio", options: Object.values(FlightServiceType) },
    delayMinutes: { control: { type: "number", step: 5 }, description: "Shifts every expected time later." },
    blockDeltaMinutes: {
      control: { type: "number", step: 1 },
      description: "Makes the expected block time differ from the schedule.",
    },
    position: {
      control: "inline-radio",
      options: ["none", "recorded", "synthetic"],
      description:
        "ADS-B track passed in: none, the recorded Boston–Philadelphia track, or a great-circle track for any route.",
    },
    flownFraction: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description: "How far along the synthetic track has flown.",
      if: { arg: "position", eq: "synthetic" },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
The middle of the current flight strip: both airports with a distance gauge between them, and the supporting figures
underneath.

**The line**

- A dashed hairline is distance not yet flown. A Signal Indigo Mark fill is distance flown, measured along the great
  circle from the departure airport to the live ADS-B position. The aircraft glyph marks its head.
- The departure dot fills once the aircraft has left the stand; the destination dot fills on arrival.
- In flight without a position, the gauge stays dashed with no aircraft. It never guesses where the aircraft is.

**The figures**

- Distance uses the shared *Quantity*: a bold tabular figure, a smaller unit, a muted word. *great circle* before
  departure and without a position, *flown* and *to go* in flight, *flown* after arrival.
- Block time names its certainty: *Block* when both ends are actual, *Est. block* when either is estimated, *Sched.
  block* when only the schedule is known. The scheduled block time follows when the two differ.

**Accessibility**

While a position is known the gauge is a \`progressbar\` whose value text reads the distances. Otherwise it is
decorative, and the figures carry the meaning.
`,
      },
    },
  },
} satisfies Meta<RouteGaugeArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BeforeDeparture: Story = {
  args: { status: FlightStatus.Ready },
  parameters: {
    docs: {
      description: {
        story: "Nothing flown yet: dashed line, hollow dots, total distance and the scheduled block time.",
      },
    },
  },
};

export const EnRoute: Story = {
  args: { status: FlightStatus.InCruise, position: "recorded", blockDeltaMinutes: -16 },
  parameters: {
    docs: {
      description: {
        story: "Live position from the recorded track. The estimated block time is 16 minutes shorter than scheduled.",
      },
    },
  },
};

export const EnRouteLongHaul: Story = {
  args: { route: "longHaul", status: FlightStatus.InCruise, position: "synthetic", flownFraction: 0.3 },
  parameters: {
    docs: {
      description: { story: "A long-haul flight 30% along its great circle. Figures use thousands separators." },
    },
  },
};

export const EnRouteWithoutPosition: Story = {
  args: { status: FlightStatus.InCruise, position: "none" },
  parameters: {
    docs: {
      description: {
        story:
          "Airborne, but no ADS-B position yet. The departure dot is filled; the line stays dashed and shows the total.",
      },
    },
  },
};

export const Arrived: Story = {
  args: { route: "longHaul", status: FlightStatus.OnBlock },
  parameters: {
    docs: {
      description: { story: "On block: full line, both dots filled, the actual block time and the distance flown." },
    },
  },
};

export const LongCityNames: Story = {
  args: { route: "longHaul", status: FlightStatus.InCruise, position: "synthetic", flownFraction: 0.6 },
  decorators: [atWidth(CARD_WIDTHS.phone - 24)],
  parameters: {
    docs: {
      description: {
        story: "At the narrowest width the gauge keeps at least 64px; city names truncate before the codes do.",
      },
    },
  },
};
