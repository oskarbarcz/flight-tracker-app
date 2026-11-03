import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FuelReportList } from "~/features/flight/components/FuelAndLoadsheet/FuelReports";
import type { PlannedRouteFix } from "~/features/route/model";
import { atWidth, onCard } from "../support/frames";

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
  fuelReport: { actualOnBoard: 7_900, reportedAt: "2026-11-02T14:05:00.000Z" },
  oat: null,
  isaDeviation: null,
  tropopause: null,
  mora: null,
  fir: null,
  wind: { direction: null, speed: null, levels: [] },
};

const NOT_REPORTED: PlannedRouteFix = { ...FIX, ordinal: 2, ident: "HFD", fuelReport: null };

const ABOVE_PLAN: PlannedRouteFix = {
  ...FIX,
  ordinal: 4,
  ident: "SAX",
  fuel: { ...FIX.fuel, plannedOnBoard: 7_150 },
  fuelReport: { actualOnBoard: 7_400, reportedAt: "2026-11-02T14:20:00.000Z" },
};

const ON_PLAN: PlannedRouteFix = {
  ...FIX,
  ordinal: 5,
  ident: "ARD",
  fuel: { ...FIX.fuel, plannedOnBoard: 6_440 },
  fuelReport: { actualOnBoard: 6_440, reportedAt: "2026-11-02T14:35:00.000Z" },
};

const WITHOUT_PLAN: PlannedRouteFix = {
  ...FIX,
  ordinal: 6,
  ident: "TOD",
  fuel: { flow: null, leg: null, used: null, minimumOnBoard: null, plannedOnBoard: null },
  fuelReport: { actualOnBoard: 6_100, reportedAt: "2026-11-02T14:50:00.000Z" },
};

const BELOW_MINIMUM: PlannedRouteFix = {
  ...FIX,
  ordinal: 7,
  ident: "KPHL",
  fuel: { ...FIX.fuel, plannedOnBoard: 6_260, minimumOnBoard: 1_900 },
  fuelReport: { actualOnBoard: 1_500, reportedAt: "2026-11-02T15:05:00.000Z" },
};

const meta = {
  title: "Tracking/Fuel reports",
  component: FuelReportList,
  decorators: [onCard, atWidth(296)],
  argTypes: {
    fixes: { control: false, description: "The route's fixes in flown order. Only the reported ones are listed." },
  },
  parameters: {
    docs: {
      description: {
        component:
          "The end of the Fuel card on the Fuel & crew tab, in flight history and on the Operations loadsheet page. It lists every fix with a saved figure, whichever loadsheet the card's switch shows, because the difference is from the route's plan, not the loadsheet.",
      },
    },
  },
} satisfies Meta<typeof FuelReportList>;

export default meta;
type Story = StoryObj<typeof meta>;

function rowsOf(canvasElement: HTMLElement): string[][] {
  return [...within(canvasElement).getAllByRole("row")].map((row) =>
    [...row.querySelectorAll("th, td")].map((cell) => cell.textContent ?? ""),
  );
}

export const Listed: Story = {
  args: { fixes: [NOT_REPORTED, FIX, ABOVE_PLAN, ON_PLAN, WITHOUT_PLAN] },
  parameters: {
    docs: {
      description: {
        story:
          "Reported fixes in flown order, with the difference from EFOB signed. A fix the plan has no figure for shows a dash.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)).toEqual([
      ["Fix", "Actual", "Against EFOB"],
      ["CMK", "7.90t", "−0.15t"],
      ["SAX", "7.40t", "+0.25t"],
      ["ARD", "6.44t", "0.00t"],
      ["(TOD)", "6.10t", "—"],
    ]);
  },
};

export const ColouredAgainstThePlan: Story = {
  args: { fixes: [FIX, ABOVE_PLAN, ON_PLAN, BELOW_MINIMUM] },
  parameters: {
    docs: {
      description: {
        story:
          "Below EFOB reads in a pale amber and above it in a pale green. Below minimum fuel reads in red with a warning icon. Exactly on plan stays neutral.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("7.90")).toHaveClass("text-amber-800");
    await expect(canvas.getByText("−0.15")).toHaveClass("text-amber-800");
    await expect(canvas.getByText("7.40")).toHaveClass("text-green-800");
    await expect(canvas.getByText("+0.25")).toHaveClass("text-green-800");
    await expect(canvas.getByText("6.44")).toHaveClass("text-gray-700");
    await expect(canvas.getByText("1.50")).toHaveClass("text-red-700");
    await expect(canvas.getByText("−4.76")).toHaveClass("text-red-700");
    await expect(canvas.getAllByRole("img", { name: "Below minimum fuel" })).toHaveLength(1);
  },
};

export const NothingReported: Story = {
  args: { fixes: [NOT_REPORTED] },
  parameters: {
    docs: {
      description: { story: "With no saved figure, the card has no Fuel reports section." },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("table")).toBeNull();
    await expect(within(canvasElement).queryByText("Fuel reports")).toBeNull();
  },
};
