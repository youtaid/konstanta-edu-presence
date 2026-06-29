import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eauulodkblfubvolmfiq.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_VJSEetnjK-Wmco1G0uyhew_IkxRn4_v";
  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};
