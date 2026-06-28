import type {Metadata} from 'next';
import './globals.css'; // Global styles

import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'KE Presensi',
  description: 'KE Teacher Attendance & Honor Management System',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
