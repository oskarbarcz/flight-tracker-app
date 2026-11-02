import { useLocalStorage } from "~/shared/hooks/useLocalStorage";

export type MapProjection = "mercator" | "globe";

export type MapProjectionKey =
  | "map-projection.route-chart"
  | "map-projection.tracking"
  | "map-projection.history"
  | "map-projection.public-flight"
  | "map-projection.rotation"
  | "map-projection.operations-route";

function isMapProjection(value: unknown): value is MapProjection {
  return value === "mercator" || value === "globe";
}

export function useMapProjection(
  key: MapProjectionKey,
  fallback: MapProjection = "globe",
): [MapProjection, (projection: MapProjection) => void] {
  const [stored, setStored] = useLocalStorage<unknown>(key, fallback);

  return [isMapProjection(stored) ? stored : fallback, setStored];
}
