// src/lib/utils.ts

// 1. Định nghĩa URL Backend (Lấy từ biến môi trường hoặc hardcode)
// Dùng NEXT_PUBLIC_ để Next.js đọc được ở phía Client
 const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";

/**
 * Hàm chuyển đổi đường dẫn ảnh tương đối thành tuyệt đối
 * @param path - Đường dẫn ảnh từ API (VD: "static/uploads/...")
 * @returns Đường dẫn tuyệt đối (VD: "http://localhost:8000/static/...") hoặc null
 */
const getFullImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;

  // Trường hợp 1: Ảnh là link online (Google, Facebook, Unsplash...) -> Giữ nguyên
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Trường hợp 2: Ảnh từ Backend (static/...)
  // Xử lý logic: Đảm bảo không bị trùng dấu "/"
  // backend_url (không /) + / + path (không /)
  
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const cleanBaseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;

  return `${cleanBaseUrl}/${cleanPath}`;
};
 export default getFullImageUrl