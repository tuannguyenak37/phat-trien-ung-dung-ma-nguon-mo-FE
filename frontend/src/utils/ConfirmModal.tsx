// components/ConfirmModal.tsx
"use client";

import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean; // Tùy chọn: để đổi màu nút nếu hành động nguy hiểm
}

export default function ConfirmModal({
  isOpen,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  onConfirm,
  onCancel,
  isDanger = true, // Mặc định là true để hiện màu đỏ cảnh báo
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* 1. Backdrop: Lớp nền tối và mờ */}
      <div
        className="fixed inset-0 bg-gray-900/50 transition-opacity backdrop-blur-sm"
        onClick={onCancel} // Click ra ngoài để đóng
        aria-hidden="true"
      ></div>

      {/* 2. Modal Panel */}
      <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100">
        {/* Nút tắt nhanh góc phải */}
        <div className="absolute right-4 top-4 hidden sm:block">
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onCancel}
          >
            <span className="sr-only">Đóng</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            {/* Icon Cảnh báo */}
            <div
              className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                isDanger ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              <ExclamationTriangleIcon
                className={`h-6 w-6 ${
                  isDanger ? "text-red-600" : "text-blue-600"
                }`}
                aria-hidden="true"
              />
            </div>

            {/* Nội dung Text */}
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Footer: Các nút bấm */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition-colors duration-200
              ${
                isDanger
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            onClick={onConfirm}
          >
            Đồng ý
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors duration-200"
            onClick={onCancel}
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}
