import { FaArrowsSpin, FaChartColumn, FaMapLocationDot } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiOutlineBuildingOffice, HiOutlineUser } from "react-icons/hi2";
import { LuArmchair, LuContainer, LuFileDiff, LuImage, LuImages, LuPlane, LuTowerControl } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import { useAuth } from "~/app-state/useAuth";
import { usePendingChangeRequestCount } from "~/features/change-request/hooks/usePendingChangeRequests";
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
        { label: "Airports library", href: "/airports-library", icon: LuTowerControl },
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

function operationsSections(dataChangesWaiting: number): MorePageSection[] {
  return [
    {
      label: "Review",
      items: [{ label: "Data changes", href: "/data-changes", icon: LuFileDiff, badge: dataChangesWaiting }],
    },
    {
      label: "Manage",
      items: [
        { label: "Flight history", href: "/finished-flights", icon: MdHistory },
        { label: "Airports", href: "/airports", icon: LuTowerControl },
        { label: "Cabin layouts", href: "/cabin-layouts", icon: LuArmchair },
        { label: "Cargo holds", href: "/cargo-holds", icon: LuContainer },
        { label: "Postcards", href: "/postcards", icon: LuImage },
        { label: "Operators", href: "/operators", icon: HiOutlineBuildingOffice },
      ],
    },
  ];
}

type WaitingCounts = {
  postcards: number;
  dataChanges: number;
};

function sectionsForRole(role: UserRole, waiting: WaitingCounts): MorePageSection[] {
  switch (role) {
    case UserRole.Operations:
      return operationsSections(waiting.dataChanges);
    case UserRole.CabinCrew:
      return pilotSections(waiting.postcards);
    case UserRole.Admin:
      return [];
  }
}

export default function MeRoute() {
  const { user } = useAuth();
  const { waiting } = usePostcards();
  const dataChangesWaiting = usePendingChangeRequestCount();

  if (user === null) {
    return null;
  }

  const sections = sectionsForRole(user.role, { postcards: waiting.length, dataChanges: dataChangesWaiting });

  return <MorePage sections={[settingsSection, ...sections]} />;
}
