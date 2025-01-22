"use client"

type SidebarSectionTitleProps = {
  isCollapsed: boolean;
  label: string;
}

export default function SidebarSectionTitle({isCollapsed, label}: SidebarSectionTitleProps) {
  if (isCollapsed){
    return <span className="w-full block border-b"></span>;
  }

  return (
    <h3 className="mb-4 mt-6 ps-3 text-xs font-bold uppercase text-gray-900">
      {label}
    </h3>
  );
}
