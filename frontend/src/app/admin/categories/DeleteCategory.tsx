"use client";

import { useState } from "react";
import ConfirmModal from "@/utils/ConfirmModal";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { categoryService } from "@/lib/API/category";
import { TrashIcon } from "@heroicons/react/24/outline";
export default function DeleteCategory({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => categoryService.delete(id),
    onSuccess: () => toast.success("Xóa thành công!"),
    onError: () => toast.error("Có lỗi xảy ra!"),
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        title="Xóa"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="Xóa danh mục?"
        message="Hành động này sẽ xóa vĩnh viễn. Bạn chắc chắn không?"
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          deleteMutation.mutate();
          setIsOpen(false);
        }}
      />
    </>
  );
}
