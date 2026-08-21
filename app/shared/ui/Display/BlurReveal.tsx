import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  expanded: boolean;
  onExpand: () => void;
  onCollapse?: () => void;
  label: string;
  overlayLabel?: string;
  collapseLabel?: string;
  previewHeight?: number;
  contentClassName?: string;
  children: React.ReactNode;
};

const DEFAULT_PREVIEW_HEIGHT = 56;

export function BlurReveal({
  expanded,
  onExpand,
  onCollapse,
  label,
  overlayLabel,
  collapseLabel = "Hide",
  previewHeight = DEFAULT_PREVIEW_HEIGHT,
  contentClassName,
  children,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(previewHeight);

  useEffect(() => {
    const content = contentRef.current;
    if (content === null) {
      return;
    }

    const measure = () => setContentHeight(content.scrollHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-out motion-reduce:transition-none"
        style={{ maxHeight: expanded ? contentHeight : previewHeight }}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div
          ref={contentRef}
          className={twMerge(
            "transition-[filter,opacity] duration-300 motion-reduce:transition-none",
            !expanded && "select-none opacity-55 blur-[3px]",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>

      {!expanded && (
        <button
          type="button"
          onClick={onExpand}
          aria-label={label}
          className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-t from-white via-white/70 to-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:from-gray-900 dark:via-gray-900/70"
        >
          {overlayLabel !== undefined && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              {overlayLabel}
            </span>
          )}
        </button>
      )}

      {expanded && onCollapse !== undefined && (
        <button
          type="button"
          onClick={onCollapse}
          className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-xl py-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-indigo-300 dark:hover:bg-indigo-950"
        >
          {collapseLabel}
        </button>
      )}
    </div>
  );
}
