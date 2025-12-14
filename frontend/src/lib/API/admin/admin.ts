// lib/API/admin.ts
import  axiosInstance  from "../axiosConfig";
import { DashboardStats, GrowthChartData } from "@/types/dashboard";

export const adminService = {
  // Lấy thống kê số liệu
  getStats: async () => {
    const { data } = await axiosInstance.get<DashboardStats>("/admin/dashboard/stats");
    return data;
  },

  // Lấy dữ liệu biểu đồ
  getGrowthChart: async (days: number = 7) => {
    const { data } = await axiosInstance.get<GrowthChartData>("/admin/dashboard/chart-growth", {
      params: { days }
    });
    return data;
  }
};