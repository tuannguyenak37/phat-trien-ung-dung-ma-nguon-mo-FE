// types/comment.ts
export interface VoteStats {
  is_voted: number;
}

export interface Comment {
  comment_id: string;
  user_id: string;
  thread_id: string;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  updated_at: string | null;
  
  // Counters
  reply_count: number;
  upvote_count: number;
  downvote_count: number;
  
  // Status
  vote_stats?: VoteStats;
  
  // Thông tin user (Cần thiết để hiện avatar/tên)
  // Backend cần join bảng user để trả về cái này, 
  // hoặc dùng component UserThead để fetch riêng lẻ.
}

export interface CommentListResponse {
  total: number;
  page: number;
  size: number;
  data: Comment[];
}