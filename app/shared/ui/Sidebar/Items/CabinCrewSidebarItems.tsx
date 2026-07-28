import { FaArrowsSpin, FaMapLocationDot } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiHome } from "react-icons/hi";
import { LuPlane } from "react-icons/lu";
import { MdOutlineLocalAirport } from "react-icons/md";
import { useLocation } from "react-router";
import { usePinnedAirports } from "~/features/airport/lib/usePinnedAirports";
import { CurrentFlightNav } from "~/features/flight/components/Sidebar/CurrentFlightNav";
import { SidebarAirportRow } from "~/shared/ui/Sidebar/Elements/SidebarAirportRow";
import { SidebarElement } from "~/shared/ui/Sidebar/Elements/SidebarElement";
import { SidebarSection } from "~/shared/ui/Sidebar/Elements/SidebarSection";

export function CabinCrewSidebarItems() {
  const path = useLocation().pathname;
  const { pinned } = usePinnedAirports();

  return (
    <nav className="flex flex-col gap-y-5">
      <SidebarSection>
        <SidebarElement label="Home" href="/" isSelected={path === "/" || path === "/dashboard"} icon={HiHome} />
      </SidebarSection>

      <SidebarSection label="Current flight">
        <CurrentFlightNav />
      </SidebarSection>

      <SidebarSection label="Library">
        <SidebarElement
          label="Airports library"
          href="/airports-library"
          isSelected={path === "/airports-library"}
          icon={MdOutlineLocalAirport}
        />
        <SidebarElement
          label="Aircraft library"
          href="/aircraft-history"
          isSelected={path.startsWith("/aircraft-history")}
          icon={LuPlane}
        />
      </SidebarSection>

      <SidebarSection label="History">
        <SidebarElement
          label="Operations history"
          href="/flight-history"
          isSelected={path.startsWith("/flight-history")}
          icon={GrDocumentTime}
        />
        <SidebarElement
          label="Travel history"
          href="/travels"
          isSelected={path.startsWith("/travels")}
          icon={FaMapLocationDot}
        />
        <SidebarElement
          label="Rotations history"
          href="/rotations"
          isSelected={path.startsWith("/rotations")}
          icon={FaArrowsSpin}
        />
      </SidebarSection>

      {pinned.length > 0 && (
        <SidebarSection label="Pinned">
          {pinned.map((airport) => (
            <SidebarAirportRow key={airport.id} id={airport.id} iataCode={airport.iataCode} name={airport.name} />
          ))}
        </SidebarSection>
      )}
    </nav>
  );
}
