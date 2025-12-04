export interface sedEMail{
    email: string;
    status: "active" | "inactive" | string;
    reason: string;
}
export interface User {
  user_id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: "active" | "inactive" | string;
  role: "user" | "admin" | string;
  reputation_score: number;
  url_avatar: string | null;
  created_at: string;
}

export interface UserListResponse {
  total: number;
  page: number;
  limit: number;
  data: User[];
}

export interface UserListReq {
  page: number;
  limit: number;
  search : string | null
}

export interface StatsQueryParams {
  start_date?: string | null; // YYYY-MM-DD
  end_date?: string | null;   // YYYY-MM-DD
}

export interface UsersByDate {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface StatsResponse {
  total_users: number;

  users_by_role: {
    [role: string]: number; // ví dụ: admin: 30, user: 100
  };

  users_by_status: {
    [status: string]: number; // ví dụ: active: 120, inactive: 10
  };

  users_by_date: UsersByDate[];
}
