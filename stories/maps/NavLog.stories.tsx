import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { NavLog } from "~/features/route/components/NavLog/NavLog";
import { buildFixInsights } from "~/features/route/lib/routeInsights";
import type { PlannedRouteFix } from "~/features/route/model";
import { atWidth } from "../support/frames";

const FIX: PlannedRouteFix = {
  ordinal: 3,
  ident: "CMK",
  latitude: 41.28,
  longitude: -73.58,
  altitude: 33_000,
  elapsedSeconds: 1_800,
  distanceNm: 51,
  trackTrue: 245,
  trackMag: 259,
  viaAirway: null,
  stage: "CRZ",
  fuel: { flow: 6_100, leg: 900, used: 3_550, minimumOnBoard: 2_150, plannedOnBoard: 8_050 },
  fuelReport: null,
  oat: null,
  isaDeviation: null,
  tropopause: null,
  mora: null,
  fir: null,
  wind: { direction: null, speed: null, levels: [] },
};

const REPORTED_FIX: PlannedRouteFix = {
  ...FIX,
  ordinal: 4,
  ident: "SAX",
  elapsedSeconds: 2_340,
  fuel: { ...FIX.fuel, plannedOnBoard: 7_150 },
  fuelReport: { actualOnBoard: 7_020, reportedAt: "2026-11-02T14:05:00.000Z" },
};

const BELOW_MINIMUM_FIX: PlannedRouteFix = {
  ...FIX,
  ordinal: 5,
  ident: "ARD",
  elapsedSeconds: 3_060,
  fuel: { ...FIX.fuel, plannedOnBoard: 6_440, minimumOnBoard: 2_000 },
  fuelReport: { actualOnBoard: 1_500, reportedAt: "2026-11-02T14:35:00.000Z" },
};

const meta = {
  title: "Maps/Nav log",
  component: NavLog,
  decorators: [atWidth(960)],
  args: {
    insights: buildFixInsights([FIX]),
    selectedOrdinal: null,
    onSelect: fn(),
    canReportFuel: false,
    onReportFuel: fn(async () => {}),
  },
  parameters: {
    docs: {
      description: {
        component:
          "The flight plan's fixes in flown order. Clicking a fix's name opens the rest of its figures below it.",
      },
    },
  },
} satisfies Meta<typeof NavLog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BeforeCruise: Story = {
  parameters: {
    docs: {
      description: { story: "Before cruise, with nothing reported, there is no Actual column and no button." },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole("columnheader", { name: "Actual t" })).toBeNull();

    await userEvent.click(canvas.getByRole("button", { name: "CMK" }));

    await expect(canvas.queryByRole("button", { name: /actual fuel/ })).toBeNull();
  },
};

export const ReportingInCruise: Story = {
  args: { canReportFuel: true },
  parameters: {
    docs: {
      description: { story: "In cruise, a fix's expanded row has the button that opens the actual fuel modal." },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("columnheader", { name: "Actual t" })).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "CMK" }));
    await userEvent.click(canvas.getByRole("button", { name: "Report actual fuel at CMK" }));

    await waitFor(() => expect(within(document.body).getByRole("dialog")).toBeVisible());

    const dialog = within(within(document.body).getByRole("dialog"));

    await userEvent.type(dialog.getByRole("spinbutton", { name: "Fuel on board" }), "7.95");
    await userEvent.click(dialog.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(args.onReportFuel).toHaveBeenCalledWith(3, 7_950));
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
  },
};

export const ReportedAfterCruise: Story = {
  args: { insights: buildFixInsights([FIX, REPORTED_FIX, BELOW_MINIMUM_FIX]) },
  parameters: {
    docs: {
      description: {
        story:
          "After the flight, the figures saved during cruise read beside the plan: pale amber below it, and red with a warning icon below minimum fuel.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("columnheader", { name: "Actual t" })).toBeVisible();
    await expect(canvas.getByRole("cell", { name: "7.02" })).toHaveClass("text-amber-800");

    const warning = canvas.getByRole("img", { name: "Below minimum fuel" });

    await expect(warning.closest("td")).toHaveClass("text-red-700");
    await expect(warning.closest("td")).toHaveTextContent("1.50");
  },
};
