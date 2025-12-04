import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; 
// 1. Các Providers Logic (Theo thứ tự từ ngoài vào trong)
import Providers from "./providers/providers"; // (Hoặc file providers.tsx của bạn)
import AuthProvider from "./providers/AuthProvider";
import UserGlobalListener from "@/components/UserGlobalListener";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard System",
  description: "Hệ thống quản lý phát triển bằng Next.js và FastAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {/* Lớp 1: React Query Provider (Cung cấp khả năng fetch/cache API) */}
        <Providers>
          {/* Lớp 2: Auth Provider (Xử lý hồi sinh Token khi F5) */}
          <AuthProvider>
            {/* Lớp 3: User Global Listener (Máy nghe lén: Tự động sync data user mới nhất vào Store) */}
            <UserGlobalListener />
                  <Toaster position="top-right" richColors closeButton /> 

            {/* Lớp 4: Nội dung chính của trang */}
            {children}

            
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
