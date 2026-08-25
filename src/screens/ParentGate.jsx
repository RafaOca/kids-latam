export default function ParentGate({ goProfile, mathA, mathB, mathInput, setMathInput, mathError, checkParentGate }) {
  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        padding: '58px 32px 40px',
        textAlign: 'center',
      }}
    >
      <button
        onClick={goProfile}
        className="pressable"
        style={{ alignSelf: 'flex-start', width: 44, height: 44, borderRadius: '50%', background: 'oklch(97% 0.008 250)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer' }}
      >
        ←
      </button>
      <div style={{ fontSize: 14, color: 'oklch(50% 0.02 250)', fontWeight: 700, marginTop: 20 }}>
        Verificación para adultos
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 30, color: 'oklch(22% 0.02 250)', marginTop: 10 }}>
        ¿Cuánto es {mathA} + {mathB}?
      </div>
      <input
        value={mathInput}
        onChange={(e) => setMathInput(e.target.value)}
        type="number"
        placeholder="?"
        className="text-input"
        style={{ marginTop: 26, width: 140, padding: 16, borderRadius: 'var(--radius-md)', border: '2px solid oklch(89% 0.01 250)', fontFamily: "'Fredoka', sans-serif", fontSize: 26, textAlign: 'center' }}
      />
      {mathError && (
        <div style={{ marginTop: 12, fontSize: 13, color: 'oklch(55% 0.14 30)', fontWeight: 700, animation: 'shakeX 0.4s' }}>
          Respuesta incorrecta. Inténtalo de nuevo.
        </div>
      )}
      <button
        onClick={checkParentGate}
        className="pressable"
        style={{ marginTop: 26, width: '100%', maxWidth: 240, padding: 18, border: 'none', borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-dark)', color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, cursor: 'pointer', minHeight: 'var(--touch-target-min)' }}
      >
        Entrar
      </button>
    </div>
  );
}
