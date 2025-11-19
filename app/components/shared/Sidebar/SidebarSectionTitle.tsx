"use client";

type SidebarSectionTitleProps = {
  label: string;
};

export default function SidebarSectionTitle({
  label,
}: SidebarSectionTitleProps) {
  return (
    <h3 className="mt-6 mb-3 ps-3 text-xs font-bold uppercase text-gray-800 dark:text-gray-200">
      {label}
    </h3>
  );
}
