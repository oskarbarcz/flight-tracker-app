import type { DiscordServerMembershipStatus } from "~/features/user";
import type { DiscordSettingsResponse } from "~/features/user/request";

export type DiscordMembershipState = "checking" | DiscordServerMembershipStatus;

export type DiscordMessageSetting = keyof DiscordSettingsResponse;

export type DiscordMessageId = "briefing" | "preliminaryLoadsheet" | "finalLoadsheet" | "delay";

export const messagesFeature = {
  label: "Receive Discord private messages",
  description: "Expand any of them to see the message you would get.",
} as const;

export const discordMessages: {
  id: DiscordMessageId;
  settings: DiscordMessageSetting[];
  label: string;
  excerpt: string;
}[] = [
  {
    id: "briefing",
    settings: ["briefingsEnabled"],
    label: "Flight briefing",
    excerpt: "When you check in, with the schedule, the departure weather, and the flight plan attached.",
  },
  {
    id: "preliminaryLoadsheet",
    settings: ["preliminaryLoadsheetEnabled"],
    label: "Preliminary loadsheet",
    excerpt: "When boarding starts, with the crew and the planned load.",
  },
  {
    id: "finalLoadsheet",
    settings: ["finalLoadsheetEnabled"],
    label: "Final loadsheet",
    excerpt: "When boarding finishes, with the load as it stands for departure.",
  },
  {
    id: "delay",
    settings: ["delayUpdatesEnabled"],
    label: "Delay updates",
    excerpt: "When a departure delay has to be allocated, and when operations approves what you allocated.",
  },
];

export const joinServerFeature = {
  label: "Add me to the Flight Tracker server",
  description:
    "Joins the server for you while connecting, so briefings can reach you. Without it you will need to join yourself before anything can be delivered.",
} as const;

export const membershipNote: Record<DiscordMembershipState, string | null> = {
  checking: null,
  member: "You are in the Flight Tracker server, so briefings arrive as direct messages.",
  not_member:
    "You are not in the Flight Tracker server, so briefings cannot be delivered as direct messages until you join.",
  unknown: null,
};
