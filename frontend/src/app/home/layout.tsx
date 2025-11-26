import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Dùng thẻ div bao ngoài cùng, thiết lập nền tối ở đây
    <div className="min-h-screen bg-[#050505] text-gray-300 selection:bg-red-900 selection:text-white">
      {/* Hiệu ứng nền (Background Ambience) - Đặt ở đây để chỉ áp dụng cho layout này */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-900/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-900/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Grid Layout 3 cột */}
      <div className="relative z-10 container mx-auto px-4 lg:px-6 flex gap-8 pt-6 pb-10">
        {/* Left Sidebar - Sticky */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>

        {/* Right Sidebar - Sticky */}
        <aside className="hidden xl:block w-80 shrink-0">
          <div className="sticky top-24">
            <RightPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
