export interface tagPopular{
    name : string;
    tag_id : string;

}
export interface categoriesPopular {
    name : string;
    description: string;
    slug : string;
    category_id :  string;
}

export interface tagPopularList {
   list: [tagPopular];
}
export interface categoriesPopularList  {
   list: [categoriesPopular];
}

export interface DistributionParams {
  start_date?: string; // Format: YYYY-MM-DD
  end_date?: string;   // Format: YYYY-MM-DD
}

// --- 2. DỮ LIỆU NHẬN VỀ (RESPONSE DATA) ---

// Item con: Một miếng của biểu đồ tròn
export interface CategoryDistributionItem {
  category_id: string;
  name: string;
  count: number;       // Số lượng bài viết
  percentage: number;  // Tỷ lệ %
}

// Response tổng từ API /stats/distribution
export interface CategoryDistributionResponse {
  start_date: string | null;
  end_date: string | null;
  total_threads_in_period: number;
  distribution: CategoryDistributionItem[];
}

// Param cho API Growth (Biểu đồ tăng trưởng)
export interface GrowthParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string;   // YYYY-MM-DD
  period?: "day" | "month" | "year";
}

// Param cho API Distribution (Biểu đồ tròn)
export interface DistributionParams {
  start_date?: string;
  end_date?: string;
}

// --- B. DỮ LIỆU TRẢ VỀ (RESPONSE) ---

// 1. RESPONSE: THỐNG KÊ TỔNG QUAN (Card Header)
// API: /admin/stats/{id}
export interface CategoryStatsSummary {
  category_id: string;
  name: string;
  total_threads: number;
  total_comments: number;
  total_votes: number;
  last_activity: string | null; // Datetime string
}

// 2. RESPONSE: TĂNG TRƯỞNG (Line Chart)
// API: /admin/stats/{id}/growth
export interface GrowthDataPoint {
  time_point: string; // Ngày hoặc tháng
  count: number;
}

export interface CategoryGrowthResponse {
  category_id: string;
  period: string;
  data: GrowthDataPoint[];
}

// 3. RESPONSE: TỶ LỆ PHÂN BỐ (Pie Chart)
// API: /admin/stats/distribution
export interface CategoryDistributionItem {
  category_id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface CategoryDistributionResponse {
  start_date: string | null;
  end_date: string | null;
  total_threads_in_period: number;
  distribution: CategoryDistributionItem[];
}