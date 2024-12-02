import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("track", "routes/track-flight.tsx"),
] satisfies RouteConfig;
