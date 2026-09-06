import { useState } from 'react';
import { PrimaryButton } from '../components/Button.jsx';
import { loginWithEmail } from '../lib/supabaseClient.js';
import Mascot from '../components/Mascot.jsx';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Ingresa un correo válido.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const session = await loginWithEmail(trimmed);
      onLoginSuccess(session);
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, oklch(88% 0.05 235) 0%, oklch(92% 0.03 235) 100%)',
        padding: '58px 32px 40px',
        textAlign: 'center',
      }}
    >
      <div style={{ position: 'absolute', top: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.2)' }} />
      <div style={{ position: 'absolute', bottom: -30, right: -40, width: 130, height: 130, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.15)' }} />
      <Mascot size={96} duration="3.4s" />
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--color-text-strong)', marginTop: 22 }}>
        Ruta de Lectura Implacable
      </div>
      <div style={{ fontSize: 15, color: 'oklch(45% 0.04 250)', marginTop: 8 }}>
        Inicia sesión con tu correo
      </div>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 280, marginTop: 28 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="tu@correo.com"
          className="text-input"
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-locked)',
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 17,
            textAlign: 'center',
            color: 'var(--color-text-strong)',
            background: '#fff',
          }}
        />
        {error && (
          <div style={{ marginTop: 10, fontSize: 13, color: 'oklch(55% 0.14 30)', fontWeight: 700, animation: 'shakeX 0.4s' }}>
            {error}
          </div>
        )}
        <PrimaryButton type="submit" disabled={loading} style={{ marginTop: 20, width: '100%' }}>
          {loading ? 'Entrando…' : 'Iniciar sesión'}
        </PrimaryButton>
      </form>
      <div style={{ marginTop: 40, fontSize: 12, color: 'oklch(55% 0.03 250)' }}>
        ¿Necesitas ayuda? Contáctanos:
        <br />
        <a
          href="mailto:lectoresimplacables@gmail.com"
          style={{ color: 'var(--color-primary-dark)', fontWeight: 700, textDecoration: 'none' }}
        >
          lectoresimplacables@gmail.com
        </a>
      </div>
    </div>
  );
}
