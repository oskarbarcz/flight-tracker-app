import { HiOutlineChevronLeft } from "react-icons/hi";
import { useSidebar } from "~/app-state/useSidebar";

export function SidebarTab() {
  const { isCollapsed, toggle } = useSidebar();
  const label = isCollapsed ? "Show menu" : "Hide menu";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-expanded={!isCollapsed}
      title={label}
      className="absolute end-0 top-1/2 z-10 flex h-10 w-5 -translate-y-1/2 translate-x-full cursor-pointer items-center justify-center rounded-e-lg border border-s-0 border-gray-200 bg-white text-gray-500 shadow-sm transition-[color,translate] duration-150 ease-out hover:translate-x-[calc(100%_+_2px)] hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 after:absolute after:-inset-y-1 after:-end-2 after:start-0 after:content-[''] motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-indigo-400"
    >
      <HiOutlineChevronLeft className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[collapsed=true]:rotate-180 group-data-[collapsed=true]:duration-200 motion-reduce:transition-none" />
    </button>
  );
}
