// --- 1. ENUMS (Giống hệt bên Python) ---
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

// --- 2. MODEL USER (Dữ liệu hiển thị) ---
export interface IUser {
  user_id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  reputation_score: number;
  url_avatar: string | null;      // Có thể null
  url_background: string | null;  // Có thể null
  description: string | null;     // Có thể null
  created_at: string;             // DateTime trả về dạng chuỗi ISO
}

// --- 3. REQUEST PAYLOADS (Dữ liệu gửi đi) ---

// Lưu ý: Avatar và Background dùng FormData nên không định nghĩa interface JSON
// Nhưng ta định nghĩa input cho hàm gọi API để rõ ràng
export interface UploadImagePayload {
  file: File;
}

export interface UpdateInfoPayload {
  firstName: string;
  lastName: string;
  description: string;
}
export interface UpdateInfoResponse {
  message: string;
  firstName: string;
  lastName: string;
  description: string;
}
export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface ChangeEmailPayload {
  password: string;     // Cần pass để xác nhận
  new_email: string;
}

// --- 4. API RESPONSES (Dữ liệu nhận về) ---
// Định nghĩa chính xác những gì Backend trả về để update State Frontend

export interface UpdateAvatarResponse {
  message: string;
  url_avatar: string; // Server trả về link ảnh mới
}

export interface UpdateBackgroundResponse {
  message: string;
  url_background: string; // Server trả về link ảnh mới
}

export interface UpdateDescriptionResponse {
  message: string;
  description: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ChangeEmailResponse {
  message: string;
  new_email: string;
}

// --- 5. AUTH RESPONSE (Cho Login/Register) ---
export interface AuthResponse extends IUser {
  access_token: string;
  refresh_token: string;
}