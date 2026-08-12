import type { LinkDiscordAccountResponse } from "~/features/user/request";

export type DiscordHandoff = {
  failure?: string;
  link?: LinkDiscordAccountResponse;
};

export function withDiscordHandoff(handoff: DiscordHandoff): { discord: DiscordHandoff } {
  return { discord: handoff };
}

export function readDiscordHandoff(locationState: unknown): DiscordHandoff | null {
  if (typeof locationState !== "object" || locationState === null) {
    return null;
  }

  const candidate = (locationState as { discord?: unknown }).discord;

  if (typeof candidate !== "object" || candidate === null) {
    return null;
  }

  return candidate as DiscordHandoff;
}
