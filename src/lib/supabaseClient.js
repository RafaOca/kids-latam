import { createClient } from '@supabase/supabase-js';
import { DEFAULT_ECONOMY } from '../data.js';

export const SUPABASE_URL = 'https://gdjjwhrupmhadnahqslg.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkamp3aHJ1cG1oYWRuYWhxc2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1OTM2MjIsImV4cCI6MjEwMzE2OTYyMn0.lgGsvfMRQ381QDibiDR84xVvAfVaIgCpkeYXaQK_pPE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Calls the "login" Edge Function, which validates the account with the
// shared backend password (accounts are provisioned by the admin only) and
// returns a real Supabase session.
export async function loginWithEmail(email) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error || 'No se pudo iniciar sesión.');
  }

  const { session } = payload;
  const { error } = await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
  if (error) throw error;
  return session;
}

// ---- child profile persistence ----
// Rows in `child_profiles` are scoped by RLS to the logged-in user, so no
// explicit user_id filter is needed on reads.

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    avatarId: row.avatar_id,
    progressIndex: row.progress_index,
    practiceSeconds: row.practice_seconds || 0,
    practiceDays: row.practice_days || [],
    phase1DoneLetters: row.phase1_done_letters || 0,
    economy: row.economy || DEFAULT_ECONOMY,
    reviewState: row.review_state || {},
  };
}

export async function fetchChildProfiles() {
  const { data, error } = await supabase
    .from('child_profiles')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data.map(mapRow);
}

export async function createChildProfile({ name, avatarId }) {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('child_profiles')
    .insert({ name, avatar_id: avatarId, user_id: userData.user.id })
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateChildProfileProgress(id, progressIndex) {
  const { data, error } = await supabase
    .from('child_profiles')
    .update({ progress_index: progressIndex })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateChildProfilePractice(id, { practiceSeconds, practiceDays }) {
  const { data, error } = await supabase
    .from('child_profiles')
    .update({ practice_seconds: practiceSeconds, practice_days: practiceDays })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

// Persists how many Phase 1 letters/sounds the child has unlocked so far.
// The same "add a column + updater" pattern should be followed for future
// stages/phases as they get built, so all progress survives reloads/devices.
export async function updateChildProfilePhase1(id, phase1DoneLetters) {
  const { data, error } = await supabase
    .from('child_profiles')
    .update({ phase1_done_letters: phase1DoneLetters })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

// Persists the whole "Monedas Estrella" economy blob (coin balance, unlocked
// avatars, equipped items, inventory) as one jsonb write — same
// fire-and-forget pattern as progress/practice/phase1 above.
export async function updateChildProfileEconomy(id, economy) {
  const { data, error } = await supabase
    .from('child_profiles')
    .update({ economy })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

// Persists the spaced-repetition review state: per-letter mastery (times
// reviewed, error count, needsReview flag), which curriculum days already
// had their mandatory warm-up completed, and which Checkpoint days are
// done — same fire-and-forget jsonb-write pattern as economy/phase1 above.
export async function updateChildProfileReviewState(id, reviewState) {
  const { data, error } = await supabase
    .from('child_profiles')
    .update({ review_state: reviewState })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

// ---- global app settings (PWA install-instructions GIFs, admin-configurable) ----
// Single row (id='global'). Readable by anyone (even signed-out), writable by
// any authenticated user — see the `app_settings` migration for the RLS
// rationale (this app has no separate admin role; the parent-gate screen is
// the UI trust boundary, same as everywhere else in ParentDashboard).
export async function fetchAppSettings() {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('id', 'global')
    .maybeSingle();
  if (error) throw error;
  return {
    androidInstallGifUrl: data?.android_install_gif_url || '',
    iosInstallGifUrl: data?.ios_install_gif_url || '',
  };
}

export async function updateAppSettings({ androidInstallGifUrl, iosInstallGifUrl }) {
  const { error } = await supabase
    .from('app_settings')
    .update({
      android_install_gif_url: androidInstallGifUrl || null,
      ios_install_gif_url: iosInstallGifUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'global');
  if (error) throw error;
}
