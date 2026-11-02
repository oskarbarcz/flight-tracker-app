import type { Meta, StoryObj } from "@storybook/react-vite";
import { GroundStopMap } from "~/features/flight/components/Map/Box/GroundStopMap";
import { groundStopAfterFlight, newYorkLayout, newYorkLayoutWithoutStand } from "../fixtures/groundStops";
import { atWidth, CARD_WIDTHS } from "../support/frames";

const { airport, arrivedOn } = groundStopAfterFlight();

const FRAME = "overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800";

const meta = {
  title: "Maps/Ground stop map",
  component: GroundStopMap,
  decorators: [atWidth(CARD_WIDTHS.desktop)],
  args: {
    airport,
    layout: newYorkLayout,
    aircraft: arrivedOn ? { registration: arrivedOn.aircraft.registration, operator: arrivedOn.operator } : null,
    className: `h-48 ${FRAME}`,
  },
  argTypes: {
    airport: { control: false, description: "The airport the map opens on." },
    layout: { control: false, description: "Runways and terminals to draw, and the stand to settle on when known." },
    aircraft: { control: false, description: "The aircraft named on the stand marker." },
    className: { description: "Sizes the map. The card uses `h-40` as a band and `h-48` as a wide strip." },
  },
  parameters: {
    docs: {
      description: {
        component: `
A small, static map of the airport the pilot is at, used as the map strip of the on-the-ground card. It always draws on
the globe, like the Current flight card it stands in for.

- **Fit:** opens on the airport's outline, or a 3.5 km circle around it when it has no outline.
- **Settle:** with a known stand, the camera flies to it after a short delay. Under \`prefers-reduced-motion\` it goes
  straight there.
- **Static:** no panning, zooming or keyboard focus inside the map. One link covers it and opens the airports library.
`,
      },
    },
  },
} satisfies Meta<typeof GroundStopMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ParkedOnAStand: Story = {
  parameters: {
    docs: { description: { story: "The pilot closed a flight on a known stand, so the camera settles on it." } },
  },
};

export const NoStand: Story = {
  args: { layout: newYorkLayoutWithoutStand, aircraft: null },
  parameters: {
    docs: {
      description: { story: "A dead-head arrival or a flight with no reported stand. The map stays on the airport." },
    },
  },
};
