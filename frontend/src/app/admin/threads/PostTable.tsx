"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  TrashIcon, 
  EyeIcon, 
  ChatBubbleLeftIcon, 
  HandThumbUpIcon,
  LockClosedIcon // 👈 Icon khóa (Hành động)
} from "@heroicons/react/24/outline";
import { LockClosedIcon as LockSolidIcon } from "@heroicons/react/24/solid"; // 👈 Icon khóa (Trạng thái)
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Import Modal
import ConfirmModal from "@/utils/ConfirmModal"; 
import LockThreadModal from "./LockThreadModal"; // 👈 Modal Khóa mới

import api  from "@/lib/API/thead"; 
import { ILockThreadPayload } from "@/types/thread"
import type { IThread, IThreadListResponse } from "@/types/thread";

const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";

interface PostTableProps {
  initialData: IThreadListResponse;
}

export default function PostTable({ initialData }: PostTableProps) {
  // State data
  const [threads, setThreads] = useState<IThread[]>(initialData.data || []);
  
  // State Modals
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);
  const [lockingThread, setLockingThread] = useState<IThread | null>(null); // 👈 State cho bài đang khóa

  const queryClient = useQueryClient();

  // Helper formats
  const getImageUrl = (url: string) => 
    url.startsWith("http") ? url : `${API_DOMAIN.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  // --- 1. XỬ LÝ XÓA ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(id),
    onSuccess: (data, variables) => {
      toast.success("Đã xóa bài viết vĩnh viễn");
      setThreads((prev) => prev.filter((t) => t.thread_id !== variables));
      setDeletingThreadId(null);
      queryClient.invalidateQueries({ queryKey: ["dashboard-posts"] });
    },
    onError: () => {
      toast.error("Lỗi khi xóa bài viết");
      setDeletingThreadId(null);
    },
  });

  // --- 2. XỬ LÝ KHÓA (MỚI) ---
  const lockMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ILockThreadPayload }) => {
      return await api.lockAndWarnThread(id, payload);
    },
    onSuccess: (data, variables) => {
      toast.success("Đã khóa bài viết và gửi cảnh báo!");
      
      // Cập nhật UI ngay lập tức: Đổi trạng thái is_locked thành true
      setThreads((prev) => prev.map(t => 
        t.thread_id === variables.id ? { ...t, is_locked: true } : t
      ));
      
      setLockingThread(null);
    },
    onError: () => {
      toast.error("Gặp lỗi khi khóa bài viết.");
    },
  });

  // Handler khi admin bấm nút "Xác nhận khóa" trong Modal
  const handleConfirmLock = (reason: string) => {
    if (!lockingThread) return;
    
    const payload: ILockThreadPayload = {
      email: lockingThread.user.email,
      status: true,
      reason: reason,
    };

    lockMutation.mutate({ id: lockingThread.thread_id, payload });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Trạng thái</th> {/* 👈 Cột mới */}
              <th className="px-6 py-4 font-medium">Bài viết</th>
              <th className="px-6 py-4 font-medium">Danh mục</th>
              <th className="px-6 py-4 font-medium text-center">Thống kê</th>
              <th className="px-6 py-4 font-medium">Ngày tạo</th>
              <th className="px-6 py-4 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {threads.map((thread) => (
              <tr 
                key={thread.thread_id} 
                // Nếu bị khóa thì hiện nền đỏ nhạt
                className={`transition-colors group ${thread.is_locked ? "bg-red-50/60" : "hover:bg-gray-50"}`}
              >
                {/* 0. Cột Trạng thái */}
                <td className="px-6 py-4">
                    {thread.is_locked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                            <LockSolidIcon className="w-3 h-3" /> Đã khóa
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            Hoạt động
                        </span>
                    )}
                </td>

                {/* 1. Bài viết */}
                <td className="px-6 py-4 max-w-sm">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative border">
                      {thread.media && thread.media.length > 0 ? (
                        <Image src={getImageUrl(thread.media[0].file_url)} alt="thumb" fill className="object-cover"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No img</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <Link 
                        href={`/Thread/${thread.category.slug}/${thread.slug}`} 
                        className={`font-semibold line-clamp-1 mb-1 ${thread.is_locked ? "text-gray-500 italic line-through" : "text-gray-900 hover:text-blue-600"}`}
                        target="_blank"
                      >
                        {thread.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="truncate max-w-[150px]">{thread.user.email}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Danh mục */}
                <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {thread.category.name}
                    </span>
                </td>

                {/* 3. Thống kê */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4 text-gray-500">
                    <div className="flex flex-col items-center"><HandThumbUpIcon className="w-4 h-4"/><span className="text-xs">{thread.upvote_count}</span></div>
                    <div className="flex flex-col items-center"><ChatBubbleLeftIcon className="w-4 h-4"/><span className="text-xs">{thread.comment_count}</span></div>
                  </div>
                </td>

                {/* 4. Ngày tạo */}
                <td className="px-6 py-4 text-xs text-gray-500">{formatDate(thread.created_at)}</td>

                {/* 5. Hành động */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Xem */}
                    <Link href={`/Thread/${thread.category.slug}/${thread.slug}`} target="_blank" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="Xem bài viết">
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    
                    {/* Khóa (Chỉ hiện khi chưa khóa) */}
                    {!thread.is_locked && (
                        <button 
                          onClick={() => setLockingThread(thread)}
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-md"
                          title="Khóa & Cảnh báo vi phạm"
                        >
                          <LockClosedIcon className="w-5 h-5" />
                        </button>
                    )}

                    {/* Xóa */}
                    <button onClick={() => setDeletingThreadId(thread.thread_id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md" title="Xóa vĩnh viễn">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {threads.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                        Không tìm thấy bài viết nào.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODALS --- */}

      <ConfirmModal 
        isOpen={!!deletingThreadId}
        title="Xóa bài viết?"
        message="Hành động này không thể hoàn tác. Bài viết sẽ mất vĩnh viễn."
        isDanger={true}
        onConfirm={() => deletingThreadId && deleteMutation.mutate(deletingThreadId)}
        onCancel={() => setDeletingThreadId(null)}
      />

      {/* Modal Khóa */}
      {lockingThread && (
        <LockThreadModal
          isOpen={!!lockingThread}
          onClose={() => setLockingThread(null)}
          onSubmit={handleConfirmLock}
          threadTitle={lockingThread.title}
          userEmail={lockingThread.user.email}
          isSubmitting={lockMutation.isPending}
        />
      )}
    </div>
  );
}