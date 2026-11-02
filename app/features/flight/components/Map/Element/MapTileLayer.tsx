import { useThemeMode } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { TileLayer, useMap } from "react-leaflet";
import { getCartoApiKey } from "~/shared/lib/getCartoApiKey";
import type { VectorBasemap } from "~/shared/lib/leafletVectorBasemap";
import type { BasemapTheme } from "~/shared/lib/versatilesBasemap";

const MAX_ZOOM = 20;

const cartoApiKey = getCartoApiKey();
const apiKeyQuery = cartoApiKey === null ? "" : `?key=${encodeURIComponent(cartoApiKey)}`;

const fallbackTileUrls = {
  light: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${apiKeyQuery}`,
  dark: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${apiKeyQuery}`,
};

function useBasemapTheme(): BasemapTheme {
  const { computedMode } = useThemeMode();
  const [, refreshOnSystemThemeChange] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => refreshOnSystemThemeChange((tick) => tick + 1);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return computedMode === "dark" ? "dark" : "light";
}

export function MapTileLayer() {
  const map = useMap();
  const theme = useBasemapTheme();
  const themeRef = useRef(theme);
  const basemapRef = useRef<VectorBasemap | null>(null);
  const [isVectorUnavailable, setIsVectorUnavailable] = useState(false);

  useEffect(() => {
    if (map.options.maxZoom === undefined) {
      map.setMaxZoom(MAX_ZOOM);
    }
  }, [map]);

  useEffect(() => {
    let cancelled = false;
    let added: VectorBasemap | null = null;
    const createdTheme = themeRef.current;

    import("~/shared/lib/leafletVectorBasemap")
      .then(({ createVectorBasemap }) => createVectorBasemap(createdTheme))
      .then((basemap) => {
        if (cancelled) {
          return;
        }

        added = basemap;
        basemapRef.current = basemap;
        basemap.layer.addTo(map);

        if (themeRef.current !== createdTheme) {
          basemap.setTheme(themeRef.current);
        }
      })
      .catch((error: unknown) => {
        console.error("Cannot show the vector basemap, falling back to raster tiles", error);

        if (!cancelled) {
          setIsVectorUnavailable(true);
        }
      });

    return () => {
      cancelled = true;
      added?.layer.remove();
      basemapRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    themeRef.current = theme;
    basemapRef.current?.setTheme(theme);
  }, [theme]);

  if (!isVectorUnavailable) {
    return null;
  }

  return <TileLayer key={theme} url={fallbackTileUrls[theme]} maxZoom={MAX_ZOOM} />;
}
