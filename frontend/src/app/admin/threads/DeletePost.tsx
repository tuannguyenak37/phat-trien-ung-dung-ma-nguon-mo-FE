"use client";

import { useState } from "react";
import ConfirmModal from "@/utils/ConfirmModal"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/API/thead";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function DeletePost({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(id),
    onSuccess: () => {
      toast.success("Đã xóa bài viết thành công!");
      // Refresh lại danh sách bài viết
      queryClient.invalidateQueries({ queryKey: ["admin-threads"] });
    },
    onError: () => toast.error("Không thể xóa bài viết này (Lỗi quyền hoặc server)"),
  });

  // Ngăn chặn sự kiện click lan ra ngoài (để không kích hoạt chuyển trang của dòng bảng)
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleDeleteClick}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        title="Xóa bài viết"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="Xóa Bài Viết?"
        message="Hành động này không thể hoàn tác. Bài viết và toàn bộ bình luận sẽ bị xóa vĩnh viễn."
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          deleteMutation.mutate();
          setIsOpen(false);
        }}
      />
    </>
  );
}