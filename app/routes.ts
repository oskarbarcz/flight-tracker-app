import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("sign-in", "routes/SignInPage.tsx"),
  route("track/:flightNumber", "routes/FlightTracking.tsx"),
  route("schedule-flight", "routes/ScheduledFlightList.tsx"),
] satisfies RouteConfig;
