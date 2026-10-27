import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FlightServiceType, FlightStatus } from "~/features/flight";
import { CurrentFlightBox } from "~/features/flight/components/Dashboard/Main/Box/CurrentFlightBox";
import { type FlightFixtureOptions, flightFixture, recordedTrack, syntheticTrack } from "../fixtures/flights";
import { atWidth, CARD_WIDTHS } from "../support/frames";

const meta = {
  title: "Dashboard/Current flight/Card",
  render: (args) => <CurrentFlightBox flight={flightFixture(args)} />,
  decorators: [atWidth(CARD_WIDTHS.desktop)],
  args: {
    route: "short",
    status: FlightStatus.InCruise,
    serviceType: FlightServiceType.Passenger,
    delayMinutes: 0,
    blockDeltaMinutes: 0,
  },
  argTypes: {
    route: {
      description: "Seeded route the fixture starts from.",
      control: "inline-radio",
      options: ["short", "longHaul"],
    },
    status: {
      description: "Flight status. The timesheet is laid out so that now falls inside this phase.",
      control: "select",
      options: Object.values(FlightStatus),
    },
    serviceType: {
      description: "Passenger or cargo. Cargo flights load and unload instead of boarding and offboarding.",
      control: "inline-radio",
      options: Object.values(FlightServiceType),
    },
    delayMinutes: {
      description: "Shifts every estimated and actual time later than scheduled.",
      control: { type: "number", step: 5 },
    },
    blockDeltaMinutes: {
      description: "Shortens (negative) or lengthens the estimated block time against the schedule.",
      control: { type: "number", step: 1 },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
The lead card of the cabin crew dashboard: the flight the user is working on, from release until it closes.

**Anatomy**

1. **Map strip.** The great-circle route between the two airports. While the aircraft is taxiing or airborne it adds the
   flown track, coloured by altitude, and the aircraft. The map is static and opens the flight's Tracking view.
2. **Flight strip.** Two shared rows. The first holds the 30px mono values: flight number, airport codes and the
   reference time. The second holds their captions: registration, cities, and the block event with its date.
3. **Supporting figures.** Distance flown and to go, block time against schedule (see *Route gauge*), and the delay
   badge under the time.
4. **Phase.** The phase name, the countdown to the next block event, and the compact lifecycle track.
5. **Footer.** The next step in words, and Manage, the dashboard's one primary action.

**Rules**

- The reference time is off-block until off-block, then on-block. It reads Est. or Sched. unless actual, and carries the
  date when it isn't today in UTC.
- The card polls ADS-B every 5 s only while the aircraft is taxiing or airborne, and shares the track with the map and
  the gauge.
- Layout follows the card's width, not the viewport. Below 42rem the strip stacks: flight and time share a line when
  they fit, and the time wraps under the flight number when they don't.
`,
      },
    },
  },
} satisfies Meta<FlightFixtureOptions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BeforeDeparture: Story = {
  args: { status: FlightStatus.Ready },
  parameters: {
    docs: {
      description: {
        story:
          "Released and waiting for check-in. The time is the scheduled off-block, the gauge is dashed end to end and shows the total great-circle distance.",
      },
    },
  },
};

export const Boarding: Story = {
  args: { status: FlightStatus.BoardingStarted },
  parameters: {
    docs: {
      description: {
        story:
          "Boarding is under way. The countdown reads the time to off-block, and the next step is to finish boarding.",
      },
    },
  },
};

export const InCruise: Story = {
  args: { status: FlightStatus.InCruise, blockDeltaMinutes: -16 },
  parameters: {
    adsbTrack: recordedTrack,
    docs: {
      description: {
        story:
          "Airborne with a live position. The map draws the flown track and the aircraft; the gauge fills to the aircraft and splits the distance into flown and to go. The estimated block time is shorter than scheduled, so both show.",
      },
    },
  },
};

export const InCruiseDelayed: Story = {
  args: { status: FlightStatus.InCruise, delayMinutes: 25 },
  parameters: {
    adsbTrack: recordedTrack,
    docs: {
      description: {
        story:
          "Departed 25 minutes late. The estimated on-block carries the delay badge, which joins the supporting figures row.",
      },
    },
  },
};

export const AwaitingPosition: Story = {
  args: { status: FlightStatus.InCruise },
  parameters: {
    docs: {
      description: {
        story:
          "Airborne, but no ADS-B position has arrived. The card doesn't guess a position: no aircraft on the map or the gauge, and the total distance instead of flown and to go.",
      },
    },
  },
};

export const LongHaulInCruise: Story = {
  args: { route: "longHaul", status: FlightStatus.InCruise, serviceType: FlightServiceType.Cargo },
  parameters: {
    adsbTrack: syntheticTrack(flightFixture({ route: "longHaul" }), 0.45),
    docs: {
      description: {
        story: "A transatlantic cargo flight. The map strip fits the whole great circle, including its northern arc.",
      },
    },
  },
};

export const CargoUnloaded: Story = {
  args: { route: "longHaul", status: FlightStatus.OffboardingFinished, serviceType: FlightServiceType.Cargo },
  parameters: {
    docs: {
      description: {
        story:
          'Landed and unloaded; the next step is to close the flight. The gauge is full and reads the distance flown. Cargo wording: "Unloading cargo finished".',
      },
    },
  },
};

export const Phone: Story = {
  args: { status: FlightStatus.InCruise, delayMinutes: 25 },
  decorators: [atWidth(CARD_WIDTHS.phone)],
  parameters: {
    adsbTrack: recordedTrack,
    docs: {
      description: {
        story:
          "At phone width the map becomes a 160px band and the strip stacks: flight and time on one line, the route on the next.",
      },
    },
  },
};

export const NarrowPhone: Story = {
  args: { route: "longHaul", status: FlightStatus.OffboardingFinished, serviceType: FlightServiceType.Cargo },
  decorators: [atWidth(296)],
  parameters: {
    docs: {
      description: {
        story:
          "On a 320px phone the flight number and the time no longer fit side by side, so the time wraps under the flight number.",
      },
    },
  },
};
