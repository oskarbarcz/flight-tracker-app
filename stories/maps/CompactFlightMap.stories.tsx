import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FlightStatus } from "~/features/flight";
import { CompactFlightMap } from "~/features/flight/components/Map/Box/CompactFlightMap";
import { flightFixture, recordedTrack, syntheticTrack } from "../fixtures/flights";
import { atWidth, CARD_WIDTHS } from "../support/frames";

const shortFlight = flightFixture({ status: FlightStatus.InCruise });
const longHaulFlight = flightFixture({ route: "longHaul", status: FlightStatus.InCruise });

const FRAME = "overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800";

const meta = {
  title: "Maps/Compact flight map",
  component: CompactFlightMap,
  decorators: [atWidth(CARD_WIDTHS.desktop)],
  args: {
    flight: shortFlight,
    path: [],
    className: `h-48 ${FRAME}`,
  },
  argTypes: {
    flight: { control: false, description: "The flight whose route is drawn." },
    path: {
      control: false,
      description: "ADS-B track. When it has points, the map draws the flown track and the aircraft at its last point.",
    },
    className: { description: "Sizes the map. The card uses `h-40` as a band and `h-48` as a wide strip." },
  },
  parameters: {
    docs: {
      description: {
        component: `
A small, static map of one flight, used as the current flight card's map strip.

- **Route:** the great circle between the airports as a dashed Signal Indigo line, with both airport codes as labels.
- **Track:** when a path is passed, the flown track coloured by altitude and the aircraft at the last position.
- **Fit:** the view fits the whole great circle, including its northern arc on long routes, and refits when the map
  resizes. Zoom stays on whole levels: fractional zoom leaves hairline seams between tiles.
- **Static:** no panning, zooming or keyboard focus inside the map. One link covers it and opens the Tracking view; the
  expand mark in the corner says so, and focus draws an inset ring.
- **Aircraft marker:** indigo-900 on light tiles; indigo-300 with a thin dark outline on dark tiles.

Tiles come from CARTO, so the map needs a network connection.
`,
      },
    },
  },
} satisfies Meta<typeof CompactFlightMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlannedRoute: Story = {
  parameters: { docs: { description: { story: "No position yet: the planned route and both airports." } } },
};

export const LiveTrack: Story = {
  args: { path: recordedTrack },
  parameters: {
    docs: {
      description: {
        story:
          "With the recorded ADS-B track: flown track coloured by altitude, the aircraft at its head. Switch the theme to see the dark-mode marker.",
      },
    },
  },
};

export const LongHaul: Story = {
  args: { flight: longHaulFlight, path: syntheticTrack(longHaulFlight, 0.45) },
  parameters: {
    docs: {
      description: {
        story: "A transatlantic route. The fit includes the arc's northern extent, not only the airports.",
      },
    },
  },
};

export const PhoneBand: Story = {
  args: { path: recordedTrack, className: `h-40 ${FRAME}` },
  decorators: [atWidth(CARD_WIDTHS.phone)],
  parameters: { docs: { description: { story: "The 160px band the card uses at phone width." } } },
};
