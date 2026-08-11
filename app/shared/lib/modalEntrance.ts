const activatorSelector = "button, a[href], [role='button'], summary";

export const MODAL_EXIT_DURATION_MS = 180;

let lastActivatorCenter: { x: number; y: number } | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export async function playModalExit(): Promise<void> {
  const scrim = document.querySelector<HTMLElement>('[role="dialog"]')?.closest<HTMLElement>(".modal-scrim");

  if (!scrim || scrim.dataset.modalClosing !== undefined || prefersReducedMotion()) {
    return;
  }

  scrim.dataset.modalClosing = "";
  await new Promise((resolve) => {
    window.setTimeout(resolve, MODAL_EXIT_DURATION_MS);
  });
}

function rememberPointerActivator(event: PointerEvent): void {
  const target = event.target as Element | null;
  const activator = target?.closest?.(activatorSelector) ?? null;

  if (activator) {
    const rect = activator.getBoundingClientRect();
    lastActivatorCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    return;
  }

  lastActivatorCenter = { x: event.clientX, y: event.clientY };
}

function rememberKeyboardActivator(event: KeyboardEvent): void {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const activator = (document.activeElement as Element | null)?.closest?.(activatorSelector) ?? null;
  if (!activator) {
    return;
  }

  const rect = activator.getBoundingClientRect();
  lastActivatorCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function percentWithin(center: number, start: number, size: number): number {
  if (size <= 0) {
    return 50;
  }

  return Math.min(100, Math.max(0, ((center - start) / size) * 100));
}

function anchorPanel(panel: HTMLElement): void {
  if (!lastActivatorCenter) {
    return;
  }

  const rect = panel.getBoundingClientRect();
  panel.style.setProperty("--modal-origin-x", `${percentWithin(lastActivatorCenter.x, rect.left, rect.width)}%`);
  panel.style.setProperty("--modal-origin-y", `${percentWithin(lastActivatorCenter.y, rect.top, rect.height)}%`);
}

function claimFocus(dialog: HTMLElement, panel: HTMLElement): void {
  dialog.setAttribute("aria-modal", "true");
  panel.tabIndex = -1;
  panel.focus({ preventScroll: true });
}

function openPanelsWithin(node: Node): void {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  const dialogs = node.matches('[role="dialog"]') ? [node] : Array.from(node.querySelectorAll('[role="dialog"]'));

  for (const dialog of dialogs) {
    const panel = dialog.querySelector<HTMLElement>(":scope > .modal-panel");
    if (!(dialog instanceof HTMLElement) || !panel) {
      continue;
    }

    anchorPanel(panel);
    claimFocus(dialog, panel);
  }
}

export function installModalEntrance(): () => void {
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const added of record.addedNodes) {
        openPanelsWithin(added);
      }
    }
  });

  document.addEventListener("pointerdown", rememberPointerActivator, true);
  document.addEventListener("keydown", rememberKeyboardActivator, true);
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    document.removeEventListener("pointerdown", rememberPointerActivator, true);
    document.removeEventListener("keydown", rememberKeyboardActivator, true);
    observer.disconnect();
  };
}
