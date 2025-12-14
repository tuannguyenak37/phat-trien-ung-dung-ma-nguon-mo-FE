"use client";

import { useState } from "react";
import ConfirmModal from "@/utils/ConfirmModal"; // Đường dẫn tới Modal của bạn
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {toast} from "sonner";
import { categoryService } from "@/lib/API/category";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function DeleteTag({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => categoryService.deleteTag(id),
    onSuccess: () => {
      toast.success("Xóa thẻ thành công!");
      // Làm mới danh sách tags sau khi xóa
      queryClient.invalidateQueries({ queryKey: ["tags-popular"] });
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa thẻ!"),
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        title="Xóa Tag"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="Xóa Thẻ (Tag)?"
        message="Hành động này sẽ xóa vĩnh viễn thẻ này khỏi hệ thống. Các bài viết liên quan sẽ mất thẻ này. Bạn chắc chắn chứ?"
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          deleteMutation.mutate();
          setIsOpen(false);
        }}
      />
    </>
  );
}