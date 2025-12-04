import React, { useState } from "react";
import { User } from "@/types/useremail";

interface Props {
  isOpen: boolean;
  user: User | null;
  action: "ban" | "unlock";
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

export const BanModal = ({ isOpen, user, action, onClose, onConfirm, isLoading }: Props) => {
  const [reason, setReason] = useState("");

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className={`text-lg font-bold mb-2 ${action === 'ban' ? 'text-red-600' : 'text-green-600'}`}>
          {action === 'ban' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
        </h3>
        <p className="text-gray-600 mb-4">
          Bạn có chắc muốn thực hiện với <b>{user.email}</b>?
        </p>
        
        <label className="block text-sm font-medium text-gray-700 mb-1">Lý do:</label>
        <textarea
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do..."
        />

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Hủy</button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg transition ${
               isLoading ? 'opacity-50' : ''
            } ${action === 'ban' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};