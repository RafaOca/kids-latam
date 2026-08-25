import { createClient } from '@supabase/supabase-js';

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
