import type { GlobeStyle } from "~/shared/lib/globeStyle";

export type BasemapTheme = "light" | "dark";

export type BasemapStyles = Record<BasemapTheme, GlobeStyle>;

const STYLE_FILES: Record<BasemapTheme, string> = {
  light: "map-styles/positrino.json",
  dark: "map-styles/positrino-dark.json",
};

function plainSurface(color: string): GlobeStyle {
  return {
    version: 8,
    sources: {},
    layers: [{ id: "background", type: "background", paint: { "background-color": color } }],
  };
}

export const OFFLINE_BASEMAP_STYLES: BasemapStyles = {
  light: plainSurface("#f2f3f0"),
  dark: plainSurface("#0c0c0c"),
};

let pending: Promise<BasemapStyles | null> | null = null;

async function fetchStyle(theme: BasemapTheme): Promise<GlobeStyle> {
  const response = await fetch(`${import.meta.env.BASE_URL}${STYLE_FILES[theme]}`);

  if (!response.ok) {
    throw new Error(`Basemap style ${STYLE_FILES[theme]} answered ${response.status}`);
  }

  return response.json();
}

async function loadStyles(): Promise<BasemapStyles | null> {
  try {
    const [light, dark] = await Promise.all([fetchStyle("light"), fetchStyle("dark")]);

    return { light, dark };
  } catch (error) {
    console.error("Cannot load the VersaTiles basemap", error);

    return null;
  }
}

export function loadBasemapStyles(): Promise<BasemapStyles | null> {
  pending ??= loadStyles();

  return pending;
}
