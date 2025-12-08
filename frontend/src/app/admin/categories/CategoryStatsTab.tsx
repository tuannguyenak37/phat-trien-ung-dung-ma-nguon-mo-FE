"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/API/category";
import { DistributionChart, GrowthChart } from "./StatsComponents";
import { 
  ChartPieIcon, ArrowTrendingUpIcon, ChatBubbleLeftRightIcon, 
  DocumentTextIcon, HandThumbUpIcon, FunnelIcon, CalendarDaysIcon 
} from "@heroicons/react/24/outline";

export default function CategoryStatsTab({ allCategories }: { allCategories: any[] }) {
  // --- STATE QUẢN LÝ FILTER ---
  const [selectedCatId, setSelectedCatId] = useState<string>(allCategories?.[0]?.category_id || "");
  
  // 1. Bộ lọc thời gian (Global Filter)
  const [startDate, setStartDate] = useState<string>(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>("");     // YYYY-MM-DD

  // 2. Bộ lọc Period (Chỉ dành cho Growth Chart)
  const [period, setPeriod] = useState<"day" | "month" | "year">("day");

  // --- QUERY DATA ---

  // API 1: Phân bố tỷ lệ (Pie Chart) - Có truyền ngày tháng
  const { data: distData, isLoading: isLoadingDist } = useQuery({
    queryKey: ["cat-distribution", startDate, endDate], // Tự động refetch khi ngày đổi
    queryFn: () => categoryService.getDistribution({ 
      start_date: startDate || undefined, 
      end_date: endDate || undefined 
    }),
  });

  // API 2: Số liệu chi tiết (Card)
  const { data: summaryData } = useQuery({
    queryKey: ["cat-stats", selectedCatId],
    queryFn: () => categoryService.getStats(selectedCatId),
    enabled: !!selectedCatId,
  });

  // API 3: Tăng trưởng (Line Chart) - Truyền đủ: ngày, tháng, period
  const { data: growthData, isLoading: isLoadingGrowth } = useQuery({
    queryKey: ["cat-growth", selectedCatId, startDate, endDate, period],
    queryFn: () => categoryService.getGrowth(selectedCatId, { 
      start_date: startDate || undefined, 
      end_date: endDate || undefined,
      period: period // day | month | year
    }),
    enabled: !!selectedCatId,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- THANH CÔNG CỤ BỘ LỌC (GLOBAL FILTER) --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center text-gray-700 font-medium">
          <FunnelIcon className="w-5 h-5 mr-2 text-blue-600" />
          Bộ lọc thời gian:
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500">Từ ngày</span>
          </div>
          
          <span className="text-gray-400">-</span>
          
          <div className="relative">
             <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500">Đến ngày</span>
          </div>
        </div>

        <button 
          onClick={() => { setStartDate(""); setEndDate(""); }}
          className="text-sm text-red-500 hover:text-red-700 hover:underline ml-auto md:ml-0"
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- CỘT TRÁI: BIỂU ĐỒ TRÒN --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-3">
              <ChartPieIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Tỷ lệ bài viết</h3>
              <p className="text-xs text-gray-500">Phân bố theo danh mục</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
             {isLoadingDist ? (
                <div className="h-64 flex items-center justify-center text-gray-400">Đang tải...</div>
             ) : (
                <>
                  <DistributionChart data={distData?.distribution || []} />
                  <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">Tổng số bài viết trong kỳ</p>
                    <p className="text-3xl font-bold text-gray-900">{distData?.total_threads_in_period || 0}</p>
                  </div>
                </>
             )}
          </div>
        </div>

        {/* --- CỘT PHẢI: CHI TIẾT & BIỂU ĐỒ TĂNG TRƯỞNG --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chọn danh mục để xem chi tiết */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <label className="font-bold text-gray-700 mr-4 whitespace-nowrap">Xem chi tiết danh mục:</label>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-64 p-2.5"
            >
              {allCategories?.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3 Thẻ Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard 
              title="Tổng Bài viết" 
              value={summaryData?.total_threads || 0} 
              icon={<DocumentTextIcon className="w-6 h-6"/>} 
              color="blue"
            />
            <StatCard 
              title="Tổng Bình luận" 
              value={summaryData?.total_comments || 0} 
              icon={<ChatBubbleLeftRightIcon className="w-6 h-6"/>} 
              color="green"
            />
            <StatCard 
              title="Tổng Vote" 
              value={summaryData?.total_votes || 0} 
              icon={<HandThumbUpIcon className="w-6 h-6"/>} 
              color="purple"
            />
          </div>

          {/* Biểu đồ tăng trưởng */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mr-3">
                  <ArrowTrendingUpIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Tăng trưởng bài đăng</h3>
                  <p className="text-xs text-gray-500">Số lượng bài viết mới</p>
                </div>
              </div>

              {/* DROPDOWN CHỌN PERIOD (NGÀY/THÁNG/NĂM) */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                 <button 
                   onClick={() => setPeriod("day")}
                   className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${period === 'day' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Ngày
                 </button>
                 <button 
                   onClick={() => setPeriod("month")}
                   className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${period === 'month' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Tháng
                 </button>
                 <button 
                   onClick={() => setPeriod("year")}
                   className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${period === 'year' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Năm
                 </button>
              </div>
            </div>

            {/* VẼ BIỂU ĐỒ */}
            {isLoadingGrowth ? (
               <div className="h-80 flex items-center justify-center text-gray-400">Đang tải dữ liệu...</div>
            ) : (
               <GrowthChart data={growthData?.data || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component thẻ nhỏ hiển thị số liệu (Giữ nguyên)
function StatCard({ title, value, icon, color }: any) {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}