// hooks/usePublicProfile.js (hoặc viết trực tiếp trong component nếu muốn)
import { useQuery } from '@tanstack/react-query';
import userApi from "@/lib/API/user";

export const usePublicProfile = (user_id : string) => {
  return useQuery({
    // 1. queryKey: Định danh duy nhất cho request này.
    // Bao gồm user_id để khi id thay đổi, query sẽ tự động chạy lại.
    queryKey: ['public_profile', user_id],

    // 2. queryFn: Hàm gọi API thực tế
    queryFn: async () => {
      if (!user_id) return null;
      
      const response = await userApi.APIpublic_proflle(user_id);
      
      // Tùy vào cấu hình axios/fetch của bạn, 
      // dữ liệu thực tế thường nằm trong response.data
      return response.data || response; 
    },

    // 3. enabled: Chỉ chạy query khi user_id tồn tại (khác null/undefined/empty)
    enabled: !!user_id,

    // 4. Các tùy chọn khác (Optional)
    staleTime: 1000 * 60 * 5, // Giữ data "tươi" trong 5 phút (không fetch lại ngay)
    retry: 1, // Thử lại 1 lần nếu lỗi
  });
};