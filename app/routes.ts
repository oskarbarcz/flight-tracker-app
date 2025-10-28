import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("layout/AuthLayout.tsx", [
    route("sign-in", "routes/common/auth/SignInRoute.tsx"),
    route("sign-out", "routes/common/auth/SignOutRoute.tsx"),
  ]),
  layout("layout/AppLayout.tsx", [
    index("routes/common/DashboardRoute.tsx"),
    ...prefix("track", [
      route(":id", "routes/pilot/track/TrackFlightRoute.tsx"),
    ]),
    ...prefix("operators", [
      index("routes/operations/operators/OperatorsListRoute.tsx"),
      route("new", "routes/operations/operators/CreateOperatorRoute.tsx"),
      route(":id/edit", "routes/operations/operators/EditOperatorRoute.tsx"),
    ]),
    ...prefix("airports", [
      index("routes/operations/airports/AirportsListRoute.tsx"),
    ]),
    ...prefix("aircraft", [
      index("routes/operations/aircraft/AircraftListRoute.tsx"),
      route("new", "routes/operations/aircraft/CreateAircraftRoute.tsx"),
      route(":id/edit", "routes/operations/aircraft/EditAircraftRoute.tsx"),
    ]),
    ...prefix("rotations", [
      index("routes/operations/rotations/RotationListRoute.tsx"),
      route("new", "routes/operations/rotations/CreateRotationRoute.tsx"),
      route(":id/edit", "routes/operations/rotations/EditRotationRoute.tsx"),
    ]),
    ...prefix("flights", [
      index("routes/operations/flights/FlightsListRoute.tsx"),
      route("new", "routes/operations/flights/CreateFlightRoute.tsx"),
    ]),
  ]),
  layout("layout/FormLayout.tsx", [
    ...prefix("airports", [
      route("new", "routes/operations/airports/CreateAirportRoute.tsx"),
      route(":id/edit", "routes/operations/airports/EditAirportRoute.tsx"),
    ]),
  ]),
  layout("layout/MapLayout.tsx", [
    ...prefix("live-tracking", [
      route(":id", "routes/public/PublicTrackingRoute.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
