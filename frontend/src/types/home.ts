
export interface HomeList {
  page?: number;
  limit?: number;
  sort_by?: "mix" | "newest" | "trending";
  category_id? : string | null;
  tag? : string | null;
}
export interface Media {
  media_id: string;
  media_type: string;
  file_url: string;
}
export interface VoteStats {
  is_voted: number;
}
export interface Tag {
  tag_id: string;
  name: string;
}
export interface User {
  user_id: string;
  firstName: string;
  lastName: string;
  url_avatar: string;
}

export interface Thread {
  thread_id: string;
  user_id: string;
  category_id: string;
  title: string;
  content: string;
  created_at: string;
  tags: Tag[];
  media: Media[];
comment_count: number;
  upvote_count: number;
  downvote_count: number;
  vote_stats?: VoteStats;
  user: User;
}
export interface ThreadListResponse {
  total: number;
  page: number;
  size: number;
  data: Thread[];
}
export interface ThreadListResponse {
  total: number;
  page: number;
  size: number;
  data: Thread[]; // Danh sách bài viết nằm trong 'data'
}

export interface ApiResponse {
  total: number;
  page: number;
  size: number;
  data: Thread[];
}

export interface UserTheadResponse {
  user_id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  url_avatar: string | null;
  description: string | null;
  reputation_score: number;
  url_background : string | null;
}