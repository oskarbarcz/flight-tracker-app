import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { FixInfoCard } from "~/features/route/components/Chart/FixInfoCard";
import { buildFixInsights, type FixInsight } from "~/features/route/lib/routeInsights";
import type { PlannedRouteFix } from "~/features/route/model";
import { atWidth } from "../support/frames";

const OCEANIC_FIX: PlannedRouteFix = {
  ordinal: 11,
  ident: "5620N",
  latitude: 56,
  longitude: -20,
  altitude: 37_000,
  elapsedSeconds: 9_900,
  distanceNm: 181,
  trackTrue: 283,
  trackMag: 291,
  viaAirway: "NATA",
  stage: "CRZ",
  fuel: { flow: 11_164, leg: 2_791, used: 33_771, minimumOnBoard: 31_329, plannedOnBoard: 37_065 },
  fuelReport: null,
  oat: -50,
  isaDeviation: 7,
  tropopause: 36_500,
  mora: 2_000,
  fir: "EGGX",
  wind: {
    direction: 267,
    speed: 71,
    levels: [
      { altitude: 0, direction: 267, speed: 21, oat: 22 },
      { altitude: 10_000, direction: 272, speed: 36, oat: 2 },
      { altitude: 18_000, direction: 276, speed: 47, oat: -14 },
      { altitude: 24_000, direction: 279, speed: 55, oat: -26 },
      { altitude: 30_000, direction: 282, speed: 64, oat: -37 },
      { altitude: 34_000, direction: 284, speed: 70, oat: -45 },
      { altitude: 38_000, direction: 286, speed: 75, oat: -50 },
    ],
  },
};

const TOP_OF_CLIMB: PlannedRouteFix = {
  ...OCEANIC_FIX,
  ident: "TOC",
  viaAirway: null,
  stage: "CLB",
  distanceNm: null,
  trackTrue: null,
  trackMag: null,
  fuel: { flow: null, leg: null, used: null, minimumOnBoard: null, plannedOnBoard: null },
  isaDeviation: null,
  tropopause: null,
  mora: null,
  fir: null,
  wind: { direction: null, speed: null, levels: [] },
};

const REPORTED_FIX: PlannedRouteFix = {
  ...OCEANIC_FIX,
  fuelReport: { actualOnBoard: 36_900, reportedAt: "2026-11-02T14:05:00.000Z" },
};

function insightOf(fix: PlannedRouteFix): FixInsight {
  return buildFixInsights([fix])[0];
}

async function openedDialog() {
  const body = within(document.body);

  await waitFor(() => expect(body.getByRole("dialog")).toBeVisible());

  return within(body.getByRole("dialog"));
}

