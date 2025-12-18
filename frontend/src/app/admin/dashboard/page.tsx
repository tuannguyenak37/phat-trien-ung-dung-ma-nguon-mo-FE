"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/API/admin/admin";
import StatCard from "./StatCard";
import { 
  UsersIcon, ShieldCheckIcon, UserMinusIcon, 
  ArchiveBoxIcon, SignalIcon 
} from "@heroicons/react/24/outline";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { format } from "date-fns";

// 1. Định nghĩa Interface đúng với JSON trả về
interface UserStatsData {
  total_users: number;
  users_by_role: {
    admin?: number;
    user?: number;
    [key: string]: number | undefined;
  };
  users_by_status: {
    banned?: number;
    active?: number;
    [key: string]: number | undefined;
  };
  users_by_date: Array<{
    date: string;
    count: number;
  }>;
}

export default function AdminDashboardPage() {
  // 2. Fetch Stats
  const { data: stats, isLoading } = useQuery<UserStatsData>({
    queryKey: ["admin-stats"],
    queryFn: adminService.getStats, 
  });

  if (isLoading) {
    return <div className="p-10 text-center text-gray-400 animate-pulse">Đang tải dữ liệu tổng quan...</div>;
  }

  if (!stats) return <div className="p-10 text-center text-red-500">Không có dữ liệu.</div>;

  // 3. Xử lý Logic: Tính user mới hôm nay từ mảng users_by_date
  const todayStr = format(new Date(), "yyyy-MM-dd"); // Lấy ngày hiện tại: 2025-12-18
  
  // Tìm trong mảng xem hôm nay có bao nhiêu user
  const newUsersToday = stats.users_by_date.find(item => item.date === todayStr)?.count || 0;

  // Chuẩn bị dữ liệu cho biểu đồ (Sắp xếp theo ngày tăng dần nếu cần)
  const chartData = [...stats.users_by_date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Quản Trị</h1>
        <p className="text-sm text-gray-500">Tổng quan hệ thống và người dùng.</p>
      </div>

      {/* --- KHỐI 1: THỐNG KÊ NGƯỜI DÙNG (Dựa trên JSON thực tế) --- */}
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-4">Người dùng hệ thống</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Tổng User + Tăng trưởng hôm nay */}
        <StatCard 
          title="Tổng User" 
          value={stats.total_users} 
          trend={newUsersToday}
          trendLabel="Đăng ký hôm nay"
          icon={<UsersIcon className="w-6 h-6" />} 
          color="blue" 
        />

        {/* Card 2: Admin (Lấy từ users_by_role) */}
        <StatCard 
          title="Quản trị viên (Admin)" 
          value={stats.users_by_role.admin || 0} 
          icon={<ShieldCheckIcon className="w-6 h-6" />} 
          color="purple" 
        />

        {/* Card 3: User Active (Lấy từ users_by_status) */}
        <StatCard 
          title="Đang hoạt động" 
          value={stats.users_by_status.active || 0} 
          icon={<SignalIcon className="w-6 h-6" />} 
          color="green" 
        />

         {/* Card 4: User Banned (Lấy từ users_by_status) */}
         <StatCard 
          title="Tài khoản bị khóa" 
          value={stats.users_by_status.banned || 0} 
          icon={<UserMinusIcon className="w-6 h-6" />} 
          color="red" 
        />
      </div>

      {/* --- KHỐI 2: BIỂU ĐỒ TĂNG TRƯỞNG USER --- */}
      {/* Vì API hiện tại chỉ trả về user, ta vẽ biểu đồ User Growth thay vì Threads */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Biểu đồ người dùng mới</h3>
          <p className="text-sm text-gray-500">Số lượng đăng ký theo ngày.</p>
        </div>
        
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                  formatter={(value: number) => [value, "Người dùng mới"]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="User đăng ký" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{r: 4, fill: "#3B82F6"}}
                  activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      
    </div>
  );
}