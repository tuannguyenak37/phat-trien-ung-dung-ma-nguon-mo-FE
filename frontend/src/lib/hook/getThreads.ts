"use server";

import APIhome from "@/lib/API/thead"; // Đổi đường dẫn tới file APIhome của bạn
import { HomeList } from "@/types/home";
export async function getThreads(params?: HomeList) {
  try {
    // Thiết lập giá trị mặc định
    const defaultParams: HomeList = {
      page: 1,
      limit: 10,
      sort_by: "mix",
      category_id: null,
      tag: null,
      
    };

    // Gộp tham số người dùng truyền vào với mặc định
    const finalParams = { ...defaultParams, ...params };

    // Gọi API
    const res = await APIhome.APIhome(finalParams);

    // Trả về data
    return res.data;
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
    return null;
  }
}