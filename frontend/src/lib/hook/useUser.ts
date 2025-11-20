// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../API/axiosConfig";
import { useTokenStore } from "../store/tokenStore";

// Hàm gọi API lấy user
const fetchUser = async () => {
  const { data } = await axiosClient.get("/token/api/users/me");
  return data;
};

export const useUser = () => {
  // Lấy trạng thái token để quyết định có fetch hay không
  const accessToken = useTokenStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUser,
    // 👇 Chỉ fetch khi đã có Access Token (Login rồi mới fetch)
    enabled: !!accessToken,
    staleTime: Infinity, // Data User ít thay đổi, cache lâu
  });
};
