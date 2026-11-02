import type { LatLngTuple } from "leaflet";
import { sphericalSpread } from "~/shared/lib/greatCircle";

export type GlobeCamera = {
  center: [number, number];
  zoom: number;
};

export type GlobeInsets = {
  top: number;
  bottom: number;
};

export type GlobeViewport = {
  width: number;
  height: number;
  insets: GlobeInsets;
  margin: number;
};

const TILE_SIZE = 512;
const CAMERA_DISTANCE_PER_HEIGHT = 1.5;
const MAX_MERCATOR_LATITUDE = 85.051129;
const MIN_ANGULAR_RADIUS = 0.002;

function radiusShowingWholeGlobe(visible: number, cameraDistance: number): number {
  return (visible * (visible + Math.hypot(visible, cameraDistance))) / cameraDistance;
}

function radiusShowingPointAt(angle: number, visible: number, cameraDistance: number): number | null {
  const denominator = cameraDistance * Math.sin(angle) - visible * (1 - Math.cos(angle));

  if (denominator <= 0) {
    return null;
  }

  const radius = (cameraDistance * visible) / denominator;
  const isInFrontOfHorizon = Math.cos(angle) > radius / (cameraDistance + radius);

  return isInFrontOfHorizon ? radius : null;
}

export function globeCamera(points: LatLngTuple[], { width, height, insets, margin }: GlobeViewport): GlobeCamera {
  const spread = sphericalSpread(points);

  if (spread === null) {
    return { center: [0, 0], zoom: 0 };
  }

  const visible = Math.max(Math.min(width, height - insets.top - insets.bottom) / 2 - margin, 1);
  const cameraDistance = CAMERA_DISTANCE_PER_HEIGHT * height;
  const angle = Math.max(spread.angularRadius, MIN_ANGULAR_RADIUS);
  const wholeGlobe = radiusShowingWholeGlobe(visible, cameraDistance);
  const globeRadius = Math.max(wholeGlobe, radiusShowingPointAt(angle, visible, cameraDistance) ?? wholeGlobe);

  const [latitude, longitude] = spread.centre;
  const latitudeScale = Math.cos((Math.min(Math.abs(latitude), MAX_MERCATOR_LATITUDE) * Math.PI) / 180);

  return {
    center: [longitude, latitude],
    zoom: Math.log2((globeRadius * 2 * Math.PI * latitudeScale) / TILE_SIZE),
  };
}

const SMALLEST_GLOBE_HEIGHT_SHARE = 0.85;

export function minimumGlobeZoom(height: number): number {
  const silhouetteRadius = (SMALLEST_GLOBE_HEIGHT_SHARE * height) / 2;
  const globeRadius = radiusShowingWholeGlobe(silhouetteRadius, CAMERA_DISTANCE_PER_HEIGHT * height);

  return Math.log2((globeRadius * 2 * Math.PI) / TILE_SIZE);
}
