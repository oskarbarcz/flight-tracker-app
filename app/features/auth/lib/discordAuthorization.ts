import { type DiscordFlowIntent, rememberDiscordFlow } from "~/features/auth/lib/discordFlowState";
import { createCodeVerifier, createStateValue, deriveCodeChallenge } from "~/features/auth/lib/discordPkce";
import { getDiscordClientId } from "~/shared/lib/getDiscordClientId";

const authorizeEndpoint = "https://discord.com/oauth2/authorize";
const identifyScope = "identify";
const guildsJoinScope = "guilds.join";

export const discordCallbackPath = "/auth/discord/callback";

export function discordCallbackUrl(): string {
  return new URL(discordCallbackPath, window.location.origin).toString();
}

function scopeFor(joinServer: boolean): string {
  return joinServer ? `${identifyScope} ${guildsJoinScope}` : identifyScope;
}

type AuthorizeUrlOptions = {
  clientId: string;
  state: string;
  codeChallenge: string;
  joinServer: boolean;
};

export function buildDiscordAuthorizeUrl({ clientId, state, codeChallenge, joinServer }: AuthorizeUrlOptions): string {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: discordCallbackUrl(),
    scope: scopeFor(joinServer),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  if (joinServer) {
    params.set("prompt", "consent");
  }

  return `${authorizeEndpoint}?${params.toString()}`;
}

export async function startDiscordFlow(intent: DiscordFlowIntent, joinServer = false): Promise<void> {
  const clientId = getDiscordClientId();

  if (clientId === null) {
    return;
  }

  const state = createStateValue();
  const codeVerifier = createCodeVerifier();
  const codeChallenge = await deriveCodeChallenge(codeVerifier);

  rememberDiscordFlow({ intent, state, codeVerifier, joinServer });

  window.location.assign(buildDiscordAuthorizeUrl({ clientId, state, codeChallenge, joinServer }));
}
