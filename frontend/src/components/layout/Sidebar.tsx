"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/API/category";

import {
  Squares2X2Icon,      // Trang chủ
  ArrowTrendingUpIcon, // Trending
  ClockIcon,           // Mới nhất
  RectangleGroupIcon,  // Danh mục
  TagIcon,             // Thẻ
} from "@heroicons/react/24/outline";

/* =======================
   Interfaces
======================= */
interface Category {
  category_id: string;
  name: string;
  slug: string;
}

interface Tag {
  tag_id: string;
  name: string;
}

/* =======================
   Menu config
======================= */
const menuItems = [
  {
    name: "Trang chủ",
    icon: Squares2X2Icon,
    href: "/home",
    sort: null as string | null,
  },
  {
    name: "Trending",
    icon: ArrowTrendingUpIcon,
    href: "/home?sort_by=trending",
    sort: "trending",
  },
  {
    name: "Mới nhất",
    icon: ClockIcon,
    href: "/home?sort_by=newest",
    sort: "newest",
  },
];

export default function Sidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort_by");
  const currentTag = searchParams.get("tag");
  const currentCatId = searchParams.get("category_id");

  /* =======================
     Queries
  ======================= */
  const { data: popularTags } = useQuery({
    queryKey: ["popularTags"],
    queryFn: async () => {
      const res = await categoryService.tagPopular();
      return res as Tag[];
    },
  });

  const { data: popularCategories } = useQuery({
    queryKey: ["popularCategories"],
    queryFn: async () => {
      const res = await categoryService.categoriesPopular();
      return res as Category[];
    },
  });

  /* =======================
     Helpers
  ======================= */
  const isMenuActive = (sort: string | null) => {
    if (
      sort === null &&
      pathname === "/home" &&
      !currentSort &&
      !currentTag &&
      !currentCatId
    ) {
      return true;
    }
    return currentSort === sort;
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col sticky top-20 h-[calc(100vh-5rem)] pr-6 py-3 overflow-y-auto custom-scrollbar">
      {/* ================= MENU ================= */}
      <section>
        <h3 className="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Điều hướng
        </h3>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const active = isMenuActive(item.sort);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200
                  ${
                    active
                      ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-blue-600"
                  }`}
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="my-6 mx-3 border-t border-gray-100" />

      {/* ================= CATEGORIES ================= */}
      <section className="mb-6">
        <h3 className="px-3 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Danh mục nổi bật
        </h3>

        <div className="space-y-1">
          {popularCategories?.map((cat) => {
            const active = currentCatId === cat.category_id;

            return (
              <Link
                key={cat.category_id}
                href={`/home?category_id=${cat.category_id}`}
                className={`
                  group flex items-center gap-3 px-3 py-2 rounded-lg
                  transition-all
                  ${
                    active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }
                `}
              >
                <RectangleGroupIcon
                  className={`w-4 h-4 transition-colors ${
                    active
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-blue-500"
                  }`}
                />
                <span className="text-sm truncate">{cat.name}</span>
              </Link>
            );
          })}

          {!popularCategories && (
            <div className="px-3 space-y-2">
              <div className="h-8 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-8 w-3/4 rounded-lg bg-gray-100 animate-pulse" />
            </div>
          )}
        </div>
      </section>

      {/* ================= TAGS ================= */}
      <section>
        <h3 className="px-3 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Thẻ nổi bật
        </h3>

        <div className="flex flex-wrap gap-2 px-3">
          {popularTags?.map((tag) => {
            const active = currentTag === tag.name;

            return (
              <Link
                key={tag.tag_id}
                href={`/home?tag=${tag.name}`}
                className={`
                  inline-flex items-center gap-1
                  rounded-lg border px-2.5 py-1.5 text-xs font-medium
                  transition-all
                  ${
                    active
                      ? "bg-blue-100 text-blue-700 border-blue-200 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-white hover:border-blue-200 hover:text-blue-600 hover:shadow-sm"
                  }
                `}
              >
                <TagIcon className="w-3 h-3 opacity-70" />
                {tag.name}
              </Link>
            );
          })}

          {!popularTags && (
            <div className="flex gap-2">
              <div className="h-6 w-12 rounded-md bg-gray-100 animate-pulse" />
              <div className="h-6 w-16 rounded-md bg-gray-100 animate-pulse" />
            </div>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto px-3 pt-6 pb-4">
        <p className="text-[10px] leading-relaxed text-gray-400">
          © 2025 Messmer Inc.
          <br />
          All rights reserved.
        </p>
      </footer>
    </aside>
  );
}
