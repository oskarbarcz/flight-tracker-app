import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("track", "routes/track-flight.tsx"),
  route("schedule-flight", "routes/scheduled-flight-list.tsx"),
] satisfies RouteConfig;
