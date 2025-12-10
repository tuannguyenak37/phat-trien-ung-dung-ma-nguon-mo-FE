// app/page.tsx
import React from "react";
import { getThreads } from "@/lib/hook/getThreads";
import InfiniteFeed from "@/components/ui/InfiniteFeed";
import CreateThreadForm from "@/components/ui/CreateThreadForm";
import { FeedWrapper } from "@/components/layout/FeedWrapper";
import { ArrowPathIcon, FunnelIcon } from "@heroicons/react/24/solid";

interface HomeProps {
  searchParams: Promise<{ 
    tag?: string; 
    category_id?: string;
    sort_by?: "mix" | "newest" | "trending";
  }>;
}

export default async function Home(props: HomeProps) {

  const searchParams = await props.searchParams;

  const tag = searchParams.tag;
  const category_id = searchParams.category_id;
  const sort_by = searchParams.sort_by || "mix";

  let apiResponse = null;

  try {
    apiResponse = await getThreads({
      page: 1,
      limit: 10,
      sort_by: sort_by as any,
      tag,
      category_id,
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }

  let title = "Bảng tin";
  let subtitle = "Mới nhất";

  if (tag) {
    title = `#${tag}`;
    subtitle = "Lọc theo thẻ";
  } else if (category_id) {
    title = "Danh mục";
    subtitle = "Lọc theo chủ đề";
  } else if (sort_by === "trending") {
    title = "Thịnh hành";
    subtitle = "Hot tuần này";
  }

  if (!apiResponse) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-4 bg-red-100/60 rounded-full shadow-sm">
          <ArrowPathIcon className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Không thể tải bảng tin
          </h3>
          <p className="text-slate-500 text-sm">
            Vui lòng kiểm tra kết nối và thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto">
      <FeedWrapper>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            {(tag || category_id) && (
              <FunnelIcon className="w-6 h-6 text-blue-500" />
            )}
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
          </div>

          <span className="text-xs sm:text-sm font-medium text-slate-600 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm backdrop-blur-sm">
            {subtitle}
          </span>
        </div>

        {/* Form tạo bài viết */}
        {!tag && !category_id && (
          <div className="bg-white/90 rounded-xl shadow-sm border border-slate-200/60 p-4 mb-6 hover:shadow-md transition-all">
            <CreateThreadForm />
          </div>
        )}

        {/* Divider */}
        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200/60"></div>
          </div>
        </div>

        {/* Feed */}
        <div className="min-h-[500px]">
          <InfiniteFeed
            initialData={apiResponse}
            fetchData={getThreads}
            sort_by={sort_by as any}
            tag={tag}
            category_id={category_id}
          />
        </div>
      </FeedWrapper>
    </section>
  );
}
