// components/layout/ForumLayout.tsx
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
    <div className="min-h-screen bg-blue-50/50 text-slate-900 font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#dbeafe_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Glow effects - Xanh pastel */}
      <div className="fixed top-0 left-0 -z-10 translate-x-[-50%] translate-y-[-50%] w-[500px] h-[500px] rounded-full bg-blue-300/25 blur-[100px]" />
      <div className="fixed bottom-0 right-0 -z-10 translate-x-[50%] translate-y-[50%] w-[500px] h-[500px] rounded-full bg-indigo-300/25 blur-[100px]" />

      {/* Navbar */}
      <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
        <Navbar />
      </div>

      {/* Main Grid */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full gap-6 pt-6 pb-20">

          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 custom-scrollbar">
              <Sidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

          {/* Right Panel */}
          <aside className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pl-2 custom-scrollbar">
              <RightPanel />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
