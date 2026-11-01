import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { SignedInDevicesPanel } from "~/features/auth/components/SignedInDevicesPanel";
import { AuthClient, type AuthSession } from "~/features/auth/model";
import { atWidth, CARD_WIDTHS } from "../support/frames";

type DevicesArgs = {
  sessions: AuthSession[] | null;
  loadFailed: boolean;
  signOut: (session: AuthSession) => Promise<void>;
};

const ACCOUNT_COLUMN = 576;

const thisBrowser: AuthSession = {
  id: "4f0c2d8e-6b1a-4e57-9c3d-2a7b8e1f5d60",
  client: AuthClient.Web,
  deviceName: null,
  createdAt: "2026-10-30T07:42:00.000Z",
  lastUsedAt: "2026-11-01T12:34:00.000Z",
  expiresAt: "2026-11-30T07:42:00.000Z",
  current: true,
};

const simPc: AuthSession = {
  id: "b93e71a4-0d5f-4c28-8a6e-f1c47d2b9e03",
  client: AuthClient.Transponder,
  deviceName: "SIM-PC",
  createdAt: "2026-10-28T18:02:00.000Z",
  lastUsedAt: "2026-11-01T12:31:00.000Z",
  expiresAt: "2026-11-27T18:02:00.000Z",
  current: false,
};

const tablet: AuthSession = {
  id: "e2a85c17-93bd-4f06-b7d1-5c0e9a3f8b24",
  client: AuthClient.Web,
  deviceName: null,
  createdAt: "2026-10-12T20:15:00.000Z",
  lastUsedAt: "2026-10-26T21:48:00.000Z",
  expiresAt: "2026-11-11T20:15:00.000Z",
  current: false,
};

function InteractivePanel({ sessions: initial, loadFailed, signOut }: DevicesArgs) {
  const [sessions, setSessions] = useState(initial);

  return (
    <SignedInDevicesPanel
      devices={{
        sessions,
        loadFailed,
        signOut: async (session) => {
          await signOut(session);
          setSessions((current) => (current === null ? null : current.filter(({ id }) => id !== session.id)));
        },
      }}
    />
  );
}

const meta = {
  title: "Account/Signed-in devices",
  render: (args) => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <InteractivePanel {...args} />
    </div>
  ),
  decorators: [atWidth(ACCOUNT_COLUMN)],
  args: {
    sessions: [thisBrowser, simPc, tablet],
    loadFailed: false,
    signOut: fn(async () => {}),
  },
  argTypes: {
    signOut: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `
A section of the account page, shown to every role. It lists each browser and Transponder signed in to the account,
most recently used first, with when it signed in and when it was last active, in UTC.

- **This device** marks the session the page itself runs in. It has no sign-out button here; the app's own sign-out
  ends it.
- **Sign out** asks first, because a signed-out Transponder stops sending flight data until the pilot signs it in again
  through the browser. A failed request keeps the dialog open with the reason. After signing out the list reloads.
`,
      },
    },
  },
} satisfies Meta<DevicesArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BrowserAndTransponder: Story = {
  parameters: {
    docs: {
      description: {
        story: "A pilot with the Transponder signed in on the sim PC and an older browser session on a tablet.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await expect(canvas.getAllByRole("button", { name: /^Sign out/ })).toHaveLength(2);

    await userEvent.click(canvas.getByRole("button", { name: "Sign out Transponder on SIM-PC" }));
    await waitFor(() => expect(body.getByRole("dialog")).toBeVisible());
    await userEvent.click(within(body.getByRole("dialog")).getByRole("button", { name: "Sign out" }));

    await expect(args.signOut).toHaveBeenCalledWith(simPc);
    await expect(await canvas.findByText("Transponder on SIM-PC signed out.")).toBeVisible();
    await expect(canvas.queryByText("Transponder on SIM-PC")).toBeNull();
  },
};

export const SignOutFailed: Story = {
  args: {
    signOut: fn(() =>
      Promise.reject({ statusCode: 503, error: "Service Unavailable", message: "Service Unavailable" }),
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "The sign-out request failed. The dialog stays open with the reason, and the device stays listed.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole("button", { name: "Sign out Browser" }));
    await waitFor(() => expect(body.getByRole("dialog")).toBeVisible());
    await userEvent.click(within(body.getByRole("dialog")).getByRole("button", { name: "Sign out" }));

    await waitFor(() =>
      expect(body.getByText("Couldn’t sign out this device right now. Try again in a moment.")).toBeVisible(),
    );
    await expect(args.signOut).toHaveBeenCalledWith(tablet);
    await expect(body.getByRole("dialog")).toBeInTheDocument();
  },
};

export const OnlyThisDevice: Story = {
  args: {
    sessions: [thisBrowser],
  },
  parameters: {
    docs: {
      description: {
        story: "Signed in nowhere else. The one session is this browser, so there is nothing to sign out here.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("This device")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: /^Sign out/ })).toBeNull();
  },
};

export const Loading: Story = {
  args: {
    sessions: null,
  },
  parameters: {
    docs: {
      description: {
        story: "While the sessions load.",
      },
    },
  },
};

export const LoadFailed: Story = {
  args: {
    sessions: null,
    loadFailed: true,
  },
  parameters: {
    docs: {
      description: {
        story: "The sessions could not be read, so the section says how to recover instead of showing an empty list.",
      },
    },
  },
};

export const OnPhone: Story = {
  decorators: [atWidth(CARD_WIDTHS.phone)],
  parameters: {
    docs: {
      description: {
        story: "In a narrow column the sign-in and last-active times wrap onto their own lines.",
      },
    },
  },
};
