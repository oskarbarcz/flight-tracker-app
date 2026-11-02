import "~/shared/lib/maplibreSetup";
import { useThemeMode } from "flowbite-react";
import type { LatLngTuple } from "leaflet";
import { Map as MapLibreMap, Marker } from "maplibre-gl";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { type GlobeInsets, globeCamera, minimumGlobeZoom } from "~/shared/lib/globeCamera";
import { composeGlobeStyle, type GlobeOverlay } from "~/shared/lib/globeStyle";
import { destinationPoint } from "~/shared/lib/greatCircle";
import { type MapCameraView, toLeafletZoom, toMapLibreZoom } from "~/shared/lib/mapCameraView";
import { loadBasemapStyles, OFFLINE_BASEMAP_STYLES } from "~/shared/lib/versatilesBasemap";

export type GlobeMarker = {
  id: string;
  position: LatLngTuple;
  html: string;
  lift?: number;
  heading?: number;
  upright?: boolean;
  minZoom?: number;
  maxZoom?: number;
  layer?: number;
};

export type GlobeCameraTarget =
  | { key: string; kind: "fit"; points: LatLngTuple[]; maxZoom?: number; glideMs?: number }
  | { key: string; kind: "point"; position: LatLngTuple; zoom?: number; glideMs?: number };

type Props = {
  overlay: GlobeOverlay;
  target: GlobeCameraTarget | null;
  initialTarget?: GlobeCameraTarget | null;
  insets: GlobeInsets;
  markers: GlobeMarker[];
  clickableLayer?: string;
  onFeatureClick?: (properties: Record<string, unknown>) => void;
  onFeatureHover?: (properties: Record<string, unknown> | null) => void;
  onUserPan?: () => void;
  interactive?: boolean;
  initialView?: MapCameraView | null;
  onViewChange?: (view: MapCameraView) => void;
};

type PlacedMarker = {
  marker: Marker;
  spec: GlobeMarker;
};

type CameraState = {
  lastKey: string | null;
  chosenZoom: number | null;
  detached: boolean;
};

const FIT_MARGIN = 32;
const MAX_ZOOM = 14.5;
const GLIDE_MS = 900;
const HEADING_PROBE_RADIANS = 0.0005;
const WHEEL_ZOOM_RATE = 1 / 700;
const TRACKPAD_ZOOM_RATE = 1 / 160;
const PAN_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

function lngLat([latitude, longitude]: LatLngTuple): [number, number] {
  return [longitude, latitude];
}

function limitZoomOut(map: MapLibreMap) {
  map.setMinZoom(minimumGlobeZoom(map.getContainer().clientHeight));
}

function applyTarget(
  map: MapLibreMap,
  target: GlobeCameraTarget,
  insets: GlobeInsets,
  chosenZoom: number | null,
  glide: boolean,
) {
  const padding = { top: insets.top, bottom: target.kind === "fit" ? insets.bottom : 0, left: 0, right: 0 };
  let center: [number, number];
  let zoom: number;

  if (target.kind === "fit") {
    const container = map.getContainer();
    const camera = globeCamera(target.points, {
      width: container.clientWidth,
      height: container.clientHeight,
      insets,
      margin: FIT_MARGIN,
    });
    center = camera.center;
    zoom = chosenZoom ?? Math.min(camera.zoom, target.maxZoom ?? MAX_ZOOM);
  } else {
    center = lngLat(target.position);
    zoom = chosenZoom ?? target.zoom ?? map.getZoom();
  }

  if (glide) {
    map.flyTo({ center, zoom, padding, duration: target.glideMs ?? GLIDE_MS, essential: false });
  } else {
    map.jumpTo({ center, zoom, padding });
  }
}

function screenRotation(map: MapLibreMap, { position, heading, upright }: GlobeMarker): number {
  if (heading === undefined) {
    return 0;
  }

  const from = map.project(lngLat(position));
  const to = map.project(lngLat(destinationPoint(position, heading, HEADING_PROBE_RADIANS)));
  const rotation = (Math.atan2(to.x - from.x, from.y - to.y) * 180) / Math.PI;

  if (!upright) {
    return rotation;
  }

  const alongAxis = rotation - 90;
  if (alongAxis > 90) return alongAxis - 180;
  if (alongAxis <= -90) return alongAxis + 180;
  return alongAxis;
}

