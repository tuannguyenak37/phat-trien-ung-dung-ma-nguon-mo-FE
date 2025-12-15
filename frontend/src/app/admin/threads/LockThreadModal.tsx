"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface LockThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void; // Hàm callback gửi dữ liệu ra ngoài
  threadTitle?: string;
  userEmail?: string;
  isSubmitting?: boolean;
}

export default function LockThreadModal({
  isOpen,
  onClose,
  onSubmit,
  threadTitle,
  userEmail,
  isSubmitting = false,
}: LockThreadModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do khóa bài viết.");
      return;
    }
    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-amber-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full text-amber-600">
              <ExclamationTriangleIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Khóa bài viết</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Info Block */}
          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-100">
            <p className="line-clamp-1"><span className="font-semibold">Bài viết:</span> {threadTitle}</p>
            <p><span className="font-semibold">Email nhận cảnh báo:</span> {userEmail}</p>
          </div>

          {/* Input Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do vi phạm <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              placeholder="VD: Vi phạm tiêu chuẩn cộng đồng về ngôn ngữ thù ghét..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none min-h-[100px] text-sm resize-none"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
          
          <div className="text-xs text-gray-500">
            * Hành động này sẽ khóa bài viết và gửi email thông báo đến người dùng.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 shadow-sm shadow-amber-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              "Xác nhận khóa"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}