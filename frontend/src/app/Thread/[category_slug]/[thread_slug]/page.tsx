import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import api from "@/lib/API/thead"; 
import ThreadDetail from "@/components/ui/thread/ThreadDetail";

// 1. Cập nhật Interface Props: params là Promise
interface Props {
  params: Promise<{ 
    category_slug: string;
    thread_slug: string;
  }>;
}

// 2. Sửa generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // 👇 QUAN TRỌNG: Phải await params trước
    const { category_slug, thread_slug } = await params;

    const response: any = await api.public.getByFullSlug(category_slug, thread_slug);
    const thread = response.data || response; // Xử lý nếu api trả về axios object

    if (!thread) return { title: "Không tìm thấy bài viết" };

    return {
      title: thread.title,
      description: thread.content?.substring(0, 160).replace(/<[^>]*>?/gm, ''),
      openGraph: {
        title: thread.title,
        description: thread.content?.substring(0, 100),
        images: thread.media?.[0]?.file_url ? [thread.media[0].file_url] : [],
        url: `/${category_slug}/${thread_slug}`,
      },
    };
  } catch (error) {
    return { title: "Bài viết" };
  }
}

// 3. Sửa Page Component
export default async function ThreadSEOPage({ params }: Props) {
  // 👇 QUAN TRỌNG: Phải await params trước
  const { category_slug, thread_slug } = await params;

  let thread = null;
  try {
    const response: any = await api.public.getByFullSlug(category_slug, thread_slug);
    // Lấy data từ response (đề phòng axios trả về full object)
    thread = response.data || response;
  } catch (error) {
    console.error("Lỗi lấy bài viết:", error);
  }

  if (!thread) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <ThreadDetail initialData={thread} />
      </div>
    </main>
  );
}