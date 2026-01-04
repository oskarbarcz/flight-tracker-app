declare module "arc" {
  interface ArcOptions {
    offset?: number;
    greatCircle?: boolean;
    name?: string;
  }

  interface ArcGeometry {
    coords: [number, number][];
  }

  interface ArcResult {
    geometries: ArcGeometry[];
  }

  interface ArcCoord {
    x: number;
    y: number;
  }

  class GreatCircle {
    constructor(from: ArcCoord, to: ArcCoord);

    Arc(npoints?: number, options?: ArcOptions): ArcResult;
  }

  export default class Arc {
    static GreatCircle: typeof GreatCircle;
  }
}