function showsAtZoom(spec: GlobeMarker, zoom: number): boolean {
  return (spec.minZoom === undefined || zoom >= spec.minZoom) && (spec.maxZoom === undefined || zoom < spec.maxZoom);
}

function placeMarker(map: MapLibreMap, spec: GlobeMarker): PlacedMarker {
  const element = document.createElement("div");
  element.style.width = "0";
  element.style.height = "0";
  element.style.zIndex = String(spec.layer ?? 0);
  element.style.display = showsAtZoom(spec, map.getZoom()) ? "" : "none";
  element.innerHTML = spec.html;

  const marker = new Marker({
    element,
    anchor: "top-left",
    offset: [0, -(spec.lift ?? 0)],
    rotation: screenRotation(map, spec),
    rotationAlignment: "viewport",
  })
    .setLngLat(lngLat(spec.position))
    .addTo(map);

  return { marker, spec };
}

function updateMarker(map: MapLibreMap, placed: PlacedMarker, spec: GlobeMarker) {
  const element = placed.marker.getElement();
  placed.marker.setLngLat(lngLat(spec.position));
  placed.marker.setOffset([0, -(spec.lift ?? 0)]);
  placed.marker.setRotation(screenRotation(map, spec));
  element.style.zIndex = String(spec.layer ?? 0);
  element.style.display = showsAtZoom(spec, map.getZoom()) ? "" : "none";

  if (placed.spec.html !== spec.html) {
    element.innerHTML = spec.html;
  }

  placed.spec = spec;
}

function refreshMarkers(map: MapLibreMap, placed: Map<string, PlacedMarker>) {
  const zoom = map.getZoom();

  for (const entry of placed.values()) {
    const visible = showsAtZoom(entry.spec, zoom);
    entry.marker.getElement().style.display = visible ? "" : "none";

    if (visible && entry.spec.heading !== undefined) {
      entry.marker.setRotation(screenRotation(map, entry.spec));
    }
  }
}

