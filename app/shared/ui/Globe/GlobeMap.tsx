import "~/shared/lib/maplibreSetup";
import { useThemeMode } from "flowbite-react";
import type { LatLngTuple } from "leaflet";
import { Map as MapLibreMap, Marker } from "maplibre-gl";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { type GlobeInsets, globeCamera, minimumGlobeZoom } from "~/shared/lib/globeCamera";
import { type ScreenShape, separatePolarShapes } from "~/shared/lib/globePolar";
import { composeGlobeStyle, type GlobeOverlay } from "~/shared/lib/globeStyle";
import { destinationPoint } from "~/shared/lib/greatCircle";
import { type MapCameraView, toLeafletZoom, toMapLibreZoom } from "~/shared/lib/mapCameraView";
import type { MapFocus } from "~/shared/lib/mapFocus";
import { loadBasemapStyles, OFFLINE_BASEMAP_STYLES } from "~/shared/lib/versatilesBasemap";
import { TRACKPAD_ZOOM_RATE, WHEEL_ZOOM_RATE } from "~/shared/lib/wheelZoom";
import { facesCamera, type Projector, screenPathData } from "~/shared/ui/Globe/screenProjection";

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
  onClick?: () => void;
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
  isFeatureClickable?: (properties: Record<string, unknown>) => boolean;
  onFeatureHover?: (properties: Record<string, unknown> | null) => void;
  onUserPan?: () => void;
  interactive?: boolean;
  initialView?: MapCameraView | null;
  onViewChange?: (view: MapCameraView) => void;
  focus?: MapFocus | null;
  basemapLabels?: boolean;
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
const PAN_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

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

function createScreenLayer(map: MapLibreMap): SVGSVGElement {
  const layer = document.createElementNS(SVG_NAMESPACE, "svg");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "absolute";
  layer.style.inset = "0";
  layer.style.width = "100%";
  layer.style.height = "100%";
  layer.style.pointerEvents = "none";
  map.getCanvas().after(layer);

  return layer;
}

type ScreenElement = SVGPathElement | SVGCircleElement;

function createShapeElement(shape: ScreenShape): ScreenElement {
  if (shape.kind === "line") {
    const path = document.createElementNS(SVG_NAMESPACE, "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", shape.color);
    path.setAttribute("stroke-width", String(shape.width));
    path.setAttribute("stroke-opacity", String(shape.opacity));
    path.setAttribute("stroke-linecap", shape.cap);
    path.setAttribute("stroke-linejoin", shape.join);
    if (shape.dash !== null) path.setAttribute("stroke-dasharray", shape.dash);
    path.dataset.layer = shape.layer;
    return path;
  }

  const circle = document.createElementNS(SVG_NAMESPACE, "circle");
  circle.setAttribute("r", String(shape.radius));
  circle.setAttribute("fill", shape.fill);
  circle.setAttribute("fill-opacity", String(shape.fillOpacity));
  circle.setAttribute("stroke", shape.stroke);
  circle.setAttribute("stroke-width", String(shape.strokeWidth));
  circle.setAttribute("stroke-opacity", String(shape.strokeOpacity));
  circle.dataset.layer = shape.layer;
  return circle;
}

