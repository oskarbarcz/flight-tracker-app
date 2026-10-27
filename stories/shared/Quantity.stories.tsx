import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Quantity } from "~/shared/ui/Display/Quantity";
import { onCard } from "../support/frames";

const meta = {
  title: "Shared/Quantity",
  component: Quantity,
  decorators: [onCard],
  args: { value: "3,342", unit: "nm", label: "flown" },
  argTypes: {
    value: { description: "The figure, already formatted, with thousands separators where they apply." },
    unit: { description: "The unit, set smaller and lighter than the figure." },
    label: { description: "What the figure is, in plain words." },
  },
  parameters: {
    docs: {
      description: {
        component: `
One labelled figure in running text: a bold tabular Roboto Mono value, its unit in a smaller mono weight, and a muted
word saying what it is. This is the Tabular Figures Rule applied inline, for figures that sit in a sentence-like row
rather than a column.

Used by the activity card ("353 t fuel burned", "14,510 nm flown") and the route gauge ("115 nm flown · 128 nm to go").
It never wraps inside itself.
`,
      },
    },
  },
} satisfies Meta<typeof Quantity>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Distance: Story = {};

export const Weight: Story = {
  args: { value: "353", unit: "t", label: "fuel burned" },
};

export const InARow: Story = {
  render: () => (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
      <Quantity value="115" unit="nm" label="flown" />
      <span className="text-xs text-gray-500 dark:text-gray-400" aria-hidden={true}>
        ·
      </span>
      <Quantity value="128" unit="nm" label="to go" />
    </span>
  ),
  parameters: {
    docs: { description: { story: "Two quantities joined by a middle dot, as in the route gauge." } },
  },
};
