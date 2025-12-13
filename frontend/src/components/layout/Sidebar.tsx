"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Import hook để lấy params hiện tại
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/API/category";
import {
  HomeIcon,
  FireIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

// Interfaces
interface Category {
  category_id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Tag {
  tag_id: string;
  name: string;
}

const menuItems = [
  { name: "Trang chủ", icon: HomeIcon, href: "/home" },
  { name: "Trending", icon: FireIcon, href: "/home?sort_by=trending" }, 
   { name: "Mới nhất", icon: FireIcon, href: "/home?sort_by=newest" }
];

const Sidebar = () => {
  // 1. Lấy params từ URL để biết cái nào đang active
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");
  const currentCatId = searchParams.get("category_id");
  const currentSort = searchParams.get("sort_by");

  // 2. Fetch Tags
  const { data: popularTags } = useQuery({
    queryKey: ["popularTags"],
    queryFn: async () => {
      const res = await categoryService.tagPopular(); 
      return res as unknown as Tag[]; 
    },
  });

  // 3. Fetch Categories
  const { data: popularCategories } = useQuery({
    queryKey: ["popularCategories"],
    queryFn: async () => {
      const res = await categoryService.categoriesPopular();
      return res as unknown as Category[];
    },
  });

  // Helper check active class
  const isActive = (path: string) => {
      // Logic đơn giản: check xem đường dẫn hiện tại có khớp không
      if (path === "/home" && !currentTag && !currentCatId && !currentSort) return true;
      return false;
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 sticky top-20 h-[calc(100vh-5rem)] pr-6 py-2 overflow-y-auto custom-scrollbar">
      {/* Navigation Menu */}
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Menu
        </h3>
        {menuItems.map((item) => {
             const active = isActive(item.href);
             return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                    active 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${active ? "text-blue-600" : "group-hover:text-blue-600"}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
          )
        })}
      </div>

      <div className="my-6 border-t border-gray-100 mx-3"></div>

      {/* Categories Section */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Danh mục nổi bật
        </h3>
        <div className="space-y-1">
          {popularCategories?.map((cat) => {
            // Check active category
            const isCatActive = currentCatId === cat.category_id;
            
            return (
              <Link
                key={cat.category_id}
                // CHUYỂN LINK VỀ TRANG CHỦ KÈM PARAM CATEGORY_ID
                href={`/home?category_id=${cat.category_id}`} 
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                    isCatActive 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <FolderIcon className={`w-4 h-4 ${isCatActive ? "text-blue-500" : "text-gray-400 group-hover:text-blue-500"}`} />
                <span className="text-sm truncate" title={cat.name}>
                  {cat.name}
                </span>
              </Link>
            )
          })}
          
          {!popularCategories && (
            <div className="px-3 space-y-2">
               <div className="h-8 bg-gray-100 rounded-lg w-full animate-pulse"></div>
               <div className="h-8 bg-gray-100 rounded-lg w-3/4 animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Thẻ nổi bật
        </h3>
        <div className="flex flex-wrap gap-2 px-3">
          {popularTags?.map((tag) => {
             // Check active tag
             const isTagActive = currentTag === tag.name;

             return (
                <Link
                  key={tag.tag_id}
                  // CHUYỂN LINK VỀ TRANG CHỦ KÈM PARAM TAG
                  href={`/home?tag=${tag.name}`}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-lg cursor-pointer border transition-all ${
                      isTagActive
                      ? "bg-blue-100 text-blue-700 border-blue-200 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-white hover:border-blue-200 hover:text-blue-600 hover:shadow-sm"
                  }`}
                >
                  #{tag.name}
                </Link>
             )
          })}
           
           {!popularTags && (
             <div className="flex gap-2 px-3">
                <div className="h-6 w-12 bg-gray-100 rounded-md animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-100 rounded-md animate-pulse"></div>
             </div>
          )}
        </div>
      </div>

      <div className="mt-auto px-3 pt-6 pb-4">
        <p className="text-[10px] text-gray-400">
          © 2025 Messmer Inc. <br />
          All rights reserved.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;