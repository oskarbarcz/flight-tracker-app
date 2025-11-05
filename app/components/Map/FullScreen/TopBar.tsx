import logo from "~/assets/logo.svg";
import GitHubButton from "~/components/Map/FullScreen/Element/GitHubButton";
import DiscordButton from "~/components/Map/FullScreen/Element/DiscordButton";
import VerticalSeparator from "~/components/Map/FullScreen/Element/VerticalSeparator";
import ThemeSwitchButton from "~/components/Map/FullScreen/Element/ThemeSwitchButton";

export default function TopBar() {
  return (
    <nav className="mb-2 py-2 px-4 w-full flex justify-between">
      <div className="flex items-center">
        <img src={logo} className="h-6 mr-2" alt="FlightTracker app logo" />
        <span className="text-xl font-bold text-indigo-500">
          Flight Tracker
        </span>
      </div>
      <div className="flex items-center gap-3">
        <ThemeSwitchButton />
        <VerticalSeparator />
        <DiscordButton />
        <GitHubButton />
      </div>
    </nav>
  );
}
