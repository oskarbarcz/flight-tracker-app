import logo from "~/assets/logo.svg";

export default function TopBar() {
  return (
    <div className="mb-2 py-2 px-4 w-full flex items-center">
      <img src={logo} className="h-6 mr-2" alt="FlightTracker app logo" />
      <span className="text-xl font-bold text-indigo-500">Flight Tracker</span>
    </div>
  );
}
