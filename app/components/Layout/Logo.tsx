import logo from "~/assets/logo.svg";

export default function Logo() {
  return (
    <>
      <img
        src={logo}
        className="h-8 mr-2 sm:h-12 sm:mr-3"
        alt="FlightTracker app logo"
      />
      <span className="text-2xl sm:text-4xl font-bold text-indigo-500">
        FlightTracker
      </span>
    </>
  );
}