export function GlobeMap({
  overlay,
  target,
  initialTarget = null,
  insets,
  markers,
  clickableLayer,
  onFeatureClick,
  onFeatureHover,
  onUserPan,
  interactive = true,
  initialView = null,
  onViewChange,
}: Props) {
  const { computedMode } = useThemeMode();
  const basemaps = use(loadBasemapStyles()) ?? OFFLINE_BASEMAP_STYLES;
  const style = useMemo(
    () => composeGlobeStyle(basemaps[computedMode === "dark" ? "dark" : "light"], overlay),
    [basemaps, computedMode, overlay],
  );
  const [initialStyle] = useState(style);
  const [restoredView] = useState(initialView);
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const latest = useRef({ target, initialTarget, insets, onFeatureClick, onFeatureHover, onUserPan, onViewChange });
  const camera = useRef<CameraState>({ lastKey: null, chosenZoom: null, detached: false });
  const placed = useRef(new Map<string, PlacedMarker>());

  useEffect(() => {
    latest.current = { target, initialTarget, insets, onFeatureClick, onFeatureHover, onUserPan, onViewChange };
  }, [target, initialTarget, insets, onFeatureClick, onFeatureHover, onUserPan, onViewChange]);

  useEffect(() => {
    const container = containerRef.current;
    const markersOnMap = placed.current;

    if (container === null) {
      return;
    }

    const instance = new MapLibreMap({
      container,
      style: initialStyle,
      attributionControl: false,
      interactive,
      maxZoom: MAX_ZOOM,
    });

    instance.scrollZoom.setWheelZoomRate(WHEEL_ZOOM_RATE);
    instance.scrollZoom.setZoomRate(TRACKPAD_ZOOM_RATE);

    const reframe = () => {
      const { target: current, insets: currentInsets } = latest.current;
      if (current === null || camera.current.detached) return;
      applyTarget(instance, current, currentInsets, camera.current.chosenZoom, false);
    };

    const leaveTarget = () => {
      const { onUserPan: pan } = latest.current;
      if (pan === undefined) {
        camera.current.detached = true;
      } else {
        pan();
      }
    };

    instance.once("style.load", () => {
      limitZoomOut(instance);
      camera.current.lastKey = latest.current.target?.key ?? null;

      if (restoredView === null) {
        const { target: current, initialTarget: opening, insets: currentInsets } = latest.current;
        if (current === null && opening !== null) {
          applyTarget(instance, opening, currentInsets, null, false);
        } else {
          reframe();
        }
        return;
      }

      const { insets: currentInsets, target: current } = latest.current;
      const zoom = toMapLibreZoom(restoredView.zoom);
      camera.current.chosenZoom = zoom;
      camera.current.detached = current !== null && latest.current.onUserPan === undefined;
      instance.jumpTo({
        center: lngLat(restoredView.center),
        zoom,
        padding: { top: currentInsets.top, bottom: 0, left: 0, right: 0 },
      });
    });
    instance.on("moveend", () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const top = Math.min(latest.current.insets.top, height / 2);
      const centre = instance.unproject([width / 2, (height + top) / 2]);
      latest.current.onViewChange?.({ center: [centre.lat, centre.lng], zoom: toLeafletZoom(instance.getZoom()) });
    });
    instance.on("resize", () => {
      limitZoomOut(instance);
      reframe();
    });
    instance.on("move", () => refreshMarkers(instance, markersOnMap));
    instance.on("dragstart", leaveTarget);
    instance.on("zoomend", (event) => {
      if (event.originalEvent === undefined) return;
      if (latest.current.onUserPan === undefined) {
        camera.current.detached = true;
      } else {
        camera.current.chosenZoom = instance.getZoom();
      }
    });
    container.addEventListener("keydown", (event) => {
      if (PAN_KEYS.has(event.key)) leaveTarget();
    });

    if (clickableLayer !== undefined) {
      instance.on("click", clickableLayer, (event) => {
        latest.current.onFeatureClick?.(event.features?.[0]?.properties ?? {});
      });
      instance.on("mousemove", clickableLayer, (event) => {
        latest.current.onFeatureHover?.(event.features?.[0]?.properties ?? null);
      });
      instance.on("mouseenter", clickableLayer, () => {
        if (latest.current.onFeatureClick !== undefined) {
          instance.getCanvas().style.cursor = "pointer";
        }
      });
      instance.on("mouseleave", clickableLayer, () => {
        instance.getCanvas().style.cursor = "";
        latest.current.onFeatureHover?.(null);
      });
    }

    instance.once("load", () => setMap(instance));

    return () => {
      for (const entry of markersOnMap.values()) {
        entry.marker.remove();
      }
      markersOnMap.clear();
      setMap(null);
      instance.remove();
    };
  }, [initialStyle, restoredView, clickableLayer, interactive]);

  useEffect(() => {
    map?.setStyle(style);
  }, [map, style]);

  useEffect(() => {
    if (map === null || !interactive) return;

    map.scrollZoom.disable();
    if (target !== null && onUserPan !== undefined) {
      map.scrollZoom.enable({ around: "center" });
    } else {
      map.scrollZoom.enable();
    }
  }, [map, interactive, target, onUserPan]);

  useEffect(() => {
    if (map === null || target === null) {
      if (target === null) camera.current.lastKey = null;
      return;
    }

    const state = camera.current;
    const switched = state.lastKey !== target.key;

    if (switched) {
      state.chosenZoom = null;
      state.detached = false;
    }
    if (state.detached) return;

    const glide = state.lastKey !== null && (switched || target.key === "aircraft");
    state.lastKey = target.key;
    applyTarget(map, target, { top: insets.top, bottom: insets.bottom }, state.chosenZoom, glide);
  }, [map, target, insets.top, insets.bottom]);

  useEffect(() => {
    if (map === null) {
      return;
    }

    const current = placed.current;
    const wanted = new Set(markers.map((spec) => spec.id));

    for (const [id, entry] of current) {
      if (!wanted.has(id)) {
        entry.marker.remove();
        current.delete(id);
      }
    }

    for (const spec of markers) {
      const entry = current.get(spec.id);

      if (entry === undefined) {
        current.set(spec.id, placeMarker(map, spec));
      } else {
        updateMarker(map, entry, spec);
      }
    }
  }, [map, markers]);

  return <div ref={containerRef} className="z-0 h-full w-full bg-gray-100 dark:bg-gray-950" />;
}
