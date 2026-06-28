"use client";

import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUsers } from "@/app/actions";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import AdminDashboard from "@/components/dashboards/admin";
import AcademicDashboard from "@/components/dashboards/academic";
import TeacherDashboard from "@/components/dashboards/teacher";
import { LogOut } from "lucide-react";

export default function Home() {
  const { user, login, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  if (!user) {
    return (
      <main className="min-h-screen relative flex items-center justify-center bg-gray-50 p-4 overflow-hidden">
        {/* Background Decorative Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="w-full max-w-md relative z-10 card-3d p-8">
          <div className="text-center pb-6">
            <h1 className="text-4xl font-extrabold text-teal-800 tracking-tight drop-shadow-sm mb-2">
              KE Presensi
            </h1>
            <p className="text-sm font-medium text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              Sistem Manajemen Presensi
            </p>
          </div>
          <div className="space-y-4 pt-2">
            <div className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider text-center">
              Login Sebagai
            </div>
            {users.map((u) => (
              <button
                key={u.id}
                className="w-full btn-3d-outline h-auto py-3 px-4 rounded-xl flex items-center justify-between group"
                onClick={() => login(u)}
              >
                <div className="flex flex-col text-left">
                  <span className="font-bold text-gray-800 text-lg group-hover:text-teal-700 transition-colors">
                    {u.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {u.role}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-inner text-gray-400 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </button>
            ))}
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
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-[0_4px_10px_rgba(13,148,136,0.3)] flex items-center justify-center text-white font-bold text-xl border border-white/20">
            KE
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-gray-800 leading-tight">
              KE Presensi
            </h1>
            <p className="text-xs font-medium text-teal-700">
              {user.name} <span className="text-gray-400 px-1">•</span>{" "}
              {user.role}
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
        {user.role === "ADMIN" && <AdminDashboard />}
        {user.role === "ACADEMIC" && <AcademicDashboard />}
        {user.role === "TEACHER" && <TeacherDashboard />}
      </main>
    </div>
  );
}
