'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      // 1. Check if mock user is in localStorage
      const stored = localStorage.getItem('ke_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
          setLoading(false);
          return;
        } catch(e) {}
      }

      // 2. Check Supabase session
      try {
        const supabase = createClient() as any;
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            let roleMapped: 'ADMIN' | 'ACADEMIC' | 'TEACHER' | 'KARYAWAN' = 'KARYAWAN';
            if (profile.role === 'admin') roleMapped = 'ADMIN';
            else if (profile.role === 'akademik') roleMapped = 'ACADEMIC';
            else if (profile.role === 'ketetap' || profile.role === 'kangguru') roleMapped = 'TEACHER';

            const mappedUser: User = {
              id: profile.id,
              name: profile.full_name,
              email: session.user.email || "",
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

            setUser(mappedUser);
          }
        }
      } catch (err) {
        console.error("Error loading Supabase session", err);
      }
      setLoading(false);
    }
    loadSession();
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('ke_user', JSON.stringify(u));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('ke_user');
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch(e) {}
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-teal-600 font-medium">Memuat sesi...</div>;
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
