"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService, CreateCategoryPayload } from "@/lib/API/category";
import { toast } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCategoryModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();

  // 1. Setup Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryPayload>();

  // 2. Setup Mutation (Gửi API)
  const mutation = useMutation({
    mutationFn: (data: CreateCategoryPayload) => categoryService.create(data),

    onSuccess: () => {
      toast.success("Tạo danh mục thành công!");

      // 👇 QUAN TRỌNG: Báo cho React Query biết danh sách cũ rồi, tải lại đi!
      // Nó sẽ tự động gọi lại API getAll ở trang danh sách
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      reset(); // Xóa trắng form
      onClose(); // Đóng modal
    },

    onError: (err) => {
        console.log("❌ Error creating category:", err);
      const msg = "Có lỗi xảy ra khi tạo";
      toast.error(msg);
    },
  });

  // Nếu không mở thì không render gì cả
  if (!isOpen) return null;

  return (
    // Lớp nền đen mờ (Overlay)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4">
      {/* Hộp Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Thêm Danh Mục Mới</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="p-6 space-y-4"
        >
          {/* Input Tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", { required: "Tên không được để trống" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ví dụ: Lập trình Web"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Input Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Mô tả ngắn về danh mục này..."
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center shadow-lg shadow-blue-500/30"
            >
              {mutation.isPending ? "Đang lưu..." : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
