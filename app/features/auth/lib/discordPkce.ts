const RANDOM_BYTES = 32;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomBase64Url(): string {
  const bytes = new Uint8Array(RANDOM_BYTES);
  crypto.getRandomValues(bytes);

  return toBase64Url(bytes);
}

export function createStateValue(): string {
  return randomBase64Url();
}

export function createCodeVerifier(): string {
  return randomBase64Url();
}

export async function deriveCodeChallenge(codeVerifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));

  return toBase64Url(new Uint8Array(digest));
}
