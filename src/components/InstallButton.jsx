import { useEffect, useState } from 'react';
import {
  getPlatform,
  isStandalone,
  hasNativeInstallPrompt,
  onNativeInstallPromptChange,
  triggerNativeInstallPrompt,
} from '../lib/pwa.js';
import { fetchAppSettings } from '../lib/supabaseClient.js';
import { AndroidInstallModal, IosInstallModal } from './InstallModal.jsx';

// Platform-aware "download the app" button. On Android, if Chrome has
// captured a real `beforeinstallprompt` event, tapping fires the native OS
// "Install app?" dialog directly — no extra taps needed. Otherwise (iOS,
// or Android without a captured native prompt) it falls back to one of our
// own instructional modals. Never renders once the app is already running
// installed/standalone.
export default function InstallButton({ style, className = '', children, variant = 'bar' }) {
  const [platform, setPlatform] = useState('other');
  const [standalone, setStandalone] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [nativeAvailable, setNativeAvailable] = useState(false);
  const [gifUrls, setGifUrls] = useState({ androidInstallGifUrl: '', iosInstallGifUrl: '' });

  useEffect(() => {
    setPlatform(getPlatform());
    setStandalone(isStandalone());
    setNativeAvailable(hasNativeInstallPrompt());
    fetchAppSettings().then(setGifUrls).catch(() => {});
    return onNativeInstallPromptChange(setNativeAvailable);
  }, []);

  // Only hidden once already installed — on desktop/other browsers the
  // button stays visible but tapping it does nothing ("Navegador: não abrir").
  if (standalone) return null;

  const isIcon = variant === 'icon';

  const handleClick = async () => {
    if (platform === 'android' && nativeAvailable) {
      const outcome = await triggerNativeInstallPrompt();
      if (outcome === 'accepted') { setStandalone(true); return; }
      if (outcome === null) setModalOpen(true); // no native prompt after all — fall back
      return;
    }
    if (platform !== 'other') setModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`pressable ${className}`}
        aria-label="Descargar la app"
        style={
          isIcon
            ? {
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 'none',
                background: 'var(--color-primary-tint)',
                color: 'var(--color-primary-dark)',
                fontSize: 17,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 8px oklch(20% 0.1 250 / 0.15)',
                ...style,
              }
            : {
                width: '100%',
                padding: 14,
                border: '2px solid var(--color-primary)',
                borderRadius: 'var(--radius-xl)',
                background: '#fff',
                color: 'var(--color-primary-dark)',
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                minHeight: 'var(--touch-target-min)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                ...style,
              }
        }
      >
        {children || (isIcon ? <>⬇️</> : <>⬇️ Descargar la app</>)}
      </button>
      <AndroidInstallModal open={modalOpen && platform === 'android'} onClose={() => setModalOpen(false)} gifUrl={gifUrls.androidInstallGifUrl} />
      <IosInstallModal open={modalOpen && platform === 'ios'} onClose={() => setModalOpen(false)} gifUrl={gifUrls.iosInstallGifUrl} />
    </>
  );
}
