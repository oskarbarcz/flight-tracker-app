import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { FlightStatus } from "~/features/flight";
import type { MapProjection } from "~/features/flight/hooks/useMapProjection";
import { RouteChart } from "~/features/route/components/Chart/RouteChart";
import { FLIGHT_COLOR } from "~/shared/lib/mapColors";
import { flightFixture } from "../fixtures/flights";
import { polarBriefing, polarEtopsAirports, polarEtopsBriefing, routeBriefingState } from "../fixtures/routes";

const RENDERER_KEY = "map-projection.route-chart";

function withRenderer(renderer: MapProjection) {
  return () => {
    window.localStorage.setItem(RENDERER_KEY, JSON.stringify(renderer));

    return () => window.localStorage.removeItem(RENDERER_KEY);
  };
}

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
- **Projection:** the top bar switches between the Mercator Leaflet map and a MapLibre globe. The choice is remembered
  in \`localStorage\` under \`map-projection.route-chart\`; the globe is the default.

The basemap is VersaTiles Positrino in both projections, so the map needs a network connection.
`,
      },
    },
  },
} satisfies Meta<typeof RouteChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PolarRoute: Story = {
  beforeEach: withRenderer("mercator"),
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

export const GlobePolarRoute: Story = {
  beforeEach: withRenderer("globe"),
  parameters: {
    docs: {
      description: {
        story:
          "The same New York to Hong Kong flight on the globe. The camera centres on the route and zooms until every fix is in front of the horizon.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    await waitFor(
      async () => {
        await expect(canvasElement.querySelector(".maplibregl-canvas")).not.toBeNull();
        const visibleLabels = [...canvasElement.querySelectorAll<HTMLElement>(".map-airport-label")].filter(
          (label) => label.closest<HTMLElement>(".maplibregl-marker")?.style.display !== "none",
        );
        await expect(visibleLabels).toHaveLength(2);
      },
      { timeout: 10_000 },
    );
  },
};

export const GlobeEtops: Story = {
  beforeEach: withRenderer("globe"),
  args: {
    briefing: polarEtopsBriefing,
    state: routeBriefingState(polarEtopsBriefing, polarEtopsAirports),
  },
  parameters: {
    docs: {
      description: {
        story:
          "An ETOPS 180 plan over the Arctic. Rule and threshold rings around each adequate airport are geodesic circles, so they stay round on the globe instead of stretching towards the pole. The 180-minute rings around Resolute Bay and Utqiagvik cross the pole, beyond the 85° edge of the Mercator tiles, so the globe draws rings in its own projected layer. Entry, equal-time, critical and exit points are pseudo-fixes, drawn and named like TOC and TOD: (ETP IN), (ETP), (CP), (ETP OUT).",
      },
    },
  },
  play: async ({ canvasElement }) => {
    await waitFor(
      async () => {
        const names = [...canvasElement.querySelectorAll(".map-fix-label")].map((label) => label.textContent);
        await expect(names).toHaveLength(
          polarEtopsBriefing.route.fixes.length + (polarEtopsBriefing.etops?.points.length ?? 0),
        );
        await expect(names).toEqual(
          expect.arrayContaining(["(TOC)", "(TOD)", "(ETP IN)", "(ETP)", "(CP)", "(ETP OUT)"]),
        );
        const rings = [...canvasElement.querySelectorAll(".maplibregl-canvas + svg path")];
        await expect(rings).toHaveLength(polarEtopsAirports.size * 2);
        await expect(rings.every((ring) => (ring.getAttribute("d") ?? "").startsWith("M"))).toBe(true);
      },
      { timeout: 10_000 },
    );
  },
};
