// Platform / install-state detection helpers for the PWA install UX.
// Kept dependency-free (plain UA sniffing) since this only needs to steer
// which instructional modal to show — it never gates real functionality.

export function isIOS() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  // iPadOS 13+ reports as "MacIntel" but exposes touch points, unlike a real Mac.
  const isIpadOS = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) && !window.MSStream || isIpadOS;
}

export function isAndroid() {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent || '');
}

// True when the app is already running installed (standalone), on any
// platform: Android/desktop Chrome via the standard media query, iOS Safari
// via the legacy `navigator.standalone` flag.
export function isStandalone() {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia?.('(display-mode: standalone)').matches;
  const iosStandalone = window.navigator?.standalone === true;
  return !!mq || !!iosStandalone;
}

export function getPlatform() {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  return 'other';
}

// ---- native "Add to Home Screen" prompt capture (Android/Chrome) ----
// Chrome fires `beforeinstallprompt` once early on, then lets the page
// trigger the real OS install dialog later via `.prompt()` — but only if we
// captured the event and called `preventDefault()` on it in time. iOS Safari
// never fires this event (there is no native prompt there), so those users
// always fall back to the instructional modal.
let deferredPrompt = null;
let promptListeners = [];

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    promptListeners.forEach((cb) => cb(true));
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    promptListeners.forEach((cb) => cb(false));
  });
}

export function hasNativeInstallPrompt() {
  return !!deferredPrompt;
}

// Subscribe to changes in native-prompt availability; returns an unsubscribe fn.
export function onNativeInstallPromptChange(cb) {
  promptListeners.push(cb);
  return () => { promptListeners = promptListeners.filter((l) => l !== cb); };
}

// Fires the real OS "Install app?" dialog. Resolves to the browser's choice
// ('accepted' | 'dismissed'), or null if no native prompt was ever captured
// (caller should fall back to the instructional modal in that case).
export async function triggerNativeInstallPrompt() {
  if (!deferredPrompt) return null;
  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  promptEvent.prompt();
  try {
    const choice = await promptEvent.userChoice;
    return choice.outcome;
  } catch {
    return null;
  }
}

// ---- 1-week "remember me" gate for installed-PWA sessions ----
// Supabase's own session/refresh-token already persists indefinitely
// (persistSession + autoRefreshToken), so this doesn't need to touch auth
// config — it just needs a local timestamp, checked at boot only when
// running standalone, so a stolen/expired local flag can't extend a normal
// browser tab's login silently.
const REMEMBER_KEY = 'rli_pwa_remember_until';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function markPwaRemember() {
  if (!isStandalone()) return;
  try {
    localStorage.setItem(REMEMBER_KEY, String(Date.now() + WEEK_MS));
  } catch {
    // ignore (private mode / storage disabled)
  }
}

export function isPwaRememberValid() {
  try {
    const until = Number(localStorage.getItem(REMEMBER_KEY) || 0);
    return until > Date.now();
  } catch {
    return false;
  }
}

export function clearPwaRemember() {
  try {
    localStorage.removeItem(REMEMBER_KEY);
  } catch {
    // ignore
  }
}
