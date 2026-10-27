import type { Meta, StoryObj } from "@storybook/react-vite";
import { CurrentFlightBoxLoader } from "~/features/flight/components/Dashboard/Main/Box/Loader/CurrentFlightBoxLoader";
import { atWidth, CARD_WIDTHS } from "../support/frames";

const meta = {
  title: "Dashboard/Current flight/Loading skeleton",
  component: CurrentFlightBoxLoader,
  decorators: [atWidth(CARD_WIDTHS.desktop)],
  args: { expectsFlight: true },
  argTypes: {
    expectsFlight: {
      description:
        "Whether the user has a current flight. When false the skeleton is hidden below 640px, because the card will turn into the short empty state.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Shown while the current flight loads. It mirrors the card's structure block for block, so nothing moves when the data
arrives: the map strip, the flight strip with the route between flight and time, the supporting figures, the phase and
the footer. It pulses, and holds still under \`prefers-reduced-motion\`.
`,
      },
    },
  },
} satisfies Meta<typeof CurrentFlightBoxLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    docs: { description: { story: "The wide card: map strip on top, flight, route and time on one row." } },
  },
};

export const Phone: Story = {
  decorators: [atWidth(CARD_WIDTHS.phone)],
  parameters: {
    docs: { description: { story: "The narrow card: flight and time first, the route on its own row." } },
  },
};
