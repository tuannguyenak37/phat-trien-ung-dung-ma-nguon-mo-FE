"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService, CategoryEdit } from "@/lib/API/category";
import { toast } from "react-hot-toast";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

// --- Props ---
interface Props {
  categoryId: string;
  defaultData: CategoryEdit;
}

// --- Main Component (Exported) ---
// Component này bao gồm nút bấm và quản lý trạng thái hiển thị Modal
export default function EditCategory({ categoryId, defaultData }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. Trigger Button: Nút bấm hiển thị ở danh sách */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer rounded-lg transition-all"
        title="Chỉnh sửa"
      >
        <PencilSquareIcon className="w-5 h-5" />
      </button>

      {/* 2. Modal: Chỉ render khi isOpen = true để reset form state mỗi lần mở */}
      {isOpen && (
        <EditForm
          onClose={() => setIsOpen(false)}
          categoryId={categoryId}
          defaultData={defaultData}
        />
      )}
    </>
  );
}

// --- Sub Component: Form Modal ---
// Tách riêng để useForm luôn được khởi tạo lại mới tinh khi mở modal
function EditForm({
  onClose,
  categoryId,
  defaultData,
}: {
  onClose: () => void;
  categoryId: string;
  defaultData: CategoryEdit;
}) {
  const queryClient = useQueryClient();

  // Setup Form
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<CategoryEdit>({
    defaultValues: defaultData,
  });

  // Tự động focus vào ô tên khi Modal vừa hiện lên
  // (Dùng autoFocus trên input đôi khi không mượt bằng setFocus thủ công trong Modal động)
  useState(() => {
    setTimeout(() => setFocus("name"), 100);
  });

  // Setup Mutation
  const mutation = useMutation({
    mutationFn: (data: CategoryEdit) => categoryService.edit(categoryId, data),
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: () => {
      const msg = "Có lỗi xảy ra khi cập nhật vui lòng thử lại";
      toast.error(msg);
    },
  });

  const onSubmit = (data: CategoryEdit) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Panel */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-800">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <PencilSquareIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Chỉnh sửa danh mục</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
          {/* Tên danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", { required: "Tên danh mục là bắt buộc" })}
              type="text"
              className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all
                ${
                  errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              placeholder="Nhập tên danh mục..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mô tả
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              placeholder="Nhập mô tả cho danh mục này..."
            />
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
