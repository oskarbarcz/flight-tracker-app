import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { expect, fireEvent, fn, userEvent, waitFor, within } from "storybook/test";
import { type FilledSchedule, type Flight, FlightStatus } from "~/features/flight";
import { FlightProgressTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightProgressTab";
import { TrackedFlightContext } from "~/features/flight/hooks/useTrackedFlight";
import { formatDate } from "~/shared/lib/time";
import { flightFixture, trackedFlight } from "../fixtures/flights";

type ReportArgs = {
  flight: Flight;
  save: (times: Partial<FilledSchedule>) => Promise<void>;
};

const MINUTE = 60_000;

const inCruise = flightFixture({ status: FlightStatus.InCruise });
const taxiingIn = flightFixture({ status: FlightStatus.TaxiingIn });

function FlightThatLands({ save }: Pick<ReportArgs, "save">) {
  const [flight, setFlight] = useState(inCruise);

  return (
    <TrackedFlightContext.Provider value={{ ...trackedFlight(flight), reportPredictedTimes: save }}>
      <button type="button" onClick={() => setFlight(taxiingIn)}>
        Arrival reported
      </button>
      <FlightProgressTab />
    </TrackedFlightContext.Provider>
  );
}

function plannedArrival(flight: Flight): Date {
  return (flight.timesheet.estimated as FilledSchedule).arrivalTime;
}

function plannedOnBlock(flight: Flight): Date {
  return (flight.timesheet.estimated as FilledSchedule).onBlockTime;
}

function shifted(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MINUTE);
}

async function openDialog(canvasElement: HTMLElement) {
  await userEvent.click(within(canvasElement).getByRole("button", { name: "Update from FMC" }));

  return within(canvasElement.ownerDocument.body);
}

async function retype(input: HTMLElement, text: string) {
  await userEvent.clear(input);
  await userEvent.type(input, text);
}

async function expectFieldShown(body: ReturnType<typeof within>, name: RegExp) {
  await waitFor(() => expect(body.getByRole("textbox", { name })).toBeVisible());
}

const meta = {
  title: "Tracking/Report predicted times",
  render: ({ flight, save }) => (
    <TrackedFlightContext.Provider value={{ ...trackedFlight(flight), reportPredictedTimes: save }}>
      <FlightProgressTab />
    </TrackedFlightContext.Provider>
  ),
  args: {
    flight: inCruise,
    save: fn(async () => {}),
  },
  argTypes: {
    flight: { control: false },
    save: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `
Lets the pilot type in the times the FMC shows, or the ones ATC gave them. The button sits in the Predicted timesheet
card, on the Flight progress tab of Briefing.

- **When it shows.** From check-in until on-block. Before check-in the pilot enters estimates instead.
- **Which times.** Only events not reported yet, because each time locks once its actual event is reported.
- **What gets sent.** Only the times the pilot changed. The others stay on the check-in estimate.
`,
      },
    },
  },
} satisfies Meta<ReportArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InCruise: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Update from FMC" })).toBeVisible();
  },
  parameters: {
    docs: { description: { story: "In cruise: the button in the Predicted timesheet card's footer." } },
  },
};

export const AfterOnBlock: Story = {
  args: { flight: flightFixture({ status: FlightStatus.OnBlock }) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("button", { name: "Update from FMC" })).toBeNull();
  },
  parameters: {
    docs: { description: { story: "On block every time is locked, so the card has no button or footer." } },
  },
};

export const ShowsOnlyOpenTimes: Story = {
  play: async ({ canvasElement }) => {
    const body = await openDialog(canvasElement);

    await expectFieldShown(body, /predicted arrival/i);
    await expectFieldShown(body, /predicted on-block/i);
    await expect(body.queryByRole("textbox", { name: /predicted off-block/i })).toBeNull();
    await expect(body.queryByRole("textbox", { name: /predicted takeoff/i })).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story: "After takeoff, off-block and takeoff are locked, so only arrival and on-block can be edited.",
      },
    },
  },
};

export const AfterOffBlock: Story = {
  args: { flight: flightFixture({ status: FlightStatus.TaxiingOut }) },
  play: async ({ canvasElement }) => {
    const body = await openDialog(canvasElement);

    await expectFieldShown(body, /predicted takeoff/i);
    await expectFieldShown(body, /predicted arrival/i);
    await expectFieldShown(body, /predicted on-block/i);
    await expect(body.queryByRole("textbox", { name: /predicted off-block/i })).toBeNull();
  },
  parameters: {
    docs: { description: { story: "Taxiing out: off-block is locked, the three later times stay open." } },
  },
};

export const AfterArrival: Story = {
  args: { flight: taxiingIn },
  play: async ({ canvasElement }) => {
    const body = await openDialog(canvasElement);

    await expectFieldShown(body, /predicted on-block/i);
    await expect(body.queryByRole("textbox", { name: /predicted off-block/i })).toBeNull();
    await expect(body.queryByRole("textbox", { name: /predicted takeoff/i })).toBeNull();
    await expect(body.queryByRole("textbox", { name: /predicted arrival/i })).toBeNull();
  },
  parameters: {
    docs: { description: { story: "Taxiing in: only on-block is left to predict." } },
  },
};

export const EventReportedWhileDialogOpen: Story = {
  args: { save: fn(async () => {}) },
  render: ({ save }) => <FlightThatLands save={save} />,
  play: async ({ canvasElement, args }) => {
    const body = await openDialog(canvasElement);

    await retype(
      body.getByRole("textbox", { name: /predicted arrival/i }),
      formatDate(shifted(plannedArrival(inCruise), -5)),
    );
    await userEvent.tab();
    await fireEvent.click(within(canvasElement).getByText("Arrival reported"));

    await waitFor(() => expect(body.queryByRole("textbox", { name: /predicted arrival/i })).toBeNull());
    await expectFieldShown(body, /predicted on-block/i);

    await userEvent.click(body.getByRole("button", { name: "Save times" }));
    await waitFor(() => expect(body.queryByRole("button", { name: "Save times" })).toBeNull());
    await expect(args.save).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The arrival is reported while the dialog is open: its field disappears and the time typed into it is dropped, not sent.",
      },
    },
  },
};

export const SendsOnlyChangedTimes: Story = {
  args: { save: fn(async () => {}) },
  play: async ({ canvasElement, args }) => {
    const body = await openDialog(canvasElement);
    const arrival = shifted(plannedArrival(args.flight), -5);

    await retype(body.getByRole("textbox", { name: /predicted arrival/i }), formatDate(arrival));
    await userEvent.tab();
    await userEvent.click(body.getByRole("button", { name: "Save times" }));

    await waitFor(() => expect(args.save).toHaveBeenCalledTimes(1));
    const [times] = (args.save as ReturnType<typeof fn>).mock.calls[0] as [Partial<FilledSchedule>];
    await expect(Object.keys(times)).toEqual(["arrivalTime"]);
    await expect(formatDate(times.arrivalTime as Date)).toBe(formatDate(arrival));
  },
  parameters: {
    docs: { description: { story: "Only the arrival changed, so on-block stays on the check-in estimate." } },
  },
};

export const EnterSavesTypedTime: Story = {
  args: { flight: flightFixture({ status: FlightStatus.TaxiingIn }), save: fn(async () => {}) },
  play: async ({ canvasElement, args }) => {
    const body = await openDialog(canvasElement);
    const onBlock = shifted(plannedOnBlock(args.flight), 5);

    await retype(body.getByRole("textbox", { name: /predicted on-block/i }), `${formatDate(onBlock)}{Enter}`);

    await waitFor(() => expect(args.save).toHaveBeenCalledTimes(1));
    const [times] = (args.save as ReturnType<typeof fn>).mock.calls[0] as [Partial<FilledSchedule>];
    await expect(formatDate(times.onBlockTime as Date)).toBe(formatDate(onBlock));
  },
  parameters: {
    docs: {
      description: {
        story:
          "Taxiing in, only on-block is open. Pressing Enter saves what was just typed, without leaving the field.",
      },
    },
  },
};

export const NothingChanged: Story = {
  args: { save: fn(async () => {}) },
  play: async ({ canvasElement, args }) => {
    const body = await openDialog(canvasElement);

    await userEvent.click(body.getByRole("textbox", { name: /predicted arrival/i }));
    await userEvent.tab();
    await userEvent.click(body.getByRole("button", { name: "Save times" }));

    await waitFor(() => expect(body.queryByRole("button", { name: "Save times" })).toBeNull());
    await expect(args.save).not.toHaveBeenCalled();
  },
  parameters: {
    docs: { description: { story: "Saving without a change closes the dialog and records nothing." } },
  },
};

export const ArrivalAfterOnBlock: Story = {
  args: { save: fn(async () => {}) },
  play: async ({ canvasElement, args }) => {
    const body = await openDialog(canvasElement);

    await retype(
      body.getByRole("textbox", { name: /predicted arrival/i }),
      formatDate(shifted(plannedOnBlock(args.flight), 30)),
    );
    await userEvent.tab();
    await userEvent.click(body.getByRole("button", { name: "Save times" }));

    await waitFor(() => expect(body.getByText("On-block must be after arrival")).toBeVisible());
    await expect(args.save).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: { story: "An arrival later than on-block is refused until the on-block time is moved as well." },
    },
  },
};

export const BeforeOffBlock: Story = {
  args: { flight: flightFixture({ status: FlightStatus.BoardingFinished }) },
  play: async ({ canvasElement }) => {
    const body = await openDialog(canvasElement);

    await expectFieldShown(body, /predicted off-block/i);
    await expectFieldShown(body, /predicted on-block/i);
  },
  parameters: {
    docs: { description: { story: "Before off-block all four times are open, for example after an ATC slot." } },
  },
};

export const BeforeCheckIn: Story = {
  args: { flight: flightFixture({ status: FlightStatus.Ready }) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("button", { name: "Update from FMC" })).toBeNull();
  },
  parameters: {
    docs: { description: { story: "Before check-in there's no button: the pilot enters estimates at check-in." } },
  },
};
