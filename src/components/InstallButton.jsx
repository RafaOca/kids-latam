import { useEffect, useState } from 'react';
import { getPlatform, isStandalone } from '../lib/pwa.js';
import { fetchAppSettings } from '../lib/supabaseClient.js';
import { AndroidInstallModal, IosInstallModal } from './InstallModal.jsx';

// Platform-aware "download the app" button. Never uses the native
// beforeinstallprompt flow — per spec it always opens one of our own
// instructional modals (or nothing, on desktop), and it never renders at all
// once the app is already running installed/standalone.
export default function InstallButton({ style, className = '', children }) {
  const [platform, setPlatform] = useState('other');
  const [standalone, setStandalone] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [gifUrls, setGifUrls] = useState({ androidInstallGifUrl: '', iosInstallGifUrl: '' });

  useEffect(() => {
    setPlatform(getPlatform());
    setStandalone(isStandalone());
    fetchAppSettings().then(setGifUrls).catch(() => {});
  }, []);

  // Only hidden once already installed — on desktop/other browsers the
  // button stays visible but tapping it does nothing ("Navegador: não abrir").
  if (standalone) return null;

  return (
    <>
      <button
        onClick={() => { if (platform !== 'other') setModalOpen(true); }}
        className={`pressable ${className}`}
        style={{
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
        }}
      >
        {children || <>⬇️ Descargar la app</>}
      </button>
      <AndroidInstallModal open={modalOpen && platform === 'android'} onClose={() => setModalOpen(false)} gifUrl={gifUrls.androidInstallGifUrl} />
      <IosInstallModal open={modalOpen && platform === 'ios'} onClose={() => setModalOpen(false)} gifUrl={gifUrls.iosInstallGifUrl} />
    </>
  );
}
