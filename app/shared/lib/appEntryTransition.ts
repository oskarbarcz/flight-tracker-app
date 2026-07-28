const revealDurationMs = 620;
const contentFadeDurationMs = 480;
const entryCleanupDelayMs = revealDurationMs + contentFadeDurationMs + 200;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canAnimateAppEntry(): boolean {
  return "startViewTransition" in document && !prefersReducedMotion();
}

export function markAppEntryOrigin(origin: HTMLElement): void {
  const rect = origin.getBoundingClientRect();
  const root = document.documentElement;

  root.style.setProperty("--app-entry-top", `${rect.top}px`);
  root.style.setProperty("--app-entry-right", `${window.innerWidth - rect.right}px`);
  root.style.setProperty("--app-entry-bottom", `${window.innerHeight - rect.bottom}px`);
  root.style.setProperty("--app-entry-left", `${rect.left}px`);
  root.style.setProperty("--app-entry-radius", window.getComputedStyle(origin).borderTopLeftRadius);
  root.dataset.appEntry = "";

  window.setTimeout(() => {
    delete root.dataset.appEntry;
  }, entryCleanupDelayMs);
}
