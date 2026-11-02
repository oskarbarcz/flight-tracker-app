import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { NextScheduledFlightBox } from "~/features/flight/components/Dashboard/Main/Box/NextScheduledFlightBox";
import { flightFromNewYork, groundStopAfterFlight } from "../fixtures/groundStops";
import { atWidth, CARD_WIDTHS } from "../support/frames";

const meta = {
  title: "Dashboard/Next scheduled flight/Card",
  component: NextScheduledFlightBox,
  decorators: [atWidth(CARD_WIDTHS.laptop)],
  args: {
    flight: null,
    failed: false,
    departure: null,
  },
  argTypes: {
    flight: { control: false, description: "The pilot's next ready flight." },
    failed: { description: "The upcoming flights could not be loaded." },
    departure: {
      control: false,
      description:
        "Where the next flight will start from when none is scheduled yet: the current flight's destination, or the airport the pilot is at.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
The pilot's next ready flight. With nothing scheduled it shows the shape that flight will take instead of a blank
placeholder: the departure filled in when the app knows it, and dashed slots for whatever Operations has yet to decide.
`,
      },
    },
  },
} satisfies Meta<typeof NextScheduledFlightBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scheduled: Story = {
  args: { flight: flightFromNewYork() },
  parameters: {
    docs: { description: { story: "A ready flight exists, with its route and scheduled times." } },
  },
};

export const AwaitingDispatch: Story = {
  args: { departure: groundStopAfterFlight().airport },
  parameters: {
    docs: {
      description: { story: "Nothing is scheduled and the pilot's location is known, so the departure is filled in." },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Awaiting dispatch")).toBeVisible();
    await expect(canvas.getByText("JFK")).toBeVisible();
  },
};

export const AwaitingDispatchLocationUnknown: Story = {
  parameters: {
    docs: {
      description: {
        story: "Nothing is scheduled and the pilot has no known location yet, such as a new account with no travels.",
      },
    },
  },
};

export const Unavailable: Story = {
  args: { failed: true },
  parameters: {
    docs: { description: { story: "The upcoming flights failed to load. The card says so, never an empty state." } },
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("Awaiting dispatch")).toBeNull();
  },
};
