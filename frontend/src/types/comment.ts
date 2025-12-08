// types/comment.ts
export interface VoteStats {
  is_voted: number;
}
// src/types/comment.ts
export interface Comment {
  comment_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string | null; // Thêm dấu ? nếu có thể null
  upvote_count: number;
  downvote_count: number;
  reply_count: number;
  vote_stats?: {
      is_voted: number;
  };
  // User info nằm trong object user
  user: {
      user_id: string;
      firstName: string;
      lastName: string;
      url_avatar: string | null;
  };
}
export interface CommentListResponse {
  total: number;
  page: number;
  size: number;
  data: Comment[];
}