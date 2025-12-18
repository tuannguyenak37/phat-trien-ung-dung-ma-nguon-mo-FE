"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: "blue" | "green" | "red" | "purple" | "orange";
  trend?: number; 
  trendLabel?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  trendLabel = "Hôm nay" 
}: StatCardProps) {
  
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {(value || 0).toLocaleString('vi-VN')}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>

      {/* Hiển thị trend nếu có số liệu (kể cả 0 nếu muốn, ở đây để > 0 mới hiện) */}
      {(trend !== undefined && trend > 0) ? (
        <div className="mt-4 flex items-center text-xs">
          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            ↗ +{trend}
          </span>
          <span className="text-gray-400 ml-2">{trendLabel}</span>
        </div>
      ) : (
        <div className="mt-4 h-5"></div> // Giữ chỗ để card đều nhau
      )}
    </div>
  );
}