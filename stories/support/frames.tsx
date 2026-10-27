import type { Decorator } from "@storybook/react-vite";
import React from "react";

export const CARD_WIDTHS = {
  phone: 366,
  laptop: 420,
  desktop: 724,
} as const;

export function atWidth(width: number): Decorator {
  return (Story) => (
    <div style={{ width, maxWidth: "100%" }}>
      <Story />
    </div>
  );
}

export const onCard: Decorator = (Story) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
    <Story />
  </div>
);
