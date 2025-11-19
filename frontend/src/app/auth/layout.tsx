// src/app/pages/login/layout.tsx (HOẶC src/app/login/layout.tsx)
import React from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Đây là cấu trúc cơ bản nhất
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full flex-1">
            {/* Bố cục chính của trang (Layout) 
                Ở đây, chính là grid 1-2
            */}
            <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
                
                {/* Panel Left: Luôn hiển thị trong Layout vì nó cố định */}
                <div className="relative hidden flex-col items-center justify-center bg-primary/10 p-10 lg:flex dark:bg-primary/20">
                    <div className="w-full max-w-md space-y-8">
                        {/* Hình minh họa */}
                        <div
                            className="aspect-square w-full rounded-xl bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgAq3FHpL0kLXbsRQqbj3MdltTr7-CJ3GHPAEtcgayIqHDvyRUXU7b6AZme4mjytlbx60UOmcwNeSciNHYRR-Fd-sH4f5qGt3Js_Sak3YyiSHB5iwGO8eJFj1ih-UIZJT4tgP8I6mIdhUSR4cJXFLsjfYZw62SIARbuBEVjCWb-eq15XcqlqUVnH25z2vvxRF4cbpaatbCwpHXdBctljh4y9vtwKnDhFhwNMmyYs4cuDGvCJGhaq70YxyD-eAef3ff_Yb_L-6Elkg")' }}
                        ></div>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Unlock Your Creativity</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">Join our community and start creating something amazing today.</p>
                        </div>
                    </div>
                </div>

                {/* Panel Right: Chứa nội dung trang con (Đăng nhập/Đăng ký) */}
                <div className="flex w-full items-center justify-center bg-white p-6 sm:p-12 dark:bg-background-dark">
                    <div className="w-full max-w-md space-y-6">
                        {/* CHILDREN: Nơi page.tsx (Login/Register) sẽ được render */}
                        {children} 
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}