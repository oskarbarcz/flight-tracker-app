import { FaArrowsSpin, FaChartColumn, FaMapLocationDot } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiOutlineBuildingOffice, HiOutlineUser } from "react-icons/hi2";
import { LuImages, LuPlane, LuTowerControl } from "react-icons/lu";
import { MdHistory, MdOutlineLocalAirport } from "react-icons/md";
import { useAuth } from "~/app-state/useAuth";
import { usePostcards } from "~/features/postcard/hooks/usePostcards";
import { UserRole } from "~/features/user";
import { MorePage, type MorePageSection } from "~/shared/ui/MorePage/MorePage";

const settingsSection: MorePageSection = {
  label: "Settings",
  items: [{ label: "Account", href: "/me/account", icon: HiOutlineUser }],
};

function pilotSections(postcardsWaiting: number): MorePageSection[] {
  return [
    {
      label: "Collection",
      items: [{ label: "Postcards", href: "/my-postcards", icon: LuImages, badge: postcardsWaiting }],
    },
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
        { label: "Statistics", href: "/stats", icon: FaChartColumn },
        { label: "Operations history", href: "/flight-history", icon: GrDocumentTime },
        { label: "Travel history", href: "/travels", icon: FaMapLocationDot },
        { label: "Rotations history", href: "/rotations", icon: FaArrowsSpin },
      ],
    },
  ];
}

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

function sectionsForRole(role: UserRole, postcardsWaiting: number): MorePageSection[] {
  switch (role) {
    case UserRole.Operations:
      return operationsSections;
    case UserRole.CabinCrew:
      return pilotSections(postcardsWaiting);
    case UserRole.Admin:
      return [];
  }
}

export default function MeRoute() {
  const { user } = useAuth();
  const { waiting } = usePostcards();

  if (user === null) {
    return null;
  }

  return <MorePage sections={[settingsSection, ...sectionsForRole(user.role, waiting.length)]} />;
}
