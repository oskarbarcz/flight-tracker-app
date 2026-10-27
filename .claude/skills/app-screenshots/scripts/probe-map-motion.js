(async () => {
  const durationMs = 7000;
  const findMap = () => {
    const container = document.querySelector(".leaflet-container");
    if (!container) return null;
    const fiberKey = Object.keys(container).find((key) => key.startsWith("__reactFiber"));
    let found = null;
    const walk = (fiber, depth) => {
      if (!fiber || depth > 40 || found) return;
      const value = fiber.memoizedProps?.value;
      if (value?.map?.getCenter) {
        found = value.map;
        return;
      }
      walk(fiber.child, depth + 1);
      walk(fiber.sibling, depth + 1);
    };
    walk(container[fiberKey]?.child, 0);
    return found;
  };

  const start = performance.now();
  const samples = [];
  let last = "";
  while (performance.now() - start < durationMs) {
    const map = findMap();
    const center = map?.getCenter();
    const state = map
      ? `${center.lat.toFixed(3)},${center.lng.toFixed(3)} z${map.getZoom().toFixed(2)} paths=${document.querySelectorAll(".leaflet-overlay-pane path").length}`
      : "no map";
    if (state !== last) {
      samples.push(`${Math.round(performance.now() - start)}ms ${state}`);
      last = state;
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  return samples;
})()
