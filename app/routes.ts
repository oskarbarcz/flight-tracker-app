import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  layout("routes/auth/AuthLayout.tsx", [
    route("sign-in", "routes/auth/SignInRoute.tsx"),
    route("sign-out", "routes/auth/SignOutRoute.tsx"),
    route("confirm-email", "routes/auth/ConfirmEmailRoute.tsx"),
    route("auth/discord/callback", "routes/auth/DiscordCallbackRoute.tsx"),
  ]),
  layout("routes/public/MapLayout.tsx", [
    route("map", "routes/public/MapIndexRoute.tsx"),
    route("map/:id", "routes/public/MapRoute.tsx"),
  ]),
  index("routes/public/LandingRoute.tsx"),
  layout("routes/AppLayout.tsx", [
    route("dashboard", "routes/common/DashboardRoute.tsx"),
    route("me", "routes/common/MeRoute.tsx"),
    route("me/account", "routes/common/AccountRoute.tsx"),
    layout("routes/pilot/PilotLayout.tsx", [
      route("track/:id", "routes/pilot/track/TrackFlightRoute.tsx"),
      route("rotations", "routes/pilot/rotations/PilotRotationsRoute.tsx"),
      route("rotations/:rotationId", "routes/pilot/rotations/PilotRotationDetailsRoute.tsx"),
      route("stats", "routes/pilot/stats/PilotStatsRoute.tsx"),
      route("flight-history", "routes/pilot/history/FlightHistoryListRoute.tsx"),
      route("flight-history/:id", "routes/pilot/history/FlightHistoryRoute.tsx"),
      route("aircraft-history", "routes/pilot/history/AircraftHistoryListRoute.tsx"),
      route("aircraft-history/:id", "routes/pilot/history/AircraftHistoryDetailsRoute.tsx"),
      route("travels", "routes/pilot/travels/TravelLogRoute.tsx"),
      route("my-postcards", "routes/pilot/postcards/MyPostcardsRoute.tsx"),
      route("airports-library", "routes/pilot/airports/AirportLibraryRoute.tsx"),
      route("airports-library/:id", "routes/pilot/airports/AirportPreviewLayout.tsx", [
        index("routes/pilot/airports/AirportLibraryIndexRoute.tsx"),
        route("runways", "routes/pilot/airports/AirportRunwaysTab.tsx"),
        route("terminals", "routes/pilot/airports/AirportTerminalsTab.tsx"),
        route("parking-positions", "routes/pilot/airports/AirportParkingTab.tsx"),
        route("gates", "routes/pilot/airports/AirportGatesTab.tsx"),
        route("notams", "routes/pilot/airports/AirportNotamsTab.tsx"),
      ]),
    ]),
    layout("routes/operations/OperationsLayout.tsx", [
      route("operators", "routes/operations/operators/ListOperatorsRoute.tsx", [
        route("new", "routes/operations/operators/CreateOperatorRoute.tsx"),
      ]),
      route("operators/:operatorId/edit", "routes/operations/operators/EditOperatorRoute.tsx"),
      layout("routes/operations/operators/OperatorLayout.tsx", [
        route("operators/:operatorId/fleet", "routes/operations/operators/aircraft/OperatorFleetRoute.tsx"),
        route("operators/:operatorId/rotations", "routes/operations/operators/rotations/OperatorRotationsRoute.tsx"),
      ]),
      route("operators/:operatorId/aircraft/add", "routes/operations/operators/aircraft/CreateAircraftRoute.tsx"),
      route(
        "operators/:operatorId/aircraft/:aircraftId",
        "routes/operations/operators/aircraft/AircraftDetailsRoute.tsx",
        [
          index("routes/operations/operators/aircraft/AircraftFlightsTab.tsx"),
          route("seat-layout", "routes/operations/operators/aircraft/AircraftSeatLayoutTab.tsx"),
          route("hold-layout", "routes/operations/operators/aircraft/AircraftHoldLayoutTab.tsx"),
          route("edit", "routes/operations/operators/aircraft/EditAircraftRoute.tsx"),
        ],
      ),
      route(
        "operators/:operatorId/rotations/:rotationId",
        "routes/operations/operators/rotations/RotationDetailsRoute.tsx",
      ),
      route("cabin-layouts", "routes/operations/cabin-layouts/CabinLayoutsListRoute.tsx"),
      route("cabin-layouts/:id", "routes/operations/cabin-layouts/CabinLayoutDetailsRoute.tsx"),
      route("cargo-holds", "routes/operations/cargo-holds/CargoHoldsListRoute.tsx"),
      route("postcards", "routes/operations/postcards/PostcardsRoute.tsx"),
      route("cargo-holds/:type", "routes/operations/cargo-holds/CargoHoldDetailsRoute.tsx"),
      route("flights", "routes/operations/flights/FlightsListRoute.tsx"),
      route("current-flights", "routes/operations/flights/CurrentFlightsRoute.tsx"),
      route("finished-flights", "routes/operations/flights/FinishedFlightsRoute.tsx"),
      route("flights/new", "routes/operations/flights/CreateFlightRoute.tsx"),
      route("delays", "routes/operations/flights/DelaysWorklistRoute.tsx"),
      layout("routes/operations/flights/FlightLayout.tsx", [
        route("flights/:id/overview", "routes/operations/flights/FlightOverviewRoute.tsx"),
        route("flights/:id/timesheet", "routes/operations/flights/FlightTimesheetRoute.tsx"),
        route("flights/:id/loadsheet", "routes/operations/flights/FlightLoadsheetRoute.tsx"),
        route("flights/:id/cargo", "routes/operations/flights/FlightCargoRoute.tsx"),
        route("flights/:id/manifest", "routes/operations/flights/FlightManifestRoute.tsx"),
        route("flights/:id/ofp", "routes/operations/flights/FlightOfpRoute.tsx"),
        route("flights/:id/emergencies", "routes/operations/flights/FlightEmergenciesRoute.tsx"),
        route("flights/:id/delays", "routes/operations/flights/FlightDelaysRoute.tsx"),
      ]),
      route("airports", "routes/operations/airports/AirportsListRoute.tsx", [
        route("new", "routes/operations/airports/CreateAirportRoute.tsx"),
      ]),
      route("airports/:id", "routes/operations/airports/AirportIndexRoute.tsx"),
      route("airports/:id/edit", "routes/operations/airports/EditAirportRoute.tsx"),
      layout("routes/operations/airports/AirportLayout.tsx", [
        route("airports/:id/terminals", "routes/operations/airports/AirportTerminalsRoute.tsx", [
          route("new", "routes/operations/airports/terminals/CreateTerminalRoute.tsx"),
          route(":terminalId/edit", "routes/operations/airports/terminals/EditTerminalRoute.tsx"),
        ]),
        route("airports/:id/parking-positions", "routes/operations/airports/AirportParkingPositionsRoute.tsx", [
          route("new", "routes/operations/airports/parking-positions/CreateParkingPositionRoute.tsx"),
          route(":parkingPositionId/edit", "routes/operations/airports/parking-positions/EditParkingPositionRoute.tsx"),
        ]),
        route("airports/:id/gates", "routes/operations/airports/AirportGatesRoute.tsx", [
          route("new", "routes/operations/airports/gates/CreateGateRoute.tsx"),
          route(":gateId/edit", "routes/operations/airports/gates/EditGateRoute.tsx"),
        ]),
        route("airports/:id/runways", "routes/operations/airports/AirportRunwaysRoute.tsx", [
          route("new", "routes/operations/airports/runways/CreateRunwayRoute.tsx"),
          route(":runwayId/edit", "routes/operations/airports/runways/EditRunwayRoute.tsx"),
        ]),
        route("airports/:id/notams", "routes/operations/airports/AirportNotamsRoute.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
