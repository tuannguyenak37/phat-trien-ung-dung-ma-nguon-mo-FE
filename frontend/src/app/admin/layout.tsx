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

  // Gọi hook để đảm bảo đang fetch data ngầm
  const { } = useUser();

  useEffect(() => {
  

    // 1. Chưa đăng nhập -> Đá về Login
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // 2. Đã đăng nhập, nhưng User trong Store đang bị lỗi "undefined" (như trong ảnh)
    // => return luôn, KHÔNG LÀM GÌ CẢ (Để cho nó Loading tiếp)
    if (user && !user.role) {
      console.log("⏳ Đang đợi Role cập nhật...");
      return;
    }

    // 3. Chỉ khi User có Role đầy đủ và KHÔNG PHẢI ADMIN -> Mới đá
    if (user && user.role && user.role !== "admin") {
      console.log("⛔ Phát hiện không phải Admin -> Đá ra trang chủ");
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // --- LOGIC RENDER ---

  // Điều kiện để hiện màn hình Loading:
  // 1. Chưa có User
  // 2. HOẶC Có User nhưng role bị undefined (Trường hợp trong ảnh của bạn)
  const isUserInvalid = !user || (user && !user.role);

  if (isAuthenticated && isUserInvalid) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">
            Đang đồng bộ dữ liệu quản trị...
          </p>
        </div>
      </div>
    );
  }

  // Nếu user đã xịn (có role) mà không phải admin -> Return null (đợi redirect)
  if (user && user.role !== "admin") {
    return null;
  }

  // Admin xịn -> Render Dashboard
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 shrink-0 hidden md:block">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fadeIn">{children}</div>
        </main>
      </div>
    </div>
  );
}
