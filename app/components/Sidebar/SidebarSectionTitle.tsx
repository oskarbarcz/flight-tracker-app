"use client";

type SidebarSectionTitleProps = {
  label: string;
};

export default function SidebarSectionTitle({
  label,
}: SidebarSectionTitleProps) {
  return (
    <h3 className="mb-4 mt-6 ps-3 text-xs font-bold uppercase text-gray-900">
      {label}
    </h3>
  );
}
