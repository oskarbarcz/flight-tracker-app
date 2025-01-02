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
      route("new", "routes/airports/CreateAirportRoute.tsx"),
      route(":id/edit", "routes/airports/EditAirportRoute.tsx"),
    ]),
    ...prefix("aircraft", [
      index("routes/aircraft/AircraftListRoute.tsx"),
      route("new", "routes/aircraft/CreateAircraftRoute.tsx"),
      route(":id/edit", "routes/aircraft/EditAircraftRoute.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
