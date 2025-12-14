"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/API/admin/admin";
import StatCard from "./StatCard";
import { 
  UsersIcon, DocumentTextIcon, ChatBubbleLeftIcon, 
  TagIcon, HandThumbUpIcon, ArchiveBoxIcon 
} from "@heroicons/react/24/outline";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { format } from "date-fns";

export default function AdminDashboardPage() {
  // 1. Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getStats,
  });

  // 2. Fetch Chart
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["admin-chart"],
    queryFn: () => adminService.getGrowthChart(7),
  });

  if (statsLoading) {
    return <div className="p-10 text-center text-gray-400 animate-pulse">Đang tải dữ liệu tổng quan...</div>;
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Tổng quan</h1>
        <p className="text-sm text-gray-500">Chào mừng trở lại trang quản trị.</p>
      </div>

      {/* --- KHỐI 1: THỐNG KÊ NGƯỜI DÙNG --- */}
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-4">Người dùng & Tài khoản</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng User" 
          value={stats.total_users} 
          trend={stats.new_users_today}
          trendLabel="Đăng ký hôm nay"
          icon={<UsersIcon className="w-6 h-6" />} 
          color="blue" 
        />
        <StatCard 
          title="User bị khóa" 
          value={stats.banned_users} 
          icon={<ArchiveBoxIcon className="w-6 h-6" />} 
          color="red" 
        />
        <StatCard 
          title="Tổng Bình luận" 
          value={stats.total_comments} 
          icon={<ChatBubbleLeftIcon className="w-6 h-6" />} 
          color="purple" 
        />
         <StatCard 
          title="Tổng Tương tác (Vote)" 
          value={stats.total_votes} 
          icon={<HandThumbUpIcon className="w-6 h-6" />} 
          color="orange" 
        />
      </div>

      {/* --- KHỐI 2: THỐNG KÊ NỘI DUNG --- */}
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-2">Nội dung diễn đàn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng Bài viết" 
          value={stats.total_threads} 
          trend={stats.new_threads_today}
          trendLabel="Bài mới hôm nay"
          icon={<DocumentTextIcon className="w-6 h-6" />} 
          color="green" 
        />
         <StatCard 
          title="Bài bị khóa" 
          value={stats.locked_threads} 
          icon={<ArchiveBoxIcon className="w-6 h-6" />} 
          color="red" 
        />
        <StatCard 
          title="Danh mục (Categories)" 
          value={stats.total_categories} 
          icon={<ArchiveBoxIcon className="w-6 h-6" />} 
          color="blue" 
        />
        <StatCard 
          title="Thẻ (Tags)" 
          value={stats.total_tags} 
          icon={<TagIcon className="w-6 h-6" />} 
          color="blue" 
        />
      </div>

      {/* --- KHỐI 3: BIỂU ĐỒ TĂNG TRƯỞNG (BONUS) --- */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Biểu đồ tăng trưởng (7 ngày qua)</h3>
          <p className="text-sm text-gray-500">Theo dõi số lượng bài viết và người dùng mới.</p>
        </div>
        
        <div className="h-[350px] w-full">
          {chartLoading ? (
            <div className="h-full flex items-center justify-center text-gray-400">Đang tải biểu đồ...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData?.threads_growth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => format(new Date(val), "dd/MM")}
                  tick={{fontSize: 12, fill: '#9CA3AF'}}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{fontSize: 12, fill: '#9CA3AF'}}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  labelFormatter={(val) => format(new Date(val), "dd/MM/yyyy")}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Bài viết mới" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{r: 4, fill: "#10B981"}}
                />
                {/* Nếu muốn vẽ thêm line User thì cần merge data, nhưng demo vẽ 1 line cho gọn */}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}