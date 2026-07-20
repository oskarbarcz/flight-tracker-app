import { FaMapLocationDot } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { LuPlane, LuTowerControl } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import { useAuth } from "~/app-state/useAuth";
import { UserRole } from "~/features/user";
import { MorePage, type MorePageItem } from "~/shared/ui/MorePage/MorePage";

const pilotItems: MorePageItem[] = [
  { label: "Flight history", href: "/flight-history", icon: GrDocumentTime },
  { label: "Aircraft history", href: "/aircraft-history", icon: LuPlane },
  { label: "Travel log", href: "/travels", icon: FaMapLocationDot },
];

const operationsItems: MorePageItem[] = [
  { label: "Flight history", href: "/finished-flights", icon: MdHistory },
  { label: "Airports", href: "/airports", icon: LuTowerControl },
  { label: "Operators", href: "/operators", icon: HiOutlineBuildingOffice },
];

function itemsForRole(role: UserRole): { itemsLabel: string; items: MorePageItem[] } {
  switch (role) {
    case UserRole.Operations:
      return { itemsLabel: "Manage", items: operationsItems };
    case UserRole.CabinCrew:
      return { itemsLabel: "Library", items: pilotItems };
    case UserRole.Admin:
      return { itemsLabel: "", items: [] };
  }
}

export default function MeRoute() {
  const { user } = useAuth();

  if (user === null) {
    return null;
  }

  const { itemsLabel, items } = itemsForRole(user.role);

  return <MorePage itemsLabel={itemsLabel} items={items} />;
}
