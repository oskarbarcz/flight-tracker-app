const SUPPRESS_TRANSITIONS = "*:not([data-icon-swap] > *),*::before,*::after{transition:none !important}";

export function withoutTransitions(change: () => void): void {
  const style = document.createElement("style");
  style.append(document.createTextNode(SUPPRESS_TRANSITIONS));
  document.head.append(style);

  change();
  void document.body.offsetHeight;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => style.remove());
  });
}
