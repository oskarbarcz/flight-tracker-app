import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(() => map.invalidateSize());
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}
