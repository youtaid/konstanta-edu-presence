"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { mapProfileToUser } from "@/lib/profile-mapper";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Particles } from "@/components/ui/particles";
import { AnimatedLetterText } from "@/components/ui/potfolio-text";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import AdminDashboard from "@/components/dashboards/admin";
import AcademicDashboard from "@/components/dashboards/academic";
import TeacherDashboard from "@/components/dashboards/teacher";
import OrangTuaDashboard from "@/components/dashboards/orangtua";
import SiswaDashboard from "@/components/dashboards/siswa";
import EvalDashboard from "@/components/dashboards/eval";
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
  UserRound,
  BookOpen,
  ClipboardCheck
} from "lucide-react";

const PTN_LOGOS: {
  src: string;
  alt: string;
  top: string;
  left: string;
  size: number;
  rotate: number;
  delay: number;
}[] = [
  { src: "/Logo%20PTN/Logo%20UGM.png", alt: "UGM", top: "1%", left: "53%", size: 72, rotate: -4, delay: 0 },
  { src: "/Logo%20PTN/Logo%20ITB.png", alt: "ITB", top: "28%", left: "10%", size: 72, rotate: 5, delay: 0.3 },
  { src: "/Logo%20PTN/Logo%20UNS%20clean.png", alt: "UNS", top: "37%", left: "21%", size: 72, rotate: -6, delay: 0.6 },
  { src: "/Logo%20PTN/Logo%20UB%20clean.png", alt: "UB", top: "44%", left: "4%", size: 72, rotate: 4, delay: 0.9 },
  { src: "/Logo%20PTN/Logo%20UI.png", alt: "UI", top: "31%", left: "74%", size: 72, rotate: 6, delay: 0.2 },
  { src: "/Logo%20PTN/Logo%20UNDIP.png", alt: "UNDIP", top: "55%", left: "82%", size: 72, rotate: -5, delay: 0.5 },
  { src: "/Logo%20PTN/Logo%20UNAIR.png", alt: "UNAIR", top: "64%", left: "72%", size: 72, rotate: 5, delay: 0.8 },
  { src: "/Logo%20PTN/Logo%20IPB.png", alt: "IPB", top: "73%", left: "80%", size: 72, rotate: -3, delay: 1.1 },
  { src: "/Logo%20PTN/Logo%20UNPAD%20clean.png", alt: "UNPAD", top: "78%", left: "10%", size: 72, rotate: 4, delay: 0.4 },
  { src: "/Logo%20PTN/Logo%20ITS.png", alt: "ITS", top: "89%", left: "46%", size: 72, rotate: -4, delay: 0.7 },
];

