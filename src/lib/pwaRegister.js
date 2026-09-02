import { registerSW } from 'virtual:pwa-register';

// Update-lifecycle wiring: registers the service worker, exposes a callback
// the UI calls to install a pending update (skipWaiting + reload) instead of
// forcing a full reinstall, and works around iOS Safari's standalone-mode bug
// where a SW that's only ever opened from the home-screen icon rarely checks
// for updates on its own — we force an explicit `update()` check whenever the
// tab/app regains focus, which iOS *does* fire reliably.
export function initPwaUpdates(onUpdateAvailable) {
  let updateSW = () => {};

  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      onUpdateAvailable?.(() => updateSW(true));
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const checkForUpdate = () => registration.update().catch(() => {});
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
      window.addEventListener('focus', checkForUpdate);
      // Also poll periodically while the app stays open/foregrounded.
      setInterval(checkForUpdate, 60 * 60 * 1000);
    },
  });

  return () => updateSW(true);
}
