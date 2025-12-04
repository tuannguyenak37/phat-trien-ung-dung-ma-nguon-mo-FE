import React from "react";
import {
  SparklesIcon,
  BoltIcon,
  StarIcon,
  ShieldCheckIcon,
  FireIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";

interface ReputationBadgeProps {
  score: number;
  showScore?: boolean; // Tùy chọn hiện số điểm bên cạnh
  size?: "sm" | "md";  // Kích thước badge
}

export default function ReputationBadge({ 
  score = 0, 
  showScore = false,
  size = "sm" 
}: ReputationBadgeProps) {
  
  // Logic phân loại
  const getBadgeConfig = (points: number) => {
    if (points >= 1500) {
      return {
        label: "Thành viên ưu tú",
        icon: FireIcon,
        colorClass: "bg-red-50 text-red-600 border-red-100",
        iconClass: "text-red-500",
      };
    }
    if (points >= 700) {
      return {
        label: "Kỳ cựu",
        icon: ShieldCheckIcon,
        colorClass: "bg-orange-50 text-orange-600 border-orange-100",
        iconClass: "text-orange-500",
      };
    }
    if (points >= 300) {
      return {
        label: "Đóng góp",
        icon: StarIcon,
        colorClass: "bg-purple-50 text-purple-600 border-purple-100",
        iconClass: "text-purple-500",
      };
    }
    if (points >= 100) {
      return {
        label: "Tích cực",
        icon: BoltIcon,
        colorClass: "bg-blue-50 text-blue-600 border-blue-100",
        iconClass: "text-blue-500",
      };
    }
    return {
      label: "Thành viên",
      icon: SparklesIcon,
      colorClass: "bg-green-50 text-green-600 border-green-100",
      iconClass: "text-green-500",
    };
  };

  const config = getBadgeConfig(score);
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border font-bold select-none transition-colors",
        config.colorClass,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      )}
      title={`Điểm uy tín: ${score}`}
    >
      <Icon className={clsx(size === "sm" ? "w-3 h-3" : "w-4 h-4", config.iconClass)} />
      <span>{config.label}</span>
      {showScore && (
        <>
            <span className="opacity-30 mx-0.5"></span>
            
        </>
      )}
    </div>
  );
}