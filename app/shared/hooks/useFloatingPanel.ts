import { type RefObject, type TransitionEvent, useLayoutEffect, useState } from "react";
import { anchorPanel } from "~/shared/lib/modalEntrance";

export function useFloatingPanel(isOpen: boolean, panelRef: RefObject<HTMLElement | null>) {
  const [isRendered, setIsRendered] = useState(isOpen);

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  useLayoutEffect(() => {
    if (isRendered && panelRef.current !== null) {
      anchorPanel(panelRef.current);
    }
  }, [isRendered, panelRef]);

  const onTransitionEnd = ({ target, currentTarget, propertyName }: TransitionEvent<HTMLElement>) => {
    if (!isOpen && target === currentTarget && propertyName === "opacity") {
      setIsRendered(false);
    }
  };

  return { isRendered, panelProps: { "data-closing": isOpen ? undefined : "", onTransitionEnd } };
}
