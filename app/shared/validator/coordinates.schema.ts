import { array, number, object } from "yup";

export const coordinatesSchema = object({
  latitude: number().required("Latitude is required").min(-90).max(90),
  longitude: number().required("Longitude is required").min(-180).max(180),
})
  .nullable()
  .defined();

export const polygonSchema = array(
  object({
    latitude: number().required().min(-90).max(90),
    longitude: number().required().min(-180).max(180),
  }),
)
  .nullable()
  .defined()
  .test("min-vertices", "Polygon needs at least 3 points", (value) => {
    if (value === null || value === undefined) return true;
    return value.length >= 3;
  });
