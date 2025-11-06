import logo from "~/assets/logo.svg";
import GitHubButton from "~/components/Map/FullScreen/Element/GitHubButton";
import DiscordButton from "~/components/Map/FullScreen/Element/DiscordButton";
import VerticalSeparator from "~/components/Map/FullScreen/Element/VerticalSeparator";
import ThemeSwitchButton from "~/components/Map/FullScreen/Element/ThemeSwitchButton";
import { FaBars } from "react-icons/fa6";
import { Button } from "flowbite-react";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="mb-2 py-1 px-3 w-full">
      <div className="flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img src={logo} className="h-6 mr-2" alt="FlightTracker app logo" />
          <span className="text-xl font-bold text-indigo-500">
            Flight Tracker
          </span>
        </a>

        <div className="md:hidden">
          <Button color="alternative" size="sm" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitchButton />
          <VerticalSeparator />
          <DiscordButton />
          <GitHubButton />
        </div>
      </div>

      <div
        className={`${
          isMenuOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4"
        } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center gap-3 mt-4">
          <ThemeSwitchButton />
          <VerticalSeparator />
          <DiscordButton />
          <GitHubButton />
        </div>
      </div>
    </nav>
  );
}
