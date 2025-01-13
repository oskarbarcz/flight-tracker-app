import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  route("track/:flightId", "routes/TrackFlightRoute.tsx"),
  layout("routes/auth/AuthLayout.tsx", [
    route("sign-in", "routes/auth/SignInRoute.tsx"),
    route("sign-out", "routes/auth/SignOutRoute.tsx"),
  ]),
  layout("routes/AppLayout.tsx", [
    index("routes/dashboard/DashboardRoute.tsx"),
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
    ...prefix("operators", [
      index("routes/operators/OperatorsListRoute.tsx"),
      route("new", "routes/operators/CreateOperatorRoute.tsx"),
      route(":id/edit", "routes/operators/EditOperatorRoute.tsx"),
    ]),
    ...prefix("flights", [index("routes/flights/FlightsListRoute.tsx")]),
  ]),
] satisfies RouteConfig;
