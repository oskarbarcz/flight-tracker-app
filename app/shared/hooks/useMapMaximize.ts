import { useCallback, useLayoutEffect, useRef, useState } from "react";

const MAXIMIZED_CLASS = "fixed inset-0 z-30 h-auto w-auto bg-gray-100 md:left-72 dark:bg-gray-900";

export function useMapMaximize() {
  const [isMaximized, setIsMaximized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const element = containerRef.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const from = isMaximized
      ? { opacity: 0.5, transform: "scale(0.985)" }
      : { opacity: 0.6, transform: "scale(1.008)" };

    element.animate([from, { opacity: 1, transform: "scale(1)" }], {
      duration: 220,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  }, [isMaximized]);

  const toggle = useCallback(() => setIsMaximized((value) => !value), []);

  return {
    isMaximized,
    toggle,
    containerRef,
    containerClassName: isMaximized ? MAXIMIZED_CLASS : "",
  };
}
