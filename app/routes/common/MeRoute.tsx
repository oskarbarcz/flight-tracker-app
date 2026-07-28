import { FaArrowsSpin, FaMapLocationDot } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { LuPlane, LuTowerControl } from "react-icons/lu";
import { MdHistory, MdOutlineLocalAirport } from "react-icons/md";
import { useAuth } from "~/app-state/useAuth";
import { UserRole } from "~/features/user";
import { MorePage, type MorePageSection } from "~/shared/ui/MorePage/MorePage";

const pilotSections: MorePageSection[] = [
  {
    label: "Library",
    items: [
      { label: "Airports library", href: "/airports-library", icon: MdOutlineLocalAirport },
      { label: "Aircraft library", href: "/aircraft-history", icon: LuPlane },
    ],
  },
  {
    label: "History",
    items: [
      { label: "Operations history", href: "/flight-history", icon: GrDocumentTime },
      { label: "Travel history", href: "/travels", icon: FaMapLocationDot },
      { label: "Rotations history", href: "/rotations", icon: FaArrowsSpin },
    ],
  },
];

const operationsSections: MorePageSection[] = [
  {
    label: "Manage",
    items: [
      { label: "Flight history", href: "/finished-flights", icon: MdHistory },
      { label: "Airports", href: "/airports", icon: LuTowerControl },
      { label: "Operators", href: "/operators", icon: HiOutlineBuildingOffice },
    ],
  },
];

function sectionsForRole(role: UserRole): MorePageSection[] {
  switch (role) {
    case UserRole.Operations:
      return operationsSections;
    case UserRole.CabinCrew:
      return pilotSections;
    case UserRole.Admin:
      return [];
  }
}

export default function MeRoute() {
  const { user } = useAuth();

  if (user === null) {
    return null;
  }

  return <MorePage sections={sectionsForRole(user.role)} />;
}
