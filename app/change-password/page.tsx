"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, LockKeyhole } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient() as any;

      // 1. Update Supabase Auth User Password
      const { data, error: authError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data?.user) {
        setError("Sesi user tidak ditemukan. Silakan login kembali.");
        return;
      }

      // 2. Update profiles setting must_change_password = false
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", data.user.id);

      if (profileError) {
        console.error("Error updating profile must_change_password", profileError);
        setError("Gagal memperbarui status password di database.");
        return;
      }

      // 3. Clear localStorage cache of old user so page loads the new session
      localStorage.removeItem("ke_user");

      // 4. Force reload to home page to fetch fresh user state from Supabase
      window.location.href = "/";
    } catch (err) {
      setError("Terjadi kesalahan saat memproses perubahan password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-gray-50 p-4 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10 card-3d p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center pb-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 shadow-inner mb-4">
            <LockKeyhole className="size-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-teal-800">Perbarui Password</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Akun Anda ({email}) diwajibkan mengganti password pada saat pertama kali login.
          </p>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-600 font-medium">
            {error}
          </div>
        ) : null}

        <form className="mt-6 flex flex-col gap-4" onSubmit={handlePasswordChange}>
          <div className="grid gap-2">
            <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-gray-600">Password Baru</Label>
            <div className="relative">
              <Input
                autoComplete="new-password"
                id="newPassword"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
                placeholder="Masukkan password baru"
                required
                type={showPassword ? "text" : "password"}
                value={newPassword}
                className="rounded-xl border-gray-200 bg-white h-11 pr-11 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
              >
                {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-gray-600">Konfirmasi Password Baru</Label>
            <Input
              autoComplete="new-password"
              id="confirmPassword"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
              placeholder="Ulangi password baru"
              required
              type="password"
              value={confirmPassword}
              className="rounded-xl border-gray-200 bg-white h-11 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <Button className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-11 shadow-lg transition-all duration-300" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Menyimpan..." : "Simpan & Lanjutkan"}
          </Button>
        </form>
      </div>
    </main>
  );
}
