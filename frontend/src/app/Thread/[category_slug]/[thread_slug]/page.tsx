// src/app/[category_slug]/[thread_slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import api from "@/lib/API/thead"; 
import ThreadDetail from "@/components/ui/thread/ThreadDetail";

interface Props {
  params: Promise<{ 
    category_slug: string;
    thread_slug: string;
  }>;
}

// ... (Giữ nguyên phần generateMetadata)

export default async function ThreadSEOPage({ params }: Props) {
  const { category_slug, thread_slug } = await params;

  let thread = null;
  try {
    const response: any = await api.public.getByFullSlug(category_slug, thread_slug);
    thread = response.data || response;
  } catch (error) {
    console.error("Lỗi lấy bài viết:", error);
  }

  if (!thread) return notFound();

  return (
    // THAY ĐỔI Ở ĐÂY:
    // 1. flex flex-col: Để component con (ThreadDetail) có thể dùng flex-1 và bung ra hết cỡ.
    // 2. h-[calc(100vh-64px)]: Chiều cao cố định (trừ header).
    // 3. Không dùng overflow-hidden ở đây, để ThreadDetail tự xử lý scroll.
    <main className="w-full flex flex-col h-[calc(100vh-64px)] bg-[#F0F2F5]">
      <ThreadDetail initialData={thread} />
    </main>
  );
}