import { useLayoutEffect, useRef, useState } from "react";

export function useCoveredHeight<Cover extends HTMLElement, Target extends HTMLElement>(enabled: boolean) {
  const coverRef = useRef<Cover>(null);
  const targetRef = useRef<Target>(null);
  const [coveredHeight, setCoveredHeight] = useState(0);

  useLayoutEffect(() => {
    const cover = coverRef.current;
    const target = targetRef.current;

    if (!enabled || !cover || !target) {
      return;
    }

    const measure = () => {
      const overlap = cover.getBoundingClientRect().bottom - target.getBoundingClientRect().top;
      setCoveredHeight(Math.max(0, Math.round(overlap)));
    };
    measure();
    const observer = new ResizeObserver(measure);

    for (const element of [cover, cover.parentElement, target]) {
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [enabled]);

  return { coverRef, targetRef, coveredHeight };
}
