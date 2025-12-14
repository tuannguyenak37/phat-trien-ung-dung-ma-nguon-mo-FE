// types/dashboard.ts

export interface DashboardStats {
  total_users: number;
  new_users_today: number;
  banned_users: number;

  total_threads: number;
  new_threads_today: number;
  locked_threads: number;

  total_comments: number;
  total_categories: number;
  total_tags: number;
  total_votes: number;
}

// Type cho biểu đồ (nếu bạn dùng API chart-growth)
export interface GrowthChartData {
  threads_growth: { date: string; count: number }[];
  users_growth: { date: string; count: number }[];
}