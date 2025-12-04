import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axiosClient from "../API/axiosConfig";
import { useAuthStore } from "../store/tokenStore";

const fetchUser = async () => {
  const { data } = await axiosClient.get("/token/api/users/me");
  return data;
};

export const useUser = () => {
  // 1. Lấy Token và hàm setUser từ Store
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  // 2. React Query gọi API
  const query = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUser,
    enabled: !!accessToken, // Chỉ chạy khi có token
    staleTime: 1000 * 60 * 5, // 5 phút mới gọi lại 1 lần (đỡ tốn request)
  });
  useEffect(() => {
    // 👇 FIX QUAN TRỌNG: Kiểm tra kỹ xem data có tồn tại không trước khi đọc
    if (query.data) {
      // Backend trả về: { success: true, user: {...} }
      // Nên phải lấy query.data.user
      const userData = query.data.user || query.data;

      // 👇 Thêm lớp bảo vệ thứ 2: userData phải không null
      if (userData) {
        const newUserInfo = {
          user_id: userData.user_id,
          role: userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          reputation_score: userData.reputation_score,
          url_avatar: userData.url_avatar,
          description: userData.description
        };
        console.log("dữ liệu ",newUserInfo)

        // Chỉ set khi có role để tránh set rác vào store
        if (newUserInfo.role) {
          // console.log("🔄 Sync User:", newUserInfo.role);
          setUser(newUserInfo);
        }
      }
    }
  }, [query.data, setUser]);

  return query;
};
