import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/common/AuthLayout.tsx", [
    route("sign-in", "routes/common/auth/SignInRoute.tsx"),
    route("sign-out", "routes/common/auth/SignOutRoute.tsx"),
  ]),
  layout("layout/common/AppLayout.tsx", [
    index("routes/common/DashboardRoute.tsx"),
    ...prefix("track", [
      route(":id", "routes/pilot/track/TrackFlightRoute.tsx"),
    ]),
    ...prefix("operators", [
      index("routes/operations/operators/ListOperatorsRoute.tsx"),
      route("new", "routes/operations/operators/CreateOperatorRoute.tsx"),
      route(
        ":operatorId/edit",
        "routes/operations/operators/EditOperatorRoute.tsx",
      ),
      route(
        ":operatorId/aircraft/add",
        "routes/operations/operators/aircraft/CreateAircraftRoute.tsx",
      ),
      route(
        ":operatorId/aircraft/:aircraftId/edit",
        "routes/operations/operators/aircraft/EditAircraftRoute.tsx",
      ),
      route(
        ":operatorId/rotations/new",
        "routes/operations/operators/rotations/CreateRotationRoute.tsx",
      ),
      route(
        ":operatorId/rotations/:rotationId/edit",
        "routes/operations/operators/rotations/EditRotationRoute.tsx",
      ),
    ]),
    ...prefix("operators", [
      layout("routes/operations/operators/OperatorOverviewRoute.tsx", [
        route(
          ":operatorId/rotations",
          "routes/operations/operators/rotations/OperatorRotationsRoute.tsx",
        ),
        route(
          ":operatorId/fleet",
          "routes/operations/operators/aircraft/OperatorFleetRoute.tsx",
        ),
      ]),
    ]),
    ...prefix("airports", [
      index("routes/operations/airports/AirportsListRoute.tsx"),
      route("new", "routes/operations/airports/CreateAirportRoute.tsx"),
      route(":id/edit", "routes/operations/airports/EditAirportRoute.tsx"),
    ]),
    ...prefix("flights", [
      index("routes/operations/flights/FlightsListRoute.tsx"),
      route("new", "routes/operations/flights/CreateFlightRoute.tsx"),
    ]),
  ]),
  layout("layout/common/MapLayout.tsx", [
    ...prefix("live-tracking", [
      route(":id", "routes/public/PublicTrackingRoute.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
