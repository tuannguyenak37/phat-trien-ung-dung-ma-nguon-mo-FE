// src/components/layout/Sidebar.tsx
import React from "react";
import Link from "next/link";
import { 
  HomeIcon, 
  FireIcon, 
  HashtagIcon, 
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const menuItems = [
    { name: 'Bảng tin', icon: HomeIcon, href: '/' },
    { name: 'Phổ biến', icon: FireIcon, href: '/popular' },
    { name: 'Chủ đề', icon: HashtagIcon, href: '/topics' },
    { name: 'Thảo luận', icon: ChatBubbleLeftRightIcon, href: '/discussions' },
    { name: 'Đã lưu', icon: BookmarkIcon, href: '/saved' },
    { name: 'Cộng đồng', icon: UserGroupIcon, href: '/communities' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 sticky top-20 h-[calc(100vh-5rem)] pr-6 py-2 overflow-y-auto custom-scrollbar">
      
      {/* Navigation Menu */}
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu</h3>
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all group"
          >
            <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Separator */}
      <div className="my-6 border-t border-gray-100 mx-3"></div>

      {/* Tags Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Thẻ nổi bật</h3>
        <div className="flex flex-wrap gap-2 px-3">
          {['#design', '#nextjs', '#react', '#showcase', '#hoidap', '#job'].map(tag => (
            <Link 
                key={tag} 
                href={`/tag/${tag.replace('#', '')}`}
                className="text-xs font-medium bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg cursor-pointer border border-gray-100 hover:bg-white hover:border-primary/30 hover:text-primary hover:shadow-sm transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer nhỏ */}
      <div className="mt-auto px-3 pt-6 pb-4">
        <p className="text-[10px] text-gray-400">
           © 2025 Messmer Inc. <br/>
           All rights reserved.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;