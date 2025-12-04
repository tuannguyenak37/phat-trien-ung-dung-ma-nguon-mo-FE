import React from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export const DateRangeFilter = ({ startDate, endDate, onChange }: Props) => {
  
  // Hàm helper để tính ngày lùi lại (vd: lùi 7 ngày)
  const setLastDays = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    onChange(
      start.toISOString().split('T')[0], // Format YYYY-MM-DD
      end.toISOString().split('T')[0]
    );
  };

  const handleReset = () => {
    onChange("", "");
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
      
      {/* Label & Icon */}
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <FunnelIcon className="w-5 h-5 text-blue-600" />
        <span>Lọc thời gian:</span>
      </div>

      {/* Inputs chọn ngày */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Từ ngày</label>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={startDate}
            onChange={(e) => onChange(e.target.value, endDate)}
          />
        </div>
        <span className="text-gray-400 mt-5">-</span>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Đến ngày</label>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={endDate}
            onChange={(e) => onChange(startDate, e.target.value)}
          />
        </div>
      </div>

      {/* Các nút chọn nhanh */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLastDays(7)}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
        >
          7 ngày qua
        </button>
        <button
          onClick={() => setLastDays(30)}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
        >
          30 ngày qua
        </button>
        
        {/* Nút Reset */}
        {(startDate || endDate) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition ml-2"
          >
            <XMarkIcon className="w-4 h-4" /> Xóa lọc
          </button>
        )}
      </div>
    </div>
  );
};