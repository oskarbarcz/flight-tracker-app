import {
  LuArmchair,
  LuBuilding2,
  LuChartColumn,
  LuContainer,
  LuFileClock,
  LuFileDiff,
  LuHistory,
  LuImage,
  LuImages,
  LuMapPinned,
  LuPlane,
  LuRepeat,
  LuTowerControl,
  LuUser,
} from "react-icons/lu";
import { useAuth } from "~/app-state/useAuth";
import { usePendingChangeRequestCount } from "~/features/change-request/hooks/usePendingChangeRequests";
import { usePostcards } from "~/features/postcard/hooks/usePostcards";
import { UserRole } from "~/features/user";
import { MorePage, type MorePageSection } from "~/shared/ui/MorePage/MorePage";

const settingsSection: MorePageSection = {
  label: "Settings",
  items: [{ label: "Account", href: "/me/account", icon: LuUser }],
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
        { label: "Aircraft history", href: "/aircraft-history", icon: LuPlane },
      ],
    },
    {
      label: "History",
      items: [
        { label: "Statistics", href: "/stats", icon: LuChartColumn },
        { label: "Flight history", href: "/flight-history", icon: LuFileClock },
        { label: "Travel log", href: "/travels", icon: LuMapPinned },
        { label: "Rotations", href: "/rotations", icon: LuRepeat },
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
        { label: "Flight history", href: "/finished-flights", icon: LuHistory },
        { label: "Airports", href: "/airports", icon: LuTowerControl },
        { label: "Cabin layouts", href: "/cabin-layouts", icon: LuArmchair },
        { label: "Cargo holds", href: "/cargo-holds", icon: LuContainer },
        { label: "Postcards", href: "/postcards", icon: LuImage },
        { label: "Operators", href: "/operators", icon: LuBuilding2 },
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
