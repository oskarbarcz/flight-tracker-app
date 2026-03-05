import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/common/AuthLayout.tsx", [
    route("sign-in", "routes/common/auth/SignInRoute.tsx"),
    route("sign-out", "routes/common/auth/SignOutRoute.tsx"),
  ]),
  layout("layout/common/MapLayout.tsx", [
    route("live-tracking/:id", "routes/public/PublicTrackingRoute.tsx"),
  ]),
  layout("layout/common/AppLayout.tsx", [
    index("routes/common/DashboardRoute.tsx"),
    route("track/:id", "routes/pilot/track/TrackFlightRoute.tsx"),
    layout("routes/operations/OperationsRoute.tsx", [
      // operations - operators
      route("operators", "routes/operations/operators/ListOperatorsRoute.tsx"),
      route(
        "operators/new",
        "routes/operations/operators/CreateOperatorRoute.tsx",
      ),
      route(
        "operators/:operatorId/edit",
        "routes/operations/operators/EditOperatorRoute.tsx",
      ),
      layout("routes/operations/operators/OperatorOverviewRoute.tsx", [
        route(
          "operators/:operatorId/fleet",
          "routes/operations/operators/aircraft/OperatorFleetRoute.tsx",
        ),
        route(
          "operators/:operatorId/rotations",
          "routes/operations/operators/rotations/OperatorRotationsRoute.tsx",
        ),
      ]),
      route(
        "operators/:operatorId/aircraft/add",
        "routes/operations/operators/aircraft/CreateAircraftRoute.tsx",
      ),
      route(
        "operators/:operatorId/aircraft/:aircraftId/edit",
        "routes/operations/operators/aircraft/EditAircraftRoute.tsx",
      ),
      route(
        "operators/:operatorId/rotations/new",
        "routes/operations/operators/rotations/CreateRotationRoute.tsx",
      ),
      route(
        "operators/:operatorId/rotations/:rotationId/edit",
        "routes/operations/operators/rotations/EditRotationRoute.tsx",
      ),
      // operations - flights
      route("flights", "routes/operations/flights/FlightsListRoute.tsx"),
      route("flights/new", "routes/operations/flights/CreateFlightRoute.tsx"),
      // operations - airports
      route("airports", "routes/operations/airports/AirportsListRoute.tsx"),
      route(
        "airports/new",
        "routes/operations/airports/CreateAirportRoute.tsx",
      ),
      route(
        "airports/:id/edit",
        "routes/operations/airports/EditAirportRoute.tsx",
      ),
    ]),
  ]),
] satisfies RouteConfig;
