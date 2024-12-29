import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/HomeRoute.tsx"),
  route("sign-in", "routes/SignInRoute.tsx"),
  route("sign-out", "routes/SignOutRoute.tsx"),
  route("track/:flightId", "routes/TrackFlightRoute.tsx"),
  route("flights", "routes/FlightListRoute.tsx"),
  layout("routes/layout/AppLayout.tsx", [
    ...prefix("airports", [
      index("routes/airports/AirportsListRoute.tsx"),
      // route(":id", "routes/airports/AirportsListRoute.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
