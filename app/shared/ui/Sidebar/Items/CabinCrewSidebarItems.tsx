import { FaMapLocationDot } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiHome } from "react-icons/hi";
import { LuPlane } from "react-icons/lu";
import { MdOutlineLocalAirport } from "react-icons/md";
import { Link, useLocation } from "react-router";
import { usePinnedAirports } from "~/features/airport/lib/usePinnedAirports";
import { SidebarElement } from "~/shared/ui/Sidebar/Elements/SidebarElement";

export function CabinCrewSidebarItems() {
  const path = useLocation().pathname;
  const { pinned } = usePinnedAirports();

  return (
    <nav className="flex flex-col gap-y-1">
      <SidebarElement label="Home" href="/" isSelected={path === "/"} icon={HiHome} />
      <SidebarElement
        label="Flight history"
        href="/flight-history"
        isSelected={path.startsWith("/flight-history")}
        icon={GrDocumentTime}
      />
      <SidebarElement
        label="Aircraft history"
        href="/aircraft-history"
        isSelected={path.startsWith("/aircraft-history")}
        icon={LuPlane}
      />
      <SidebarElement
        label="Travel log"
        href="/travels"
        isSelected={path.startsWith("/travels")}
        icon={FaMapLocationDot}
      />
      <SidebarElement
        label="Airports"
        href="/airports-library"
        isSelected={path.startsWith("/airports-library")}
        icon={MdOutlineLocalAirport}
      />
      {pinned.length > 0 && (
        <div className="ml-4 flex flex-col gap-0.5 border-l border-gray-200 pl-2 dark:border-gray-800">
          {pinned.map((airport) => {
            const isActive = path.startsWith(`/airports-library/${airport.id}`);
            return (
              <Link
                key={airport.id}
                to={`/airports-library/${airport.id}`}
                replace
                viewTransition
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600 dark:bg-gray-800 dark:text-white"
                    : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <span className="font-mono font-semibold">{airport.iataCode}</span>
                <span className="truncate">{airport.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
