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
    index("routes/common/dashboard/DashboardRoute.tsx"),
    ...prefix("track", [
      route(":id", "routes/pilot/track/TrackFlightRoute.tsx"),
    ]),
  ]),
  layout("layout/OldAppLayout.tsx", [
    ...prefix("airports", [
      index("routes/admin/airports/AirportsListRoute.tsx"),
      route("new", "routes/admin/airports/CreateAirportRoute.tsx"),
      route(":id/edit", "routes/admin/airports/EditAirportRoute.tsx"),
    ]),
    ...prefix("aircraft", [
      index("routes/admin/aircraft/AircraftListRoute.tsx"),
      route("new", "routes/admin/aircraft/CreateAircraftRoute.tsx"),
      route(":id/edit", "routes/admin/aircraft/EditAircraftRoute.tsx"),
    ]),
    ...prefix("operators", [
      index("routes/admin/operators/OperatorsListRoute.tsx"),
      route("new", "routes/admin/operators/CreateOperatorRoute.tsx"),
      route(":id/edit", "routes/admin/operators/EditOperatorRoute.tsx"),
    ]),
    ...prefix("rotations", [
      index("routes/admin/rotations/RotationListRoute.tsx"),
      route("new", "routes/admin/rotations/CreateRotationRoute.tsx"),
      route(":id/edit", "routes/admin/rotations/EditRotationRoute.tsx"),
    ]),
    ...prefix("flights", [
      index("routes/admin/flights/FlightsListRoute.tsx"),
      route("new", "routes/admin/flights/CreateFlightRoute.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
