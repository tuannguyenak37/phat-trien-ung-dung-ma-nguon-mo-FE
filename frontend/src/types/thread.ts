import { File } from 'buffer';
import { Thread } from './home';
// 1. CÁC SUB-TYPES (Dùng trong Object Thread)
// ==========================================

// Thông tin người đăng (User)
export interface IThreadUser {
  user_id: string;
  firstName: string;
  lastName: string;
  url_avatar: string | null; // Có thể null
}

// Thông tin Danh mục (Category)
export interface IThreadCategory {
  category_id: string;
  name: string;
  slug: string;
}

// Thông tin Tag
export interface IThreadTag {
  tag_id: string;
  name: string;
}

// Thông tin Media (Ảnh/Video đính kèm)
export interface IThreadMedia {
  media_id: string;
  media_type: "image" | "video"; // Backend trả về string, nhưng ta ép kiểu union cho chặt chẽ
  file_url: string;
  sort_order: number;
}

// Trạng thái Vote của người đang xem (để hiện tim đỏ/xám)
export interface IVoteStats {
  is_voted: number; // 1: Like, -1: Dislike, 0: Chưa vote
}

// ==========================================
// 2. MAIN TYPE: THREAD DETAIL (Dữ liệu về)
// ==========================================

export interface IThread {
  thread_id: string;
  title: string;
  slug: string;       // Dùng cho URL SEO
  content: string;    // HTML content
  created_at: string; // ISO Date String (VD: 2025-12-05T08:37:16.282Z)

  // Counter (Số lượng)
  comment_count: number;
  upvote_count: number;
  downvote_count: number;

  // Quan hệ (Nested Objects)
  user: IThreadUser;
  category: IThreadCategory;
  tags: IThreadTag[];
  media: IThreadMedia[];

  // Optional: Chỉ có khi user đã đăng nhập & Backend có xử lý check vote
  vote_stats?: IVoteStats;
}

// ==========================================
// 3. LIST RESPONSE (Dùng cho trang Feed/Home)
// ==========================================

export interface IThreadListResponse {
  total: number;
  page: number;
  size: number;
  data: IThread[];
}

// ==========================================
// 4. FORM DATA TYPES (Dữ liệu gửi đi)
// ==========================================

// Dùng cho form Tạo mới (Create)
export interface IThreadCreateForm {
  title: string;
  content: string;
  category_id: string;
  tags?: string;     // Chuỗi tag phân cách dấu phẩy (VD: "news, tech")
  files?: FileList;  // File gốc từ input (để upload)
}

// Dùng cho form Chỉnh sửa (Update)
export interface IThreadUpdateForm {
  title?: string;
  content?: string;
  category_id?: string;
  tags?: string;
  
  new_files?: FileList;        // Upload thêm ảnh mới
  delete_media_ids?: string[]; // Mảng ID các ảnh cũ muốn xóa
}

export interface sheach{
  page: number;
  limit :  number;
  sheach  : any;
  category_id : string | null;
  tag  : string | null;
}


export interface ThreadEdit {
  thread_id: string;
  title?: string | null;
  content?: string | null;
  category_id?: string | null;
  tags?: string[] | null;
  new_files?: File[] | null;
  delete_media_ids?: string[] | null;
}


// Định nghĩa cho User
interface UserAuthor {
  user_id: string;
  firstName: string;
  lastName: string;
  url_avatar: string;
}

// Định nghĩa cho Category
interface Category {
  category_id: string;
  name: string;
  slug: string;
}

// Định nghĩa cho Media (Giả sử cấu trúc, vì JSON mẫu để mảng rỗng [])
interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
}

// Định nghĩa Interface chính cho Thread (theo mẫu JSON bạn đưa)
export interface ThreadResponse {
  thread_id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  comment_count: number;
  upvote_count: number;
  downvote_count: number;
  user: UserAuthor;
  category: Category;
  tags: string[]; // Giả sử tags là mảng string
  media: Media[]; // Hoặc any[] nếu chưa rõ cấu trúc bên trong
}