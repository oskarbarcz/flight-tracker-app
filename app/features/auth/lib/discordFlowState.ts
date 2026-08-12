export type DiscordFlowIntent = "signin" | "link";

export type DiscordFlowState = {
  intent: DiscordFlowIntent;
  state: string;
  codeVerifier: string;
  joinServer: boolean;
};

const storageKey = "ft.discordFlow";

function isFlowState(candidate: Partial<DiscordFlowState>): candidate is DiscordFlowState {
  return (
    (candidate.intent === "signin" || candidate.intent === "link") &&
    typeof candidate.state === "string" &&
    candidate.state.length > 0 &&
    typeof candidate.codeVerifier === "string" &&
    candidate.codeVerifier.length > 0 &&
    typeof candidate.joinServer === "boolean"
  );
}

let taken: { value: DiscordFlowState | null } | null = null;

export function rememberDiscordFlow(flow: DiscordFlowState): void {
  taken = null;

  try {
    sessionStorage.setItem(storageKey, JSON.stringify(flow));
  } catch {
    return;
  }
}

function readAndClearStoredFlow(): DiscordFlowState | null {
  let stored: string | null = null;

  try {
    stored = sessionStorage.getItem(storageKey);
    sessionStorage.removeItem(storageKey);
  } catch {
    return null;
  }

  if (stored === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<DiscordFlowState>;

    return isFlowState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function takeDiscordFlow(): DiscordFlowState | null {
  if (taken === null) {
    taken = { value: readAndClearStoredFlow() };
  }

  return taken.value;
}
