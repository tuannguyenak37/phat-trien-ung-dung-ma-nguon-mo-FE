import React from "react";
import { User } from "@/types/useremail";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Props {
  users: User[];
  isLoading: boolean;
  page: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onAction: (user: User, action: "ban" | "unlock") => void; // Callback mở modal
}

export const UserTable = ({ users, isLoading, page, total, limit, onPageChange, onAction }: Props) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-10">Đang tải...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10">Không có dữ liệu</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 shrink-0 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                        {user.url_avatar ? <img src={user.url_avatar} className="h-10 w-10 rounded-full" /> : user.email[0].toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {/* NÚT ACTION CỦA BẠN Ở ĐÂY */}
                    {user.status === 'active' ? (
                      <button
                        onClick={() => onAction(user, "ban")}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded border border-red-200 text-sm font-medium transition"
                      >
                        Khóa (Ban)
                      </button>
                    ) : (
                      <button
                        onClick={() => onAction(user, "unlock")}
                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded border border-green-200 text-sm font-medium transition"
                      >
                        Mở (Unlock)
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Phân trang */}
      <div className="px-6 py-3 border-t flex items-center justify-between">
         <span className="text-sm text-gray-700">Trang {page} / {totalPages || 1}</span>
         <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronLeftIcon className="w-4 h-4"/></button>
            <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronRightIcon className="w-4 h-4"/></button>
         </div>
      </div>
    </div>
  );
};