import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  layout("routes/auth/AuthLayout.tsx", [
    route("sign-in", "routes/auth/SignInRoute.tsx"),
    route("sign-out", "routes/auth/SignOutRoute.tsx"),
  ]),
  layout("routes/public/MapLayout.tsx", [route("map/:id", "routes/public/MapRoute.tsx")]),
  index("routes/public/LandingRoute.tsx"),
  layout("routes/AppLayout.tsx", [
    route("dashboard", "routes/common/DashboardRoute.tsx"),
    layout("routes/pilot/PilotLayout.tsx", [route("track/:id", "routes/pilot/track/TrackFlightRoute.tsx")]),
    layout("routes/operations/OperationsLayout.tsx", [
      // operations - operators
      route("operators", "routes/operations/operators/ListOperatorsRoute.tsx"),
      route("operators/new", "routes/operations/operators/CreateOperatorRoute.tsx"),
      route("operators/:operatorId/edit", "routes/operations/operators/EditOperatorRoute.tsx"),
      layout("routes/operations/operators/OperatorLayout.tsx", [
        route("operators/:operatorId/fleet", "routes/operations/operators/aircraft/OperatorFleetRoute.tsx"),
        route("operators/:operatorId/rotations", "routes/operations/operators/rotations/OperatorRotationsRoute.tsx"),
      ]),
      route("operators/:operatorId/aircraft/add", "routes/operations/operators/aircraft/CreateAircraftRoute.tsx"),
      route(
        "operators/:operatorId/aircraft/:aircraftId/edit",
        "routes/operations/operators/aircraft/EditAircraftRoute.tsx",
      ),
      route("operators/:operatorId/rotations/new", "routes/operations/operators/rotations/CreateRotationRoute.tsx"),
      route(
        "operators/:operatorId/rotations/:rotationId/edit",
        "routes/operations/operators/rotations/EditRotationRoute.tsx",
      ),
      // operations - flights
      route("flights", "routes/operations/flights/FlightsListRoute.tsx"),
      route("flights/new", "routes/operations/flights/CreateFlightRoute.tsx"),
      // operations - airports
      route("airports", "routes/operations/airports/AirportsListRoute.tsx"),
      route("airports/new", "routes/operations/airports/CreateAirportRoute.tsx"),
      route("airports/:id/edit", "routes/operations/airports/EditAirportRoute.tsx"),
      layout("routes/operations/airports/AirportLayout.tsx", [
        route("airports/:id/overview", "routes/operations/airports/AirportOverviewRoute.tsx"),
        route("airports/:id/terminals", "routes/operations/airports/AirportTerminalsRoute.tsx"),
        route("airports/:id/gates", "routes/operations/airports/AirportGatesRoute.tsx"),
        route("airports/:id/runways", "routes/operations/airports/AirportRunwaysRoute.tsx"),
      ]),
      route("airports/:id/runways/new", "routes/operations/airports/runways/CreateRunwayRoute.tsx"),
      route("airports/:id/runways/:runwayId/edit", "routes/operations/airports/runways/EditRunwayRoute.tsx"),
      route("airports/:id/terminals/new", "routes/operations/airports/terminals/CreateTerminalRoute.tsx"),
      route("airports/:id/terminals/:terminalId/edit", "routes/operations/airports/terminals/EditTerminalRoute.tsx"),
      route("airports/:id/gates/new", "routes/operations/airports/gates/CreateGateRoute.tsx"),
      route("airports/:id/gates/:gateId/edit", "routes/operations/airports/gates/EditGateRoute.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
