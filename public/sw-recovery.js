((serviceWorker) => {
  if (!serviceWorker) {
    return;
  }

  var bootsKey = "mypreflight:recent-boots";
  var reloadWindowMs = 10000;
  var reloadLimit = 4;

  var countRecentBoots = () => {
    try {
      var now = Date.now();
      var boots = JSON.parse(sessionStorage.getItem(bootsKey) || "[]").filter((at) => now - at < reloadWindowMs);
      boots.push(now);
      sessionStorage.setItem(bootsKey, JSON.stringify(boots));
      return boots.length;
    } catch {
      return 0;
    }
  };

  if (countRecentBoots() < reloadLimit) {
    return;
  }

  serviceWorker.getRegistration().then((registration) => {
    if (registration && serviceWorker.controller) {
      registration.unregister().then(() => window.location.reload());
    }
  });
})(navigator.serviceWorker);
