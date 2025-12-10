"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/tokenStore";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useUser } from "@/lib/hook/useUser";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // preload user
  const {} = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && !user.role) {
      console.log("⏳ Đang đợi Role cập nhật...");
      return;
    }

    if (user && user.role && user.role !== "admin") {
      console.log("⛔ Không phải Admin, chuyển hướng...");
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const isUserInvalid = !user || (user && !user.role);

  // LOADING UI mới — smooth + hiện đại
  if (isAuthenticated && isUserInvalid) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F6FF]">
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-blue-600 font-semibold">
            Đang đồng bộ dữ liệu quản trị...
          </p>
        </div>
      </div>
    );
  }

  if (user && user.role !== "admin") return null;

  return (
    <div className="flex h-screen bg-[#F0F6FF]">
      {/* SIDEBAR */}
      <div className="w-64 shrink-0 hidden md:block bg-white shadow-lg border-r border-blue-100">
        <AdminSidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 scroll-smooth">
          {/* container nội dung */}
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-blue-100 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
