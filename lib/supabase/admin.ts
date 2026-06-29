import { createClient } from "@supabase/supabase-js";

// Server-only admin client. Uses the service role key, which bypasses RLS and
// can manage auth.users (create/update/delete logins). Never import this
// from a "use client" component or expose SUPABASE_SECRET_KEY to the browser.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eauulodkblfubvolmfiq.supabase.co";
  const serviceKey = process.env.SUPABASE_SECRET_KEY;

  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY belum diatur di environment. Tambahkan service role key Supabase untuk bisa membuat/mengelola akun login guru.",
    );
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
