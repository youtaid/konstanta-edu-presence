import "server-only";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_PROJECT_URL = "https://eauulodkblfubvolmfiq.supabase.co";

// Server-only admin client. Uses a secret key, which bypasses RLS and
// can manage auth.users (create/update/delete logins). Never import this
// from a "use client" component or expose SUPABASE_SECRET_KEY to the browser.
export function createAdminClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    SUPABASE_PROJECT_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "Konfigurasi server Supabase belum lengkap (SUPABASE_SECRET_KEY). Hubungi administrator aplikasi.",
    );
  }

  return createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
