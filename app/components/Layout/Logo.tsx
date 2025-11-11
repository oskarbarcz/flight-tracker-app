import logo from "~/assets/logo.svg";

export default function Logo() {
  return (
    <>
      <img
        src={logo}
        className="h-6 mr-1 sm:h-9 sm:mr-2"
        alt="Flight Tracker app logo"
      />
      <span className="text-xl sm:text-3xl font-bold text-indigo-500">
        Flight Tracker
      </span>
    </>
  );
}