const meta = {
  title: "Maps/Fix info card",
  component: FixInfoCard,
  decorators: [atWidth(352)],
  args: {
    insight: insightOf(OCEANIC_FIX),
    onClose: fn(),
    onCenter: fn(),
    onPrevious: fn(),
    onNext: fn(),
  },
  argTypes: {
    insight: { control: false, description: "The planned fix, with its distance flown and fuel margin." },
    onClose: { description: "Called by the close button." },
    onCenter: { description: "Called by the center button, to zoom in and center the map on the fix." },
    onPrevious: { description: "Called by the back arrow. Left out at the first fix, which disables the arrow." },
    onNext: { description: "Called by the forward arrow. Left out at the last fix, which disables the arrow." },
    canReportFuel: { description: "Whether the flight is in cruise, the only time actual fuel can be saved." },
    onReportFuel: { description: "Called with the fix's ordinal and the fuel on board in kilograms." },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Opens at the top right of the Tracking map when a fix's dot or name is clicked, and shows that fix's figures in four sections. It stays open until closed or until another fix is clicked. The header and close button stay in place while the figures scroll.",
      },
    },
  },
} satisfies Meta<typeof FixInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullPlan: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A fix from a full flight plan, with the FIR's name. Meta, Flight fix and Fuel share four columns, with each label above its value. Wind and environment starts folded, because it is the longest section and the least often read. Fuel's heading names the flight plan as the source of its figures.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Meta",
      "Flight fix",
      "Fuel · Flight plan",
      "Wind and environment",
    ]);
    await expect(canvas.getByRole("button", { name: "Meta" })).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("button", { name: "Wind and environment" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(canvas.queryAllByRole("rowheader")).toEqual([]);
    await expect(await canvas.findByText("SHANWICK OCEANIC")).toBeInTheDocument();
    await expect(canvas.getByText("EFOB").getBoundingClientRect().top).toBe(
      canvas.getByText("Leg burn").getBoundingClientRect().top,
    );
    await expect(canvas.getByText("Position").getBoundingClientRect().top).toBe(
      canvas.getByText("Track mag").getBoundingClientRect().top,
    );
    await expect(canvas.getByText("Tropopause").getBoundingClientRect().left).toBe(
      canvas.getByText("EFOB").getBoundingClientRect().left,
    );
    await expect(canvas.getByText("Wind").getBoundingClientRect().left).toBe(
      canvas.getByText("Leg burn").getBoundingClientRect().left,
    );
    await expect(canvas.queryByText("Actual")).toBeNull();
    await expect(canvas.queryByRole("button", { name: /actual fuel/ })).toBeNull();

    await userEvent.click(canvas.getByRole("button", { name: "Previous fix" }));
    await userEvent.click(canvas.getByRole("button", { name: "Next fix" }));
    await userEvent.click(canvas.getByRole("button", { name: "Center on 5620N" }));
    await userEvent.click(canvas.getByRole("button", { name: "Close 5620N" }));

    await expect(args.onPrevious).toHaveBeenCalledOnce();
    await expect(args.onNext).toHaveBeenCalledOnce();
    await expect(args.onCenter).toHaveBeenCalledOnce();
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

export const LastFix: Story = {
  args: { onNext: undefined },
  parameters: {
    docs: {
      description: { story: "The last fix on the route has no next fix, so its forward arrow is disabled." },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("button", { name: "Next fix" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Previous fix" })).toBeEnabled();
  },
};

export const FoldingSections: Story = {
  parameters: {
    docs: {
      description: {
        story: "Each section folds from its heading. Opened, the wind levels read from the highest down.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Wind and environment" }));

    await expect(canvas.getAllByRole("rowheader").map((level) => level.textContent)).toEqual([
      "FL380",
      "FL340",
      "FL300",
      "FL240",
      "FL180",
      "10,000 ft",
      "0 ft",
    ]);

    await userEvent.click(canvas.getByRole("button", { name: "Fuel · Flight plan" }));

    await expect(canvas.queryByText("EFOB")).toBeNull();
    await expect(canvas.getByRole("button", { name: "Fuel · Flight plan" })).toHaveAttribute("aria-expanded", "false");
  },
};

export const PseudoFixWithoutData: Story = {
  args: { insight: insightOf(TOP_OF_CLIMB) },
  parameters: {
    docs: {
      description: {
        story: "A fix the plan says little about: no airway, dashes for missing figures and no wind section.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByRole("heading", { name: "(TOC)" })).toBeVisible());
    await expect(canvas.queryByRole("heading", { name: "Wind and environment" })).toBeNull();
  },
};

export const ShortOfHeight: Story = {
  decorators: [
    (Story) => (
      <div className="flex h-64 items-start">
        <Story />
      </div>
    ),
  ],
  args: { className: "max-h-full" },
  parameters: {
    docs: {
      description: {
        story:
          "On a short map the figures scroll inside the card and the close button stays visible. Opening a section at the bottom scrolls it into view.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByRole("button", { name: "Close 5620N" })).toBeVisible());

    const card = canvasElement.querySelector("section");

    await expect(card?.getBoundingClientRect().height).toBeLessThanOrEqual(256);

    await userEvent.click(canvas.getByRole("button", { name: "Wind and environment" }));

    const [highestLevel] = canvas.getAllByRole("rowheader");

    await expect(highestLevel.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      card?.getBoundingClientRect().bottom ?? 0,
    );
  },
};

export const ReportingFuelInCruise: Story = {
  args: { canReportFuel: true, onReportFuel: fn(async () => {}) },
  parameters: {
    docs: {
      description: {
        story:
          "While the flight is in cruise, a small button below the plan opens a modal that takes the fuel on board read at this fix, in tonnes, with the plan's EFOB beside it. The field has focus when the modal opens, and focus returns to the button when it closes.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const report = canvas.getByRole("button", { name: "Report actual fuel at 5620N" });

    await expect(canvas.getByText("Actual")).toBeVisible();

    await userEvent.click(report);

    const dialog = await openedDialog();
    const input = dialog.getByRole("spinbutton", { name: "Fuel on board" });

    await waitFor(() => expect(input).toHaveFocus());
    await expect(dialog.queryByText("Fuel on board is required")).toBeNull();
    await expect(dialog.getByText("Fuel Report")).toBeInTheDocument();
    await expect(dialog.getByText("5620N fix")).toBeInTheDocument();
    await waitFor(() => expect(dialog.getByText("Flight plan EFOB")).toBeVisible());

    await userEvent.type(input, "36.9");
    await userEvent.click(dialog.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(args.onReportFuel).toHaveBeenCalledWith(11, 36_900));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(report).toHaveFocus());
  },
};

export const RefusesFuelThatIsNotAMass: Story = {
  args: { canReportFuel: true, onReportFuel: fn(async () => {}) },
  parameters: {
    docs: {
      description: { story: "A figure that cannot be fuel on board stays in the modal with a message below it." },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("button", { name: "Report actual fuel at 5620N" }));

    const dialog = await openedDialog();

    await userEvent.click(dialog.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(dialog.getByText("Fuel on board is required")).toBeVisible());

    await userEvent.type(dialog.getByRole("spinbutton", { name: "Fuel on board" }), "-1");
    await waitFor(() => expect(dialog.getByText("Cannot be negative")).toBeVisible());

    await expect(args.onReportFuel).not.toHaveBeenCalled();

    await userEvent.click(dialog.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  },
};

export const ReportedFuelInCruise: Story = {
  args: { insight: insightOf(REPORTED_FIX), canReportFuel: true, onReportFuel: fn(async () => {}) },
  parameters: {
    docs: {
      description: {
        story:
          "A saved figure shows below the plan, directly under EFOB, and stays editable while the flight is in cruise. Saving again replaces it.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const section = within(
      canvas.getByRole("button", { name: "Fuel · Flight plan" }).closest("section") as HTMLElement,
    );
    const edit = canvas.getByRole("button", { name: "Update actual fuel at 5620N" });

    await expect(section.getByText("36.90")).toBeVisible();
    await expect(section.getByText("36.90")).toHaveClass("text-amber-800");
    await expect(section.getByText("−0.17")).toBeVisible();
    await expect(section.getByText("Actual").getBoundingClientRect().left).toBe(
      section.getByText("EFOB").getBoundingClientRect().left,
    );

    await userEvent.click(edit);

    const firstOpen = await openedDialog();

    await expect(firstOpen.getByText("5620N fix")).toBeInTheDocument();
    await expect(firstOpen.getByRole("spinbutton", { name: "Fuel on board" })).toHaveValue(36.9);

    await userEvent.click(firstOpen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());

    await userEvent.click(edit);

    const secondOpen = await openedDialog();
    const input = secondOpen.getByRole("spinbutton", { name: "Fuel on board" });

    await userEvent.clear(input);
    await userEvent.type(input, "36.85");
    await userEvent.click(secondOpen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(args.onReportFuel).toHaveBeenCalledWith(11, 36_850));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  },
};

export const FuelBelowMinimum: Story = {
  args: {
    insight: insightOf({
      ...OCEANIC_FIX,
      fuelReport: { actualOnBoard: 30_000, reportedAt: "2026-11-02T14:05:00.000Z" },
    }),
  },
  parameters: {
    docs: {
      description: { story: "Fuel below the plan's minimum reads in red with a warning icon." },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("img", { name: "Below minimum fuel" })).toBeVisible();
    await expect(canvas.getByText("30.00")).toHaveClass("text-red-700");
    await expect(canvas.getByText("−7.07")).toHaveClass("text-red-700");
  },
};

export const ReportedFuelAfterCruise: Story = {
  args: { insight: insightOf(REPORTED_FIX) },
  parameters: {
    docs: {
      description: { story: "After landing the figure stays on the fix, and it can no longer be changed." },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Actual")).toBeVisible();
    await expect(canvas.getByText("36.90")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: /actual fuel/ })).toBeNull();
  },
};
