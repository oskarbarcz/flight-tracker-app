import { latLngBounds } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const LATITUDE_LIMIT = 85.0511;
const SINGLE_WORLD = 180;
const WRAPPED_WORLDS = 540;
const TILE_SIZE = 256;

type Props = {
  crossAntimeridian?: boolean;
};

function boundsFor(longitudeLimit: number) {
  return latLngBounds([-LATITUDE_LIMIT, -longitudeLimit], [LATITUDE_LIMIT, longitudeLimit]);
}

export function MapWorldConstraint({ crossAntimeridian = false }: Props) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(boundsFor(crossAntimeridian ? WRAPPED_WORLDS : SINGLE_WORLD));
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
  }, [map, crossAntimeridian]);

  return null;
}
