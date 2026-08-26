import { useThemeMode } from "flowbite-react";
import type { MaplibreGL } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

const styleUrls = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

export function MapTileLayer() {
  const map = useMap();
  const { computedMode } = useThemeMode();
  const [, refreshOnSystemThemeChange] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => refreshOnSystemThemeChange((tick) => tick + 1);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const styleUrl = styleUrls[computedMode === "dark" ? "dark" : "light"];
  const styleUrlRef = useRef(styleUrl);
  styleUrlRef.current = styleUrl;

  const layerRef = useRef<MaplibreGL | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([import("@maplibre/maplibre-gl-leaflet"), import("maplibre-gl/dist/maplibre-gl.css")]).then(
      ([{ default: maplibreGL }]) => {
        if (cancelled) {
          return;
        }

        const layer = maplibreGL({ style: styleUrlRef.current });
        layer.addTo(map);
        layerRef.current = layer;
      },
    );

    return () => {
      cancelled = true;

      if (layerRef.current !== null) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    layerRef.current?.getMaplibreMap().setStyle(styleUrl);
  }, [styleUrl]);

  return null;
}
