import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { DeviceActivationCard } from "~/features/auth/components/DeviceActivationCard";
import type { DeviceActivationState, DeviceDecision } from "~/features/auth/hooks/useDeviceActivation";
import { AuthClient, type DeviceSignIn } from "~/features/auth/model";
import { atWidth, CARD_WIDTHS } from "../support/frames";

type ActivationArgs = {
  state: DeviceActivationState;
  account: string;
  onSubmitCode: (userCode: string) => void;
  onDecide: (decision: DeviceDecision) => void;
  onRetry: () => void;
  onEnterAnotherCode: () => void;
};

const AUTH_CARD = 448;

const simPc: DeviceSignIn = {
  userCode: "BCDF-GHJK",
  client: AuthClient.Transponder,
  deviceName: "SIM-PC",
  createdAt: "2026-11-01T12:00:00.000Z",
  expiresAt: "2026-11-01T12:10:00.000Z",
};

const meta = {
  title: "Account/Transponder sign-in",
  component: DeviceActivationCard,
  decorators: [atWidth(AUTH_CARD)],
  args: {
    state: { status: "awaiting", request: simPc, deciding: null, failure: null },
    account: "rick@example.com",
    onSubmitCode: fn(),
    onDecide: fn(),
    onRetry: fn(),
    onEnterAnotherCode: fn(),
  },
  argTypes: {
    state: { control: "object" },
  },
  parameters: {
    docs: {
      description: {
        component: `
The page at \`/activate\` where a pilot approves a Transponder sign-in. The Transponder shows a short code and opens
\`/activate?code=…\`; the page asks for sign-in first when needed and comes back here afterwards.

- **The code** is accepted in any case, with or without the dash.
- **Approving** shows what is asking, the device name when the Transponder sent one, the account it signs in to, and the
  code itself, so the pilot can compare it with the Transponder before approving. Nothing is approved without a click.
- **A code that is unknown, expired or already used** gets one answer: start the sign-in again in the Transponder.
`,
      },
    },
  },
} satisfies Meta<ActivationArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnterCode: Story = {
  args: {
    state: { status: "entering" },
  },
  parameters: {
    docs: {
      description: {
        story: "Opened without a code, for example by typing the address by hand. Any case and spacing is accepted.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox", { name: "Code" }), "bcdf ghjk");
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));

    await expect(args.onSubmitCode).toHaveBeenCalledWith("BCDF-GHJK");
  },
};

export const MissingCode: Story = {
  args: {
    state: { status: "entering" },
  },
  parameters: {
    docs: {
      description: {
        story: "Continue pressed with an empty field.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));

    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter the code to continue.");
    await expect(args.onSubmitCode).not.toHaveBeenCalled();
  },
};

export const Checking: Story = {
  args: {
    state: { status: "checking", userCode: "BCDF-GHJK" },
  },
  parameters: {
    docs: {
      description: {
        story: "The code is being looked up.",
      },
    },
  },
};

export const AwaitingApproval: Story = {
  parameters: {
    docs: {
      description: {
        story: "A Transponder named SIM-PC is waiting. The pilot compares the code and approves or declines.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("BCDF-GHJK")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Approve" }));

    await expect(args.onDecide).toHaveBeenCalledWith("approve");
  },
};

export const WithoutDeviceName: Story = {
  args: {
    state: { status: "awaiting", request: { ...simPc, deviceName: null }, deciding: null, failure: null },
  },
  parameters: {
    docs: {
      description: {
        story: "The Transponder sent no device name, so only the code identifies it.",
      },
    },
  },
};

export const Approving: Story = {
  args: {
    state: { status: "awaiting", request: simPc, deciding: "approve", failure: null },
  },
  parameters: {
    docs: {
      description: {
        story: "The approval is on its way. Both buttons are held until it answers.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("button", { name: /Approving/ })).toHaveAttribute("aria-disabled", "true");
    await expect(canvas.getByRole("button", { name: "Decline" })).toHaveAttribute("aria-disabled", "true");
  },
};

export const ApprovalFailed: Story = {
  args: {
    state: {
      status: "awaiting",
      request: simPc,
      deciding: null,
      failure: "Couldn’t approve the sign-in right now. Try again in a moment.",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "The approval did not go through. The request is still waiting, so the pilot can try again.",
      },
    },
  },
};

export const Approved: Story = {
  args: {
    state: { status: "approved", request: simPc },
  },
  parameters: {
    docs: {
      description: {
        story: "Approved. The Transponder picks up its sign-in on its next check.",
      },
    },
  },
};

export const Declined: Story = {
  args: {
    state: { status: "declined", request: simPc },
  },
  parameters: {
    docs: {
      description: {
        story: "Declined. The code can no longer be used.",
      },
    },
  },
};

export const CodeGone: Story = {
  args: {
    state: { status: "gone", userCode: "BCDF-GHJK" },
  },
  parameters: {
    docs: {
      description: {
        story: "The code is unknown, expired, or was already approved or declined.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Enter another code" }));

    await expect(args.onEnterAnotherCode).toHaveBeenCalled();
  },
};

export const LookupFailed: Story = {
  args: {
    state: {
      status: "unavailable",
      userCode: "BCDF-GHJK",
      message: "Can’t reach MyPreflight. Check your connection and try again.",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "The code could not be checked, so the page offers to try again rather than calling it expired.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));

    await expect(args.onRetry).toHaveBeenCalled();
  },
};

export const OnPhone: Story = {
  decorators: [atWidth(CARD_WIDTHS.phone)],
  parameters: {
    docs: {
      description: {
        story: "On a phone the two buttons stack, Approve first.",
      },
    },
  },
};
