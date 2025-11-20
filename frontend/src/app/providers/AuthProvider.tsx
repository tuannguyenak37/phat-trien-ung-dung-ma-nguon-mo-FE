// providers/AuthProvider.tsx
"use client";
import { useEffect, useState } from "react";
import axiosClient from "../../lib/API/axiosConfig";
import { useTokenStore } from "../../lib/store/tokenStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const loadUserFromCookie = async () => {
      try {
        console.log("🔄 Đang thử khôi phục phiên đăng nhập...");

        // Gọi API refresh
        const response = await axiosClient.post("/token/refresh"); // Check lại URL này

        console.log("✅ Response từ Refresh API:", response.data);

        // 👇 SỬA LẠI CHỖ NÀY: Lấy đúng key access_token
        const newToken =
          response.data?.access_token || response.data?.accessToken;

        if (newToken) {
          console.log("🔑 Tìm thấy token mới! Đang lưu vào Store...");
          setAccessToken(newToken);
        } else {
          console.warn("⚠️ API trả về 200 nhưng không thấy access_token đâu!");
        }
      } catch (error: any) {
        console.error(
          "❌ Lỗi khôi phục phiên:",
          error?.response?.data || error.message
        );
        // Token hết hạn hoặc lỗi mạng -> Kệ nó
      } finally {
        setIsChecking(false);
      }
    };

    loadUserFromCookie();
  }, [setAccessToken]);

  if (isChecking)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-blue-600">
        Loading App...
      </div>
    );

  return <>{children}</>;
}
