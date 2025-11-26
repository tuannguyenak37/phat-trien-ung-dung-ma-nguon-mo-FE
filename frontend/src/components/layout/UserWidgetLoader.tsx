// src/components/layout/right-panel/UserWidgetLoader.tsx
'use client';

import dynamic from 'next/dynamic';

// Thực hiện dynamic import tại đây (nơi được phép dùng ssr: false)
const UserWidget = dynamic(() => import('./UserWidget'), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full bg-[#050505] rounded-sm mb-8 border border-white/5 animate-pulse flex flex-col items-center justify-center gap-2">
       <div className="w-10 h-10 bg-white/5 rounded-full"></div>
       <div className="h-2 w-20 bg-white/5 rounded"></div>
    </div>
  ),
});

export default function UserWidgetLoader() {
  return <UserWidget />;
}