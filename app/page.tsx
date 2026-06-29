"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminDashboard from "@/components/dashboards/admin";
import AcademicDashboard from "@/components/dashboards/academic";
import TeacherDashboard from "@/components/dashboards/teacher";
import { 
  LogOut, 
  Eye, 
  EyeOff, 
  LockKeyhole, 
  Mail, 
  Shield, 
  GraduationCap, 
  Users, 
  School,
  Sparkles
} from "lucide-react";



function KaryawanDashboard({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-white/60 shadow-[0_24px_50px_-12px_rgba(13,148,136,0.08)] backdrop-blur-xl">
      <div className="max-w-md mx-auto text-center py-6">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-teal-100">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Halo, {user.name}!</h2>
        <p className="text-sm text-gray-500 mt-2">Anda telah masuk dengan peran <b>Karyawan</b>.</p>
        
        <div className="mt-8 p-5 bg-teal-50/50 border border-teal-100/70 rounded-2xl text-teal-800 text-sm leading-relaxed shadow-sm">
          Menu operasional dan pembagian tugas harian staf karyawan sedang dikonfigurasi oleh tim sistem. Silakan berkoordinasi dengan bagian Akademik atau Admin untuk instruksi kerja harian Anda.
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, login, logout } = useAuth();
  
  // Real login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<'admin' | 'akademik' | 'ketetap' | 'kangguru' | 'karyawan'>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);



  async function handleRealLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient() as any;
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === "Invalid login credentials" ? "Email atau password salah." : authError.message);
        setIsSubmitting(false);
        return;
      }

      const userUid = data.user?.id;
      if (!userUid) {
        setError("Sesi gagal dibuat. Hubungi admin.");
        setIsSubmitting(false);
        return;
      }

      // Check role mapping
      const userRoles: string[] = data.user.app_metadata?.roles || [];
      const primaryRole: string = data.user.app_metadata?.role || "";
      const hasRole = userRoles.includes(selectedRole) || primaryRole === selectedRole;

      if (!hasRole) {
        await supabase.auth.signOut();
        setError(`Akun Anda tidak memiliki peran sebagai ${selectedRole.toUpperCase()}. Silakan pilih peran yang sesuai.`);
        setIsSubmitting(false);
        return;
      }

      // Check must_change_password from public profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userUid)
        .single();

      if (profileError || !profile) {
        console.error("Error checking profile", profileError);
        setError("Profil Anda tidak ditemukan di database. Pastikan tabel 'profiles' di Supabase sudah dibuat dan di-seed.");
        setIsSubmitting(false);
        return;
      }

      if (profile.must_change_password) {
        window.location.href = `/change-password?email=${encodeURIComponent(email)}`;
        return;
      }

      // Logged in successfully! Update the AuthProvider state
      let roleMapped: 'ADMIN' | 'ACADEMIC' | 'TEACHER' | 'KARYAWAN' = 'KARYAWAN';
      if (profile.role === 'admin') roleMapped = 'ADMIN';
      else if (profile.role === 'akademik') roleMapped = 'ACADEMIC';
      else if (profile.role === 'ketetap' || profile.role === 'kangguru') roleMapped = 'TEACHER';

      const mappedUser: User = {
        id: profile.id,
        name: profile.full_name,
        email: email,
        role: roleMapped,
      };

      if (profile.role === 'ketetap') {
        mappedUser.teacherType = 'TETAP';
        mappedUser.teacherId = 'T_' + profile.id.slice(0, 8);
        mappedUser.baseSalary = 3500000;
        mappedUser.transportAllowance = 500000;
        mappedUser.otherAllowance = 200000;
        mappedUser.bpjsKetenagakerjaan = 70000;
        mappedUser.bpjsKesehatan = 35000;
      } else if (profile.role === 'kangguru') {
        mappedUser.teacherType = 'FREELANCE';
        mappedUser.teacherId = 'T_' + profile.id.slice(0, 8);
      }

      login(mappedUser);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen relative flex items-center justify-center bg-gray-50 p-4 overflow-hidden">
        {/* Background Decorative Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-teal-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-emerald-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="w-full max-w-md relative z-10 card-3d p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white">
          <div className="text-center pb-6">
            <div className="flex items-center justify-center gap-1 bg-teal-50 text-teal-800 rounded-full px-3 py-1 text-xs font-semibold w-fit mx-auto border border-teal-100 shadow-sm mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Sistem Presensi</span>
            </div>
            <h1 className="text-4xl font-extrabold text-teal-800 tracking-tight drop-shadow-sm">
              KE Presensi
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              Portal Kehadiran Guru & Staf Konstanta
            </p>
          </div>

          {/* Form Role Selector */}
          <div className="grid grid-cols-5 gap-1.5 p-1 bg-gray-100 rounded-2xl mb-6">
            {[
              { id: 'admin', label: 'Admin', icon: Shield },
              { id: 'akademik', label: 'Akd', icon: GraduationCap },
              { id: 'ketetap', label: 'Tetap', icon: Users },
              { id: 'kangguru', label: 'Guru', icon: School },
              { id: 'karyawan', label: 'Staf', icon: Users }
            ].map(roleItem => {
              const IconComp = roleItem.icon;
              const isActive = selectedRole === roleItem.id;
              return (
                <button
                  key={roleItem.id}
                  type="button"
                  onClick={() => setSelectedRole(roleItem.id as any)}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-teal-600 text-white shadow-md scale-[1.03]"
                      : "text-gray-500 hover:text-teal-700 hover:bg-gray-200"
                  }`}
                >
                  <IconComp className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold">{roleItem.label}</span>
                </button>
              );
            })}
          </div>

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4.5 text-xs text-red-600 font-semibold leading-relaxed">
              {error}
            </div>
          ) : null}

          {/* Email / Password Form */}
          <form className="space-y-4" onSubmit={handleRealLogin}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Login</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@konstanta.my.id"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="rounded-xl bg-white/70 h-11 pl-10 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 border-gray-200"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="rounded-xl bg-white/70 h-11 pl-10 pr-10 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 border-gray-200"
                />
                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-11 mt-6 shadow-md transition-all duration-300"
            >
              {isSubmitting ? "Memverifikasi..." : `Masuk Sebagai ${selectedRole.toUpperCase()}`}
            </Button>
          </form>


        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f6] relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-teal-200/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-blue-200/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
      </div>

      <header className="bg-glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-[0_4px_10px_rgba(13,148,136,0.3)] flex items-center justify-center text-white font-bold text-xl border border-white/20">
            KE
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-gray-800 leading-tight">
              KE Presensi
            </h1>
            <p className="text-xs font-medium text-teal-700">
              {user?.name} <span className="text-gray-400 px-1">•</span>{" "}
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="btn-3d-outline px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </header>

      <main className="flex-1 px-4 pb-12 md:px-6 lg:max-w-6xl mx-auto w-full relative z-10">
        {user?.role === "ADMIN" && <AdminDashboard />}
        {user?.role === "ACADEMIC" && <AcademicDashboard />}
        {user?.role === "TEACHER" && <TeacherDashboard />}
        {user?.role === "KARYAWAN" && <KaryawanDashboard user={user!} />}
      </main>
    </div>
  );
}
