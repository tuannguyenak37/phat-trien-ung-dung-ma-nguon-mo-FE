"use client";

import React, { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import type { IThread } from "@/types/thread";

interface DashboardChartsProps {
  threads: IThread[];
}

export default function DashboardCharts({ threads = [] }: DashboardChartsProps) { // Mặc định là mảng rỗng nếu chưa có data
  
  // --- LOGIC XỬ LÝ DỮ LIỆU TỪ API ---
  const chartData = useMemo(() => {
    if (!threads || threads.length === 0) return [];

    // 1. Nhóm bài viết theo ngày
    const groups: Record<string, { date: string; total: number; locked: number; active: number }> = {};

    // Sắp xếp bài viết cũ -> mới để biểu đồ chạy đúng chiều thời gian
    const sortedThreads = [...threads].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    sortedThreads.forEach((t) => {
      // Chuyển created_at thành dạng "15/12" (Ngày/Tháng)
      const dateKey = format(parseISO(t.created_at), "dd/MM", { locale: vi });

      if (!groups[dateKey]) {
        groups[dateKey] = { date: dateKey, total: 0, locked: 0, active: 0 };
      }

      groups[dateKey].total += 1;
      
      if (t.is_locked) {
        groups[dateKey].locked += 1;
      } else {
        groups[dateKey].active += 1;
      }
    });

    // Chuyển object thành array để Recharts dùng
    return Object.values(groups);
  }, [threads]);

  // Tính tổng quan nhanh
  const totalPosts = threads.length;
  const totalLocked = threads.filter(t => t.is_locked).length;
  const lockRate = totalPosts > 0 ? ((totalLocked / totalPosts) * 100).toFixed(1) : 0;

  if (totalPosts === 0) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* 3 Block thống kê nhỏ phía trên */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <p className="text-xs font-medium text-blue-600 uppercase">Tổng bài viết (Hiển thị)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalPosts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm bg-gradient-to-br from-red-50 to-white">
          <p className="text-xs font-medium text-red-600 uppercase">Đã khóa / Cảnh cáo</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalLocked}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Tỷ lệ vi phạm</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{lockRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BIỂU ĐỒ 1: TĂNG TRƯỞNG BÀI VIẾT (AREA CHART) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Xu hướng đăng bài</h3>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
              Theo ngày
            </span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} allowDecimals={false}/>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  name="Bài viết mới"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BIỂU ĐỒ 2: CẢNH BÁO & KHÓA (BAR CHART) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Trạng thái bài viết</h3>
             <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span>An toàn</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Bị khóa</span>
             </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} allowDecimals={false}/>
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                
                {/* Cột chồng: Active + Locked */}
                <Bar dataKey="active" name="Hoạt động" stackId="a" fill="#4ade80" radius={[0, 0, 4, 4]} />
                <Bar dataKey="locked" name="Đã khóa" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}