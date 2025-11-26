"use client";
import { useEffect, useState } from "react";
import axiosClient from "../../lib/API/axiosConfig";
import { useAuthStore } from "../../lib/store/tokenStore";
import { useRouter } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isChecking, setIsChecking] = useState(true); // Mặc định là Đang check
  const router = useRouter();
  useEffect(() => {
    const loadUserFromCookie = async () => {
      try {
        const response = await axiosClient.post("/token/refresh");
        const data = response.data;
        const newToken = data.access_token || data.accessToken;

        if (newToken) {
          const userInfo = {
            user_id: data.user_id,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
          };
          setAuth(newToken, userInfo);
        }
      } catch (error) {
        console.log("❌ Không thể lấy user từ cookie:", error);
        

      } finally {
        // 👇 QUAN TRỌNG: Dù thành công hay thất bại, cũng báo là Check xong rồi
        setIsChecking(false);
      }
    };

    loadUserFromCookie();
  }, [setAuth]);

  // 👇 CHẶN RENDER TOÀN CỤC KHI F5
  // Khi F5, isChecking = true -> Return null luôn.
  // Không render UserGlobalListener -> useUser không chạy -> Không lỗi undefined.
  if (isChecking) {
    // Bạn có thể return null hoặc loading spinner
    return null;
  }

  return <>{children}</>;
}
