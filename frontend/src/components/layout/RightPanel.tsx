// src/components/layout/RightPanel.tsx
import React from "react";
import Link from "next/link";
import {
  FireIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { FireIcon as FireIconSolid } from "@heroicons/react/24/solid";

// Import cái Loader cầu nối vào đây
import UserWidgetLoader from "./UserWidgetLoader";

// Component hiển thị Trending (Giữ nguyên Server Side để SEO tốt)
const TrendingWidget = () => (
  <div className="rounded-sm border border-red-900/20 bg-[#0a0a0a] overflow-hidden">
    {/* Header */}
    <div className="px-5 py-3 border-b border-red-900/20 flex items-center gap-2 bg-red-950/10">
      <FireIconSolid className="w-4 h-4 text-red-600 animate-pulse" />
      <h3 className="font-serif font-bold text-gray-300 tracking-wider text-xs uppercase">
        Burning Topics
      </h3>
    </div>

    {/* List */}
    <ul className="divide-y divide-red-900/10">
      {[
        {
          title: "Shadow of the Erdtree: Secret Bosses",
          replies: 342,
          tag: "Lore",
        },
        {
          title: "Best build for Messmer's Spear?",
          replies: 128,
          tag: "Builds",
        },
        { title: "Tragedy of the Hornsent", replies: 89, tag: "Story" },
      ].map((item, i) => (
        <li key={i}>
          <Link
            href="#"
            className="block px-5 py-3 hover:bg-red-900/10 transition-colors group"
          >
            <h4 className="text-xs font-medium text-gray-400 group-hover:text-red-300 transition-colors line-clamp-1">
              {item.title}
            </h4>
            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-600">
              <span className="text-yellow-700 border border-yellow-900/20 px-1 rounded bg-yellow-900/5">
                {item.tag}
              </span>
              <span className="flex items-center gap-1">
                <ChatBubbleLeftRightIcon className="w-3 h-3" /> {item.replies}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>

    {/* Footer Widget */}
    <div className="px-5 py-2 bg-[#050505] border-t border-red-900/20">
      <button className="w-full text-[10px] font-bold text-red-500/80 hover:text-red-400 uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
        View All <ArrowTrendingUpIcon className="w-3 h-3" />
      </button>
    </div>
  </div>
);

const RightPanel = () => {
  return (
    <aside className="w-full">
      {/* 1. Gọi Loader (Loader sẽ tự lo việc tắt SSR ở phía Client) */}
      <UserWidgetLoader />

      {/* 2. Trending Widget (Server Side - SEO Friendly) */}
      <TrendingWidget />

      {/* 3. Footer Links */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-gray-600 font-serif italic">
        <a href="#" className="hover:text-gray-400">
          Privacy
        </a>
        <span>•</span>
        <a href="#" className="hover:text-gray-400">
          Terms
        </a>
        <span>•</span>
        <span>© 2025 Messmer</span>
      </div>
    </aside>
  );
};

export default RightPanel;
