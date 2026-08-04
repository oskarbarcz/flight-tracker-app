import { useThemeMode } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadGoogleIdentity } from "~/features/auth/lib/loadGoogleIdentity";
import { getGoogleClientId } from "~/shared/lib/getGoogleClientId";

const MIN_BUTTON_WIDTH = 200;
const MAX_BUTTON_WIDTH = 400;

type GoogleIdentityApi = typeof google.accounts.id;

export type GoogleIdentityStatus = "unconfigured" | "loading" | "ready" | "unavailable";

type UseGoogleIdentityOptions = {
  text: "signin_with" | "continue_with";
  onCredential: (idToken: string) => void;
};

type UseGoogleIdentityResult = {
  containerRef: (element: HTMLDivElement | null) => void;
  status: GoogleIdentityStatus;
};

function buttonWidth(container: HTMLElement): number {
  const measured = Math.round(container.getBoundingClientRect().width);

  return Math.min(Math.max(measured, MIN_BUTTON_WIDTH), MAX_BUTTON_WIDTH);
}

export function useGoogleIdentity({ text, onCredential }: UseGoogleIdentityOptions): UseGoogleIdentityResult {
  const { computedMode } = useThemeMode();
  const [api, setApi] = useState<GoogleIdentityApi | null>(null);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const clientId = getGoogleClientId();

  const latestCallback = useRef(onCredential);
  latestCallback.current = onCredential;

  useEffect(() => {
    if (clientId === null) {
      return;
    }

    let active = true;

    loadGoogleIdentity().then((loaded) => {
      if (!active) {
        return;
      }

      setApi(loaded);
      setLoadFailed(loaded === null);
    });

    return () => {
      active = false;
    };
  }, [clientId]);

  useEffect(() => {
    if (api === null || clientId === null) {
      return;
    }

    api.initialize({
      client_id: clientId,
      callback: ({ credential }) => latestCallback.current(credential),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }, [api, clientId]);

  useEffect(() => {
    if (container === null) {
      return;
    }

    const observer = new ResizeObserver(() => setWidth(buttonWidth(container)));
    observer.observe(container);

    return () => observer.disconnect();
  }, [container]);

  useEffect(() => {
    if (api === null || container === null || width === null) {
      return;
    }

    container.replaceChildren();
    api.renderButton(container, {
      type: "standard",
      theme: computedMode === "dark" ? "filled_black" : "outline",
      size: "large",
      text,
      shape: "pill",
      logo_alignment: "center",
      width,
    });
    setIsRendered(true);
  }, [api, container, width, computedMode, text]);

  const containerRef = useCallback((element: HTMLDivElement | null) => {
    setContainer(element);
  }, []);

  function resolveStatus(): GoogleIdentityStatus {
    if (clientId === null) {
      return "unconfigured";
    }

    if (loadFailed) {
      return "unavailable";
    }

    return isRendered ? "ready" : "loading";
  }

  return { containerRef, status: resolveStatus() };
}
