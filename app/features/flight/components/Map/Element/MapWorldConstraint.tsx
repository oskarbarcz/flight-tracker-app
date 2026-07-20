import { latLngBounds } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const WORLD_BOUNDS = latLngBounds([-85.0511, -180], [85.0511, 180]);
const TILE_SIZE = 256;

export function MapWorldConstraint() {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(WORLD_BOUNDS);
    map.options.maxBoundsViscosity = 1;

    const clampMinZoom = () => {
      const viewportHeight = map.getSize().y;
      const worldFillingZoom = Math.max(1, Math.ceil(Math.log2(viewportHeight / TILE_SIZE)));
      map.setMinZoom(worldFillingZoom);
    };

    clampMinZoom();
    map.on("resize", clampMinZoom);
    return () => {
      map.off("resize", clampMinZoom);
    };
  }, [map]);

  return null;
}