function drawScreenShapes(map: MapLibreMap, elements: Map<string, ScreenElement>, shapes: ScreenShape[]) {
  const project: Projector = (position) => map.project(lngLat(position));

  for (const shape of shapes) {
    const element = elements.get(shape.id);
    if (element === undefined) continue;

    if (shape.kind === "line") {
      element.setAttribute("d", screenPathData(shape.path, project));
      continue;
    }

    const point = project(shape.position);
    const visible = facesCamera(project, shape.position, point);
    element.setAttribute("cx", point.x.toFixed(1));
    element.setAttribute("cy", point.y.toFixed(1));
    element.style.visibility = visible ? "" : "hidden";
  }
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

function clickedMarkerAction(placed: Map<string, PlacedMarker>, target: EventTarget | null): (() => void) | undefined {
  if (!(target instanceof Node)) {
    return undefined;
  }

  for (const { marker, spec } of placed.values()) {
    if (marker.getElement().contains(target)) {
      return spec.onClick;
    }
  }

  return undefined;
}

export function GlobeMap({
  overlay,
  target,
  initialTarget = null,
  insets,
  markers,
  clickableLayer,
  onFeatureClick,
  isFeatureClickable,
  onFeatureHover,
  onUserPan,
  interactive = true,
  initialView = null,
  onViewChange,
  focus = null,
  basemapLabels = true,
}: Props) {
  const { computedMode } = useThemeMode();
  const basemaps = use(loadBasemapStyles()) ?? OFFLINE_BASEMAP_STYLES;
  const separated = useMemo(() => separatePolarShapes(overlay), [overlay]);
  const screenShapes = separated.shapes;
  const style = useMemo(
    () =>
      composeGlobeStyle(basemaps[computedMode === "dark" ? "dark" : "light"], separated.overlay, {
        labels: basemapLabels,
      }),
    [basemaps, computedMode, separated, basemapLabels],
  );
  const [initialStyle] = useState(style);
  const [restoredView] = useState(initialView);
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const latest = useRef({
    target,
    initialTarget,
    insets,
    screenShapes,
    onFeatureClick,
    isFeatureClickable,
    onFeatureHover,
    onUserPan,
    onViewChange,
  });
  const camera = useRef<CameraState>({ lastKey: null, chosenZoom: null, detached: false });
  const placed = useRef(new Map<string, PlacedMarker>());
  const screenLayer = useRef<SVGSVGElement | null>(null);
  const screenElements = useRef(new Map<string, ScreenElement>());
  const handledFocus = useRef(focus);

  useEffect(() => {
    latest.current = {
      target,
      initialTarget,
      insets,
      screenShapes,
      onFeatureClick,
      isFeatureClickable,
      onFeatureHover,
      onUserPan,
      onViewChange,
    };
  }, [
    target,
    initialTarget,
    insets,
    screenShapes,
    onFeatureClick,
    isFeatureClickable,
    onFeatureHover,
    onUserPan,
    onViewChange,
  ]);

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

    const shapeElements = screenElements.current;
    const shapeLayer = createScreenLayer(instance);
    screenLayer.current = shapeLayer;

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
    instance.on("render", () => drawScreenShapes(instance, shapeElements, latest.current.screenShapes));
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

    instance.on("click", (event) => {
      clickedMarkerAction(markersOnMap, event.originalEvent.target)?.();
    });

    if (clickableLayer !== undefined) {
      instance.on("click", clickableLayer, (event) => {
        if (clickedMarkerAction(markersOnMap, event.originalEvent.target) !== undefined) return;
        latest.current.onFeatureClick?.(event.features?.[0]?.properties ?? {});
      });
      instance.on("mousemove", clickableLayer, (event) => {
        const properties = event.features?.[0]?.properties ?? {};
        const { onFeatureClick: click, isFeatureClickable: canClick, onFeatureHover: hover } = latest.current;
        const clickable = click !== undefined && (canClick?.(properties) ?? true);
        instance.getCanvas().style.cursor = clickable ? "pointer" : "";
        hover?.(properties);
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
      shapeLayer.remove();
      shapeElements.clear();
      screenLayer.current = null;
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
    if (map === null || focus === null || focus === handledFocus.current) {
      return;
    }

    handledFocus.current = focus;

    const { position, zoom, insets: free } = focus;

    map.flyTo({
      center: lngLat(position),
      zoom: Math.max(map.getZoom(), zoom === null ? 0 : toMapLibreZoom(zoom)),
      padding: { top: free.top, right: free.right, bottom: free.bottom, left: 0 },
      duration: GLIDE_MS,
      essential: false,
    });
  }, [map, focus]);

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

  useEffect(() => {
    const layer = screenLayer.current;
    if (map === null || layer === null) {
      return;
    }

    const elements = screenElements.current;
    elements.clear();

    const created = screenShapes.map((shape) => {
      const element = createShapeElement(shape);
      elements.set(shape.id, element);

      if (shape.kind === "point" && shape.layer === clickableLayer) {
        element.style.pointerEvents = "all";
        element.addEventListener("mousemove", () => {
          const { onFeatureClick: click, isFeatureClickable: canClick, onFeatureHover: hover } = latest.current;
          const clickable = click !== undefined && (canClick?.(shape.properties) ?? true);
          element.style.cursor = clickable ? "pointer" : "";
          hover?.(shape.properties);
        });
        element.addEventListener("mouseleave", () => latest.current.onFeatureHover?.(null));
        element.addEventListener("click", () => latest.current.onFeatureClick?.(shape.properties));
      }

      return element;
    });

    layer.replaceChildren(...created);
    drawScreenShapes(map, elements, screenShapes);
  }, [map, screenShapes, clickableLayer]);

  return <div ref={containerRef} className="z-0 h-full w-full bg-gray-100 dark:bg-gray-950" />;
}
