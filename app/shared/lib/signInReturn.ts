const signInPath = "/sign-in";
const returnToParam = "returnTo";
const unreturnablePaths = new Set(["/", "/sign-in", "/sign-out", "/confirm-email"]);
const unreturnablePrefix = "/auth/";

export function toReturnPath(candidate: string | null | undefined): string | null {
  if (typeof candidate !== "string" || !candidate.startsWith("/")) {
    return null;
  }

  const url = new URL(candidate, window.location.origin);

  if (
    url.origin !== window.location.origin ||
    unreturnablePaths.has(url.pathname) ||
    url.pathname.startsWith(unreturnablePrefix)
  ) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function readReturnPath(search: string): string | null {
  return toReturnPath(new URLSearchParams(search).get(returnToParam));
}

export function signInPathReturningTo(candidate: string | null | undefined): string {
  const returnPath = toReturnPath(candidate);

  if (returnPath === null) {
    return signInPath;
  }

  return `${signInPath}?${new URLSearchParams({ [returnToParam]: returnPath }).toString()}`;
}

export function currentLocationPath(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}
