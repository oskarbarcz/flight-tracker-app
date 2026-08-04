const GOOGLE_IDENTITY_SCRIPT_SRC = "https://accounts.google.com/gsi/client?hl=en";

type GoogleIdentityApi = typeof google.accounts.id;

let pendingLoad: Promise<GoogleIdentityApi | null> | null = null;

function readLoadedApi(): GoogleIdentityApi | null {
  return window.google?.accounts?.id ?? null;
}

function findExistingScript(): HTMLScriptElement | null {
  return document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_IDENTITY_SCRIPT_SRC}"]`);
}

function appendScript(): Promise<GoogleIdentityApi | null> {
  return new Promise((resolve) => {
    const script = findExistingScript() ?? document.createElement("script");
    script.addEventListener("load", () => resolve(readLoadedApi()));
    script.addEventListener("error", () => resolve(null));

    if (script.isConnected) {
      return;
    }

    script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

export function loadGoogleIdentity(): Promise<GoogleIdentityApi | null> {
  const alreadyLoaded = readLoadedApi();
  if (alreadyLoaded !== null) {
    return Promise.resolve(alreadyLoaded);
  }

  if (pendingLoad === null) {
    pendingLoad = appendScript();
  }

  return pendingLoad;
}
