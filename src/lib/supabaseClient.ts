import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabaseConfigError = isSupabaseConfigured
  ? null
  : 'Supabase URL과 publishable key가 설정되지 않았습니다.';

function createSupabaseClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });
}

export const supabase = createSupabaseClient();
