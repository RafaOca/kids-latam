import { useEffect, useState } from 'react';

// Live-ticking "Hh Mmin" / "Mmin Ss" readout counting down to `targetMs` (a
// timestamp, typically tomorrow's local midnight). Shared by the daily
// pacing toast and the locked-day badge so kids see real progress toward
// the unlock instead of a static "come back tomorrow".
export default function Countdown({ targetMs }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const remaining = Math.max(0, targetMs - now);
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return <span>{h > 0 ? `${h}h ${pad(m)}min` : `${m}min ${pad(s)}s`}</span>;
}
