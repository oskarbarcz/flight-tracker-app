"use client";

type SidebarSectionTitleProps = {
  label: string;
};

export default function SidebarSectionTitle({
  label,
}: SidebarSectionTitleProps) {
  return (
    <h3 className="mb-2 mt-3 ps-3 text-xs font-bold uppercase text-gray-800 dark:text-gray-200">
      {label}
    </h3>
  );
}
