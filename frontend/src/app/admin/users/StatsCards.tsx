import React from "react";
import { UserIcon, CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { StatsResponse } from "@/types/useremail";

interface Props {
  stats?: StatsResponse;
  isLoading: boolean;
}

export const StatsCards = ({ stats, isLoading }: Props) => {
  const cards = [
    {
      title: "Tổng người dùng",
      value: stats?.total_users || 0,
      icon: UserIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Đang hoạt động",
      value: stats?.users_by_status?.active || 0,
      icon: CheckCircleIcon,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Đã bị cấm (Banned)",
      value: (stats?.users_by_status?.banned || 0) + (stats?.users_by_status?.inactive || 0),
      icon: NoSymbolIcon,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className={`text-3xl font-bold mt-2 ${card.color}`}>
                {isLoading ? "..." : card.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${card.bg} ${card.color}`}>
              <card.icon className="w-8 h-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};