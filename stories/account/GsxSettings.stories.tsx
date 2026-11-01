import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { GsxSettingsPanel } from "~/features/user/components/GsxSettingsPanel";
import type { GsxSettingsResponse } from "~/features/user/request";
import { atWidth, CARD_WIDTHS } from "../support/frames";

type GsxArgs = {
  settings: GsxSettingsResponse | null;
  loadFailed: boolean;
  saveFailure: string | null;
  onChange: (setting: keyof GsxSettingsResponse, enabled: boolean) => void;
};

const ACCOUNT_COLUMN = 576;

const newCrewMember: GsxSettingsResponse = {
  integrationEnabled: false,
  autoBoardingEnabled: true,
  autoDeboardingEnabled: true,
};

function InteractivePanel({ settings: initial, loadFailed, saveFailure, onChange }: GsxArgs) {
  const [settings, setSettings] = useState(initial);

  return (
    <GsxSettingsPanel
      gsx={{
        settings,
        loadFailed,
        saveFailure,
        change: (setting, enabled) => {
          onChange(setting, enabled);
          setSettings((current) => current && { ...current, [setting]: enabled });
        },
      }}
    />
  );
}

const meta = {
  title: "Account/GSX settings",
  render: (args) => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <InteractivePanel {...args} />
    </div>
  ),
  decorators: [atWidth(ACCOUNT_COLUMN)],
  args: {
    settings: newCrewMember,
    loadFailed: false,
    saveFailure: null,
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        component: `
The last section of the account page, shown to Cabin crew only. It holds what the Transponder should do with GSX. The
API only stores these settings; the Transponder running beside the sim acts on them.

**How the settings relate**

- **GSX integration** is the master switch and starts off.
- **Automatic boarding** and **Automatic deboarding** start on, but have no effect while the integration is off. Their
  switches stay visible and disabled, showing the kept choice, so turning the integration back on restores it.

**The drawings**

Each setting has a plan view of the aircraft at the gate, nose left with the jet bridge on door 1L. While the setting
takes effect, the passengers and their route are Signal Indigo and the drawing loops without end: boarding fills the
cabin row by row from the rear as passengers reach their seats, and deboarding empties it from the front as they walk
out. While it has no effect, or when the system asks for reduced motion, the drawing holds still. The drawing is hidden
from assistive technology because the text beside it says the same.
`,
      },
    },
  },
} satisfies Meta<GsxArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IntegrationOff: Story = {
  parameters: {
    docs: {
      description: {
        story: "What a crew member sees first. Nothing acts on GSX, and the two settings explain what they would do.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("switch", { name: "Automatic boarding" })).toBeDisabled();
    await expect(canvas.getByRole("switch", { name: "Automatic deboarding" })).toBeDisabled();

    await userEvent.click(canvas.getByRole("switch", { name: "GSX integration" }));

    await expect(args.onChange).toHaveBeenCalledWith("integrationEnabled", true);
    await expect(canvas.getByRole("switch", { name: "Automatic boarding" })).toBeEnabled();
  },
};

export const BothAutomatic: Story = {
  args: {
    settings: { integrationEnabled: true, autoBoardingEnabled: true, autoDeboardingEnabled: true },
  },
  parameters: {
    docs: {
      description: {
        story: "The integration is on and both phases follow GSX.",
      },
    },
  },
};

export const BoardingByHand: Story = {
  args: {
    settings: { integrationEnabled: true, autoBoardingEnabled: false, autoDeboardingEnabled: true },
  },
  parameters: {
    docs: {
      description: {
        story: "The crew member starts boarding in the app themselves, while deboarding still follows GSX.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("switch", { name: "Automatic deboarding" }));

    await expect(args.onChange).toHaveBeenCalledWith("autoDeboardingEnabled", false);
  },
};

export const KeptChoiceWhileOff: Story = {
  args: {
    settings: { integrationEnabled: false, autoBoardingEnabled: false, autoDeboardingEnabled: true },
  },
  parameters: {
    docs: {
      description: {
        story: "The integration was turned off after automatic boarding was disabled. The choice waits for its return.",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    settings: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "While the settings load. The drawings need no data; the switches hold their place without showing a value.",
      },
    },
  },
};

export const LoadFailed: Story = {
  args: {
    settings: null,
    loadFailed: true,
  },
  parameters: {
    docs: {
      description: {
        story: "The settings could not be read, so the section says how to recover instead of showing wrong switches.",
      },
    },
  },
};

export const SaveFailed: Story = {
  args: {
    settings: { integrationEnabled: true, autoBoardingEnabled: true, autoDeboardingEnabled: true },
    saveFailure: "That choice couldn’t be saved. Try again in a moment.",
  },
  parameters: {
    docs: {
      description: {
        story: "A change was rejected or never arrived. The switch has gone back to the saved value.",
      },
    },
  },
};

export const OnPhone: Story = {
  decorators: [atWidth(CARD_WIDTHS.phone)],
  args: {
    settings: { integrationEnabled: true, autoBoardingEnabled: true, autoDeboardingEnabled: false },
  },
  parameters: {
    docs: {
      description: {
        story: "In a narrow column the settings stack, each with its drawing at full width.",
      },
    },
  },
};
