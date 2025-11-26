"use server";

import APIhome from "@/lib/API/thead"; // Đổi đường dẫn tới file APIhome của bạn

export async function getThreads(page: number = 1, limit: number = 10) {
  try {
    const res = await APIhome.APIhome({ page, limit });

    // Axios trả về object { data: ApiResponse, status: 200, ... }
    // Chúng ta cần lấy phần .data bên trong, nó khớp với interface ApiResponse
    return res.data;
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
    return null;
  }
}
