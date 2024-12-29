import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/HomeRoute.tsx"),
  route("sign-in", "routes/SignInRoute.tsx"),
  route("sign-out", "routes/SignOutRoute.tsx"),
  route("track/:flightId", "routes/TrackFlightRoute.tsx"),
  route("flights", "routes/FlightListRoute.tsx"),
] satisfies RouteConfig;
