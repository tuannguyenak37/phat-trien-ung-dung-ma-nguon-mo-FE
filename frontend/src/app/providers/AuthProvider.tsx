"use client";
import { useEffect, useState } from "react";
// 👇 Đảm bảo đường dẫn này đúng với file axiosConfig bạn vừa sửa lúc nãy
import axiosClient from "@/lib/API/axiosConfig"; 
import { useAuthStore } from "@/lib/store/tokenStore";
// Xóa import useRouter thừa

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const loadUserFromCookie = async () => {
      try {
        // Gọi API refresh để lấy lại session
        const response = await axiosClient.post("/token/refresh");
        const data = response.data;
        
        // Check cả 2 trường hợp tên biến
        const newToken = data.access_token || data.accessToken;

        if (newToken) {
          const userInfo = {
            user_id: data.user_id,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
          };
          // Nạp lại vào Store
          setAuth(newToken, userInfo);
          console.log("✅ AuthProvider: Khôi phục đăng nhập thành công!");
        }
      } catch (error) {
        // Lỗi này là bình thường nếu user là khách (chưa từng đăng nhập)
        // console.log("ℹ️ User là khách hoặc phiên hết hạn.");
      } finally {
        // 👇 Cho phép app render
        setIsChecking(false);
      }
    };

    loadUserFromCookie();
  }, [setAuth]);

  // 👇 HIỂN THỊ LOADING THAY VÌ TRANG TRẮNG
  if (isChecking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        {/* Bạn có thể thay bằng Icon Logo Messmer xoay tròn */}
        <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
            <p className="text-sm font-mono text-gray-400 animate-pulse">Summoning Messmer...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}