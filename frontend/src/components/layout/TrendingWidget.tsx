"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FireIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";

import { getThreads } from "@/lib/hook/getThreads";
import { IThread } from "@/types/thread";

export default function TrendingWidget() {
  const [trendingThreads, setTrendingThreads] = useState<IThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getThreads({
          page: 1,
          limit: 5,
          sort_by: "trending",
        });

        if (response?.data) {
          setTrendingThreads(response.data);
        }
      } catch (error) {
        console.error("Lỗi tải TrendingWidget:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =======================
      LOADING SKELETON
  ======================== */
  if (isLoading) {
    return (
      <div className="sticky top-24 rounded-2xl border border-blue-100 bg-white p-5 space-y-4">
        <div className="h-5 w-1/2 rounded bg-slate-200 animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2 animate-pulse">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (trendingThreads.length === 0) return null;

  /* =======================
        RENDER
  ======================== */
  return (
    <div className="sticky top-24 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-50 bg-slate-50/60 px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <FireIcon className="h-5 w-5 text-orange-500" />
          Chủ đề nổi bật
        </h3>
      </div>

      {/* List */}
      <ul className="divide-y divide-blue-50">
        {trendingThreads.map((thread, index) => {
          const rank = index + 1;
          const isTop = rank === 1;

          return (
            <li
              key={thread.thread_id}
              className={`
                relative px-5 py-4 transition-all
                hover:bg-blue-50/40 hover:shadow-sm hover:-translate-y-[1px]
                ${isTop ? "bg-orange-50/40" : ""}
              `}
            >
              {/* Rank */}
              <div className="absolute left-5 top-4">
                <span
                  className={`
                    flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold
                    ${
                      isTop
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {rank}
                </span>
              </div>

              {/* Content */}
              <div className="pl-9">
                <Link
                  href={`/Thread/${thread.category.slug}/${thread.slug}`}
                  className="block"
                >
                  <h4
                    className={`
                      mb-1 line-clamp-2 text-[13px] font-semibold leading-snug transition-colors
                      ${
                        isTop
                          ? "text-orange-700 hover:text-orange-600"
                          : "text-slate-700 hover:text-blue-600"
                      }
                    `}
                  >
                    {thread.title}
                  </h4>
                </Link>

                {/* Meta */}
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  {thread.category && (
                    <Link
                      href={`/Thread/categories/${thread.category.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="
                        rounded-md border border-blue-100 bg-blue-50
                        px-2 py-0.5 text-[10px] font-semibold text-blue-600
                        hover:bg-blue-100 transition-colors
                      "
                    >
                      {thread.category.name}
                    </Link>
                  )}

                  {isTop && (
                    <span className="flex items-center gap-1 text-orange-500 font-semibold">
                      <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
                      HOT
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="border-t border-blue-50 bg-slate-50/60 p-3">
        <Link
          href="/?sort_by=trending"
          className="
            flex w-full items-center justify-center gap-2 rounded-lg
            border border-transparent py-2 text-xs font-bold text-slate-600
            hover:border-blue-100 hover:bg-white hover:text-blue-600
            hover:shadow-sm transition-all
          "
        >
          Xem tất cả
          <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
