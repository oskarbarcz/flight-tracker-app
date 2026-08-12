import type { DiscordServerMembershipStatus } from "~/features/user";

export type DiscordMembershipState = "checking" | DiscordServerMembershipStatus;

export const briefingsFeature = {
  label: "Flight briefings as direct messages",
  description:
    "Each briefing is sent to you on Discord before the flight. This is what connecting Discord is for, so it cannot be turned off. It only reaches you while you are in the Flight Tracker server.",
} as const;

export const joinServerFeature = {
  label: "Add me to the Flight Tracker server",
  description:
    "Joins the server for you while connecting, so briefings can reach you. Without it you will need to join yourself before anything can be delivered.",
} as const;

export const serverMembershipFeature = {
  label: "Member of the Flight Tracker server",
  description:
    "Joining can only happen while connecting, so this is not something to switch on afterwards. If you are not in the server, use the invite.",
} as const;

export const membershipNote: Record<DiscordMembershipState, string | null> = {
  checking: null,
  member: "You are in the Flight Tracker server, so briefings arrive as direct messages.",
  not_member:
    "You are not in the Flight Tracker server, so briefings cannot be delivered as direct messages until you join.",
  unknown: null,
};