function PTNShowcase() {
  return (
    <div className="hidden lg:block relative w-full h-full min-h-[560px] rounded-[32px] bg-gradient-to-br from-teal-50 via-white to-emerald-50/50 border border-white shadow-[0_20px_60px_-20px_rgba(13,148,136,0.15)] overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-teal-200/30"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[330px] h-[330px] rounded-full border border-teal-200/40"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-teal-200/50"></div>

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {PTN_LOGOS.map((logo) => (
          <div
            key={logo.alt}
            className="absolute"
            style={{ top: logo.top, left: logo.left, width: logo.size, height: logo.size }}
          >
            <motion.div
              className="w-full h-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="w-full h-full rounded-2xl bg-white shadow-lg shadow-teal-900/5 border border-gray-100 p-2 flex items-center justify-center"
                style={{ rotate: logo.rotate }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: logo.delay }}
              >
                <img src={logo.src} alt={logo.alt} className="w-full h-full object-contain" />
              </motion.div>
            </motion.div>
          </div>
        ))}
      </motion.div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 z-10 pointer-events-none">
        <span className="text-xs font-bold tracking-[0.25em] text-teal-600 uppercase mb-3">
          Target Kamu
        </span>
        <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Top PTN<br />Indonesia
        </h2>
        <p className="text-sm text-gray-500 mt-4 max-w-xs">
          KEMON mendukung seluruh tim Konstanta Education mengelola kehadiran, kinerja, dan evaluasi menuju target kelulusan ke kampus impian.
        </p>
      </div>
    </div>
  );
}

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
  const [selectedRole, setSelectedRole] = useState<'admin' | 'akademik' | 'ketetap' | 'kangguru' | 'eval' | 'karyawan' | 'otk' | 'kenz'>("admin");
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

      // Logged in successfully! Update the AuthProvider state.
      // Use the same mapping getUsers() uses server-side, so this teacher's
      // own teacherId/payroll fields always match what Akademik/Admin see.
      const mappedUser = mapProfileToUser(profile, email);

      login(mappedUser);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    const roleOptions: { id: typeof selectedRole; label: string; icon: typeof Shield }[] = [
      { id: 'admin', label: 'Admin', icon: Shield },
      { id: 'akademik', label: 'Akd', icon: GraduationCap },
      { id: 'otk', label: 'OTK', icon: UserRound },
      { id: 'kenz', label: 'Kenz', icon: BookOpen },
      { id: 'ketetap', label: 'Tetap', icon: Users },
      { id: 'kangguru', label: 'Guru', icon: School },
      { id: 'eval', label: 'Eval', icon: ClipboardCheck },
      { id: 'karyawan', label: 'Staf', icon: Users },
    ];

    return (
      <main className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-teal-50 via-gray-50 to-emerald-50/60 p-4 lg:p-10 overflow-hidden">
        {/* Background Glow + Particles */}
        <div className="absolute top-[-15%] left-[-10%] w-[34rem] h-[34rem] bg-teal-200/30 rounded-full filter blur-[110px]"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[30rem] h-[30rem] bg-emerald-200/25 rounded-full filter blur-[110px]"></div>
        <Particles
          className="absolute inset-0"
          quantity={80}
          staticity={40}
          ease={60}
          size={0.6}
          color="#0d9488"
        />

        <div className="w-full relative z-10 grid lg:grid-cols-[3fr_2fr] gap-8 items-stretch">
        <PTNShowcase />
        <div className="w-full h-full flex flex-col justify-center bg-white/90 backdrop-blur-xl p-8 lg:p-10 rounded-[28px] shadow-[0_24px_60px_-15px_rgba(13,148,136,0.15)] border border-white">
          <div className="text-center pb-6">
            <img
              src="/logo-konstanta-education.png"
              alt="Konstanta Education"
              className="h-14 w-auto mx-auto mb-5"
            />
            <AnimatedLetterText
              text="KEMON"
              letterToReplace="O"
              className="text-4xl mt-4 justify-center text-teal-800"
            />
            <p className="text-sm text-gray-500 mt-1.5">
              Konstanta Education Monitoring & Evaluation
            </p>
          </div>

          {/* Form Role Selector */}
          <div className="grid grid-cols-4 gap-2.5 p-2 bg-gray-100/80 rounded-2xl mb-6">
            {roleOptions.map(roleItem => {
              const IconComp = roleItem.icon;
              const isActive = selectedRole === roleItem.id;
              return (
                <button
                  key={roleItem.id}
                  type="button"
                  onClick={() => setSelectedRole(roleItem.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-[1.03]"
                      : "text-gray-500 hover:text-teal-700 hover:bg-white"
                  )}
                >
                  <IconComp className="w-5 h-5" />
                  <span className="text-xs font-bold">{roleItem.label}</span>
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
                  className="rounded-2xl bg-gray-50/70 h-12 pl-11 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 border-gray-200"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                  className="rounded-2xl bg-gray-50/70 h-12 pl-11 pr-11 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 border-gray-200"
                />
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 mt-6 shadow-md transition-all duration-300"
            >
              {isSubmitting ? "Memverifikasi..." : `Masuk Sebagai ${selectedRole.toUpperCase()}`}
            </Button>
          </form>


        </div>
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
          <img
            src="/logo-icon.png"
            alt="Konstanta Education"
            className="w-10 h-10 rounded-xl shadow-[0_4px_10px_rgba(13,148,136,0.3)] border border-white/20"
          />
          <div>
            <h1 className="text-lg font-extrabold text-gray-800 leading-tight">
              KEMON
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
        {user?.role === "EVAL" && <EvalDashboard />}
        {user?.role === "KARYAWAN" && <KaryawanDashboard user={user!} />}
        {user?.role === "OTK" && <OrangTuaDashboard />}
        {user?.role === "KENZ" && <SiswaDashboard />}
      </main>
    </div>
  );
}
