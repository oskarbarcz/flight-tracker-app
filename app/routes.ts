import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("sign-in", "routes/SignInPage.tsx"),
  route("sign-out", "routes/SignOutPage.tsx"),
  route("track/:flightId", "routes/FlightTracking.tsx"),
  route("flights", "routes/ScheduledFlightList.tsx"),
] satisfies RouteConfig;
