// utils/format.ts

export const formatRelativeTime = (dateString: string | Date): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  
  // Tính khoảng cách thời gian (giây)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 1. Dưới 1 phút -> "Vừa xong"
  if (diffInSeconds < 60) {
    return "Vừa xong";
  }

  // 2. Dưới 1 giờ -> "X phút trước"
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  // 3. Dưới 24 giờ -> "X giờ trước"
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  // 4. Dưới 7 ngày -> "X ngày trước"
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  // 5. Lâu hơn 7 ngày -> Hiển thị ngày tháng năm (VD: 12/05/2024)
  // Dùng toLocaleDateString để format theo chuẩn Việt Nam
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};