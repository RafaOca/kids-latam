import { useEffect, useState } from 'react';
import { fetchAppSettings, updateAppSettings } from '../lib/supabaseClient.js';

function StatBox({ icon, label, value }) {
  return (
    <div style={{ background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'oklch(45% 0.02 250)', fontWeight: 700, marginTop: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>{value}</div>
    </div>
  );
}

// Admin control for the GIF/image shown inside each platform's install
// instructions modal (see ../components/InstallModal.jsx) — lets the GIF be
// swapped without a code deploy. Lives here because ParentDashboard is
// already the app's only gated "admin-ish" surface (see ../screens/ParentGate.jsx).
function InstallSettingsCard() {
  const [values, setValues] = useState({ androidInstallGifUrl: '', iosInstallGifUrl: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchAppSettings()
      .then((s) => { setValues(s); setLoaded(true); })
      .catch((e) => { console.error('No se pudo cargar la configuración', e); setLoaded(true); });
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateAppSettings(values);
      setSaved(true);
    } catch (e) {
      console.error('No se pudo guardar la configuración', e);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--color-border)',
    fontSize: 13,
    marginTop: 6,
  };

  if (!loaded) return null;

  return (
    <div style={{ marginTop: 26, background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15, color: 'oklch(22% 0.02 250)' }}>
        ⚙️ Instrucciones de instalación (PWA)
      </div>
      <div style={{ fontSize: 12, color: 'oklch(45% 0.02 250)', marginTop: 4 }}>
        URL del GIF/imagen mostrado en cada popup de instalación.
      </div>

      <label style={{ display: 'block', marginTop: 14, fontSize: 12, fontWeight: 700, color: 'oklch(40% 0.02 250)' }}>
        Android
        <input
          type="url"
          value={values.androidInstallGifUrl}
          onChange={(e) => setValues((v) => ({ ...v, androidInstallGifUrl: e.target.value }))}
          placeholder="https://…/android.gif"
          style={inputStyle}
        />
      </label>

      <label style={{ display: 'block', marginTop: 12, fontSize: 12, fontWeight: 700, color: 'oklch(40% 0.02 250)' }}>
        iOS
        <input
          type="url"
          value={values.iosInstallGifUrl}
          onChange={(e) => setValues((v) => ({ ...v, iosInstallGifUrl: e.target.value }))}
          placeholder="https://…/ios.gif"
          style={inputStyle}
        />
      </label>

      <button
        onClick={save}
        disabled={saving}
        className="pressable"
        style={{
          marginTop: 14,
          border: 'none',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-primary)',
          color: '#fff',
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          padding: '10px 18px',
          cursor: 'pointer',
        }}
      >
        {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar'}
      </button>
    </div>
  );
}

export default function ParentDashboard({
  goProfile,
  profileName,
  progressPercent,
  lettersDoneCount,
  syllablesDoneCount,
  wordsDoneCount,
  learningNow,
  masteredList,
  practiceTimeLabel,
  practiceDaysLabel,
}) {
  return (
    <div style={{ padding: '58px 20px 30px', background: '#fff', minHeight: '100%' }}>
      <button
        onClick={goProfile}
        className="pressable"
        style={{ fontSize: 14, color: 'var(--color-primary-dark)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', padding: '8px 0', minHeight: 'var(--touch-target-min)' }}
      >
        ‹ Volver a la app
      </button>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>
        📊 Progreso de {profileName}
      </div>

      <div
        style={{
          marginTop: 20,
          background: 'linear-gradient(135deg, var(--color-primary) 0%, oklch(72% 0.13 205) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 18,
          boxShadow: '0 10px 22px oklch(55% 0.12 235 / 0.25)',
        }}
      >
        <div style={{ fontSize: 13, color: 'oklch(97% 0.01 235)', fontWeight: 700 }}>Progreso general</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 30, color: '#fff', marginTop: 4 }}>{progressPercent}%</div>
        <div style={{ marginTop: 10, height: 10, borderRadius: 8, background: 'oklch(100% 0 0 / 0.25)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#fff', width: `${progressPercent}%` }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
        <StatBox icon="🔤" label="Letras" value={`${lettersDoneCount} / 5`} />
        <StatBox icon="🧩" label="Sílabas" value={`${syllablesDoneCount} / 4`} />
        <StatBox icon="📖" label="Palabras" value={`${wordsDoneCount} / 2`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <div style={{ background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'oklch(45% 0.02 250)', fontWeight: 700 }}>⏱️ Tiempo de práctica</div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>{practiceTimeLabel}</div>
        </div>
        <div style={{ background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'oklch(45% 0.02 250)', fontWeight: 700 }}>📅 Días de práctica</div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>{practiceDaysLabel}</div>
        </div>
      </div>

      <div style={{ marginTop: 22, fontSize: 13, fontWeight: 700, color: 'oklch(45% 0.02 250)' }}>Lo que está aprendiendo</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {learningNow.map((li, i) => (
          <div key={i} style={{ background: 'var(--color-warning-tint)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--color-warning-ink)' }}>
            {li}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, fontSize: 13, fontWeight: 700, color: 'oklch(45% 0.02 250)' }}>Lo que ya domina</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {masteredList.map((mi, i) => (
          <div key={i} style={{ background: 'oklch(90% 0.1 155 / 0.3)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--color-success-ink)' }}>
            ✓ {mi}
          </div>
        ))}
      </div>

      <InstallSettingsCard />
    </div>
  );
}
