import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { FlightStatus } from "~/features/flight";
import { RouteChart } from "~/features/route/components/Chart/RouteChart";
import { FLIGHT_COLOR } from "~/shared/lib/mapColors";
import { flightFixture } from "../fixtures/flights";
import { polarBriefing, routeBriefingState } from "../fixtures/routes";

function drawnRuns(canvasElement: HTMLElement): number[][][] {
  const paths = canvasElement.querySelectorAll(`path[stroke="${FLIGHT_COLOR}"]`);

  return [...paths].flatMap((path) =>
    (path.getAttribute("d") ?? "")
      .split("M")
      .filter(Boolean)
      .map((run) => run.split("L").map((vertex) => vertex.trim().split(" ").map(Number))),
  );
}

const meta = {
  title: "Maps/Route chart",
  component: RouteChart,
  decorators: [
    (Story) => (
      <div className="h-[32rem] w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    flight: flightFixture({ route: "polar", status: FlightStatus.InCruise }),
    briefing: polarBriefing,
    state: routeBriefingState(polarBriefing),
  },
  argTypes: {
    flight: { control: false, description: "Its airports are labelled and included in the fit." },
    briefing: { control: false, description: "The planned route and any oceanic track." },
    state: { control: false, description: "Briefing state shared with the route table." },
  },
  parameters: {
    docs: {
      description: {
        component: `
The planned route on the Briefing view's Route tab.

- **Route:** every leg between two fixes is a great circle, so it curves on the map instead of running straight.
- **Oceanic track:** the dotted line is drawn the same way.
- **Antimeridian:** a route that crosses it stays one continuous line, and the view centres on the route.

Tiles come from CARTO, so the map needs a network connection.
`,
      },
    },
  },
} satisfies Meta<typeof RouteChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PolarRoute: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "New York to Hong Kong over the Arctic, with long legs between fixes, crossing the antimeridian at 80°N.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    await waitFor(async () => {
      const runs = drawnRuns(canvasElement);
      const longestRun = Math.max(...runs.map((run) => run.length));
      const widestStep = Math.max(
        ...runs.flatMap((run) => run.slice(1).map(([x], index) => Math.abs(x - run[index][0]))),
      );

      await expect(longestRun).toBeGreaterThan(polarBriefing.route.fixes.length);
      await expect(widestStep).toBeLessThan(canvasElement.clientWidth / 2);
    });
  },
};
