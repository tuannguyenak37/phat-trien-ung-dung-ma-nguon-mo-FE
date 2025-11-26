export interface HomeList {
  page?: number;
  limit?: number;
}
export interface Media {
  media_id: string;
  media_type: string;
  file_url: string;
}

export interface Tag {
  tag_id: string;
  name: string;
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
  like_count?: number;
  reply_count?: number;
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
  url_bg : string | null;
}