import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function getEnvFallback(key: string): string | undefined {
  try {
    const rootDir = process.cwd();
    const paths = [
      path.join(rootDir, ".env.local"),
      path.join(rootDir, ".env")
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf8");
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match && match[1] === key) {
            let val = match[2] || "";
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.slice(1, -1);
            }
            if (val.startsWith("'") && val.endsWith("'")) {
              val = val.slice(1, -1);
            }
            return val.trim();
          }
        }
      }
    }
  } catch (e) {
    console.error("Error reading env fallback:", e);
  }
  return undefined;
}

// Server-only admin client. Uses the service role key, which bypasses RLS and
// can manage auth.users (create/update/delete logins). Never import this
// from a "use client" component or expose SUPABASE_SECRET_KEY to the browser.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eauulodkblfubvolmfiq.supabase.co";
  let serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    serviceKey = getEnvFallback("SUPABASE_SECRET_KEY") || getEnvFallback("SUPABASE_SERVICE_ROLE_KEY");
  }

  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY belum diatur di environment. Tambahkan service role key Supabase untuk bisa membuat/mengelola akun login guru.",
    );
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
