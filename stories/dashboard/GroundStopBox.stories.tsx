import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { GroundStopBox } from "~/features/flight/components/Dashboard/Main/Box/GroundStopBox";
import {
  flightFromBoston,
  flightFromNewYork,
  groundStopAfterDeadHead,
  groundStopAfterFlight,
  newYorkLayout,
  newYorkLayoutWithoutStand,
} from "../fixtures/groundStops";
import { atWidth, CARD_WIDTHS } from "../support/frames";

const meta = {
  title: "Dashboard/Current flight/On the ground",
  component: GroundStopBox,
  decorators: [atWidth(CARD_WIDTHS.desktop)],
  args: {
    groundStop: groundStopAfterFlight(),
    layout: newYorkLayout,
    nextFlight: null,
    nextFlightFailed: false,
  },
  argTypes: {
    groundStop: {
      control: false,
      description: "Where the pilot is, since when, and the flight that brought them there, if any.",
    },
    layout: { control: false, description: "The airport's runways and terminals, and the stand when it is known." },
    nextFlight: { control: false, description: "The pilot's next ready flight, which decides the footer's next step." },
    nextFlightFailed: {
      description: "The upcoming flights could not be loaded, so the footer makes no claim about what comes next.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
What the current flight card becomes between flights, when the pilot's last travel has finished at a known airport. It
keeps the live card's shape, so the dashboard reads the same on the ground as in the air.

- **Map:** opens on the whole airport, then settles on the stand after a short delay. Under
  \`prefers-reduced-motion\` it goes straight to the stand. One link covers it and opens the airports library.
- **Figures:** the airport's local time and UTC offset, the stand and its terminal, and the aircraft, each only when
  known.
- **Clock:** time on the ground, ticking, from on-block after a flight and from the arrival after a dead-head.
- **Footer:** the next step, worked out from the next ready flight. It is hidden when those flights failed to load.

Below 640px the card is hidden, because the location card directly below it already says where the pilot is.
`,
      },
    },
  },
} satisfies Meta<typeof GroundStopBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AfterAFlight: Story = {
  parameters: {
    docs: {
      description: {
        story: "The pilot closed a flight here. Stand, aircraft and on-block time all come from that flight.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Wait for dispatch")).toBeVisible();
    await expect(canvas.getByText("On ground since on-block")).toBeVisible();
    await expect(canvas.getByText(newYorkLayout.stand?.name ?? "")).toBeVisible();
  },
};

export const NextFlightFromHere: Story = {
  args: { nextFlight: flightFromNewYork() },
  parameters: {
    docs: { description: { story: "The next ready flight departs from this airport, so the footer names it." } },
  },
};

export const RepositionFirst: Story = {
  args: { nextFlight: flightFromBoston() },
  parameters: {
    docs: {
      description: {
        story: "The next ready flight departs from another airport, so the pilot has to reposition before it.",
      },
    },
  },
};

export const AfterADeadHead: Story = {
  args: { groundStop: groundStopAfterDeadHead(), layout: newYorkLayoutWithoutStand },
  parameters: {
    docs: {
      description: {
        story:
          "The pilot travelled here as a passenger or by hand. There is no stand or aircraft to show, so the map stays on the whole airport.",
      },
    },
  },
};

export const SeveralDaysOnTheGround: Story = {
  args: { groundStop: groundStopAfterFlight(3 * 24 + 7) },
  parameters: {
    docs: {
      description: { story: "A long layover. The clock gains a day count and the time below it gains the date." },
    },
  },
};

export const NextFlightsUnavailable: Story = {
  args: { nextFlightFailed: true },
  parameters: {
    docs: {
      description: {
        story: "The upcoming flights failed to load. The footer keeps quiet rather than saying there is nothing next.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("Wait for dispatch")).toBeNull();
  },
};

export const Laptop: Story = {
  decorators: [atWidth(CARD_WIDTHS.laptop)],
  parameters: {
    docs: {
      description: { story: "The narrow card: airport and clock first, the figures on their own row below." },
    },
  },
};
