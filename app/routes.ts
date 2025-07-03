import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("layout/AuthLayout.tsx", [
    route("sign-in", "routes/auth/SignInRoute.tsx"),
    route("sign-out", "routes/auth/SignOutRoute.tsx"),
  ]),
  layout("layout/AppLayout.tsx", [
    index("routes/dashboard/DashboardRoute.tsx"),
    ...prefix("airports", [
      index("routes/airports/AirportsListRoute.tsx"),
      route("new", "routes/airports/CreateAirportRoute.tsx"),
      route(":id/edit", "routes/airports/EditAirportRoute.tsx"),
    ]),
    ...prefix("track", [route(":id", "routes/track/TrackFlightRoute.tsx")]),
    ...prefix("aircraft", [
      index("routes/aircraft/AircraftListRoute.tsx"),
      route("new", "routes/aircraft/CreateAircraftRoute.tsx"),
      route(":id/edit", "routes/aircraft/EditAircraftRoute.tsx"),
    ]),
    ...prefix("operators", [
      index("routes/operators/OperatorsListRoute.tsx"),
      route("new", "routes/operators/CreateOperatorRoute.tsx"),
      route(":id/edit", "routes/operators/EditOperatorRoute.tsx"),
    ]),
    ...prefix("rotations", [
      index("routes/rotations/RotationListRoute.tsx"),
      route("new", "routes/rotations/CreateRotationRoute.tsx"),
      route(":id/edit", "routes/rotations/EditRotationRoute.tsx"),
    ]),
    ...prefix("flights", [
      index("routes/flights/FlightsListRoute.tsx"),
      route("new", "routes/flights/CreateFlightRoute.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
