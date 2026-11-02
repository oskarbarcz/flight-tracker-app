import { point } from "leaflet";
import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import type { MapCameraView } from "~/shared/lib/mapCameraView";

type Props = {
  initialView: MapCameraView | null;
  onViewChange: (view: MapCameraView) => void;
  topInset?: number;
};

export function MapViewMemory({ initialView, onViewChange, topInset = 0 }: Props) {
  const map = useMap();
  const restored = useRef(false);
  const restoreView = useRef(initialView);

  useEffect(() => {
    const view = restoreView.current;
    if (restored.current || view === null) return;
    restored.current = true;

    const inset = Math.min(topInset, map.getSize().y / 2);
    const center = map.unproject(map.project(view.center, view.zoom).subtract([0, inset / 2]), view.zoom);
    map.setView(center, view.zoom, { animate: false });
  }, [map, topInset]);

  useMapEvents({
    moveend: () => {
      const size = map.getSize();
      const inset = Math.min(topInset, size.y / 2);
      const visibleCentre = map.containerPointToLatLng(point(size.x / 2, (size.y + inset) / 2));
      onViewChange({ center: [visibleCentre.lat, visibleCentre.lng], zoom: map.getZoom() });
    },
  });

  return null;
}
