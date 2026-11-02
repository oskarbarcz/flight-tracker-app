import { useThemeMode } from "flowbite-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TileLayer, useMap } from "react-leaflet";
import { useMapSettings } from "~/app-state/useMapSettings";
import { firBoundaryOverlay } from "~/features/airspace/lib/firBoundaryOverlay";
import { getCartoApiKey } from "~/shared/lib/getCartoApiKey";
import type { BasemapLook, VectorBasemap } from "~/shared/lib/leafletVectorBasemap";
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

type Props = {
  withAirspace?: boolean;
};

function sameLook(a: BasemapLook, b: BasemapLook): boolean {
  return a.theme === b.theme && a.overlay === b.overlay && a.labels === b.labels;
}

export function MapTileLayer({ withAirspace = false }: Props) {
  const map = useMap();
  const theme = useBasemapTheme();
  const { mapSettings } = useMapSettings();
  const firDisplay = withAirspace ? mapSettings.firDisplay : "hide";
  const overlay = useMemo(() => firBoundaryOverlay(firDisplay, theme), [firDisplay, theme]);
  const labels = firDisplay === "hide";
  const lookRef = useRef<BasemapLook>({ theme, overlay, labels });
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
    const createdLook = lookRef.current;

    import("~/shared/lib/leafletVectorBasemap")
      .then(({ createVectorBasemap }) => createVectorBasemap(createdLook))
      .then((basemap) => {
        if (cancelled) {
          return;
        }

        added = basemap;
        basemapRef.current = basemap;
        basemap.layer.addTo(map);

        if (!sameLook(lookRef.current, createdLook)) {
          basemap.setLook(lookRef.current);
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
    const look = { theme, overlay, labels };
    if (sameLook(lookRef.current, look)) return;
    lookRef.current = look;
    basemapRef.current?.setLook(look);
  }, [theme, overlay, labels]);

  if (!isVectorUnavailable) {
    return null;
  }

  return <TileLayer key={theme} url={fallbackTileUrls[theme]} maxZoom={MAX_ZOOM} />;
}
