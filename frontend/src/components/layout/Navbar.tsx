import React from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { FireIcon as FireIconSolid } from "@heroicons/react/24/solid";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505] border-b border-red-900/40 shadow-[0_10px_30px_-10px_rgba(220,38,38,0.15)] backdrop-blur-xl">
      {/* Texture nền hạt (Noise) để tạo độ nhám điện ảnh */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between relative z-10">
        {/* --- 1. LOGO: SERPENT & FIRE --- */}
        <Link href="/" className="flex items-center gap-4 group">
          {/* Container Logo */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Lớp nền đen tròn phía sau */}
            <div className="absolute inset-1 rounded-full bg-black shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>

            {/* SVG CON RẮN VÀNG (Custom drawn SVG) */}
            <svg
              viewBox="0 0 100 100"
              className="absolute w-16 h-16 text-yellow-600/80 drop-shadow-md group-hover:text-yellow-500 transition-colors duration-500"
            >
              {/* Thân rắn cuộn tròn */}
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                d="M 50 90 C 25 90 10 70 10 50 C 10 30 25 10 50 10 C 70 10 85 20 90 40"
                className="opacity-80"
              />
              {/* Đầu rắn (giả lập hình tam giác cách điệu ở trên) */}
              <path
                fill="currentColor"
                d="M 90 40 L 95 30 L 85 30 Z"
                className="origin-center rotate-12"
              />
              {/* Vảy rắn (Các chấm nhỏ trang trí dọc thân) */}
              <circle cx="20" cy="50" r="1.5" fill="currentColor" />
              <circle cx="30" cy="80" r="1.5" fill="currentColor" />
              <circle cx="50" cy="88" r="1.5" fill="currentColor" />
            </svg>

            {/* Ngọn lửa ở tâm */}
            <FireIconSolid className="relative w-6 h-6 text-red-600 animate-pulse drop-shadow-[0_0_8px_#ef4444]" />
          </div>

          {/* Tên thương hiệu */}
          <div className="flex flex-col">
            <h1 className="font-serif text-2xl font-bold tracking-[0.15em] text-gray-100 uppercase leading-none group-hover:text-red-500 transition-colors drop-shadow-sm">
              Messmer
            </h1>
            {/* Đường gạch trang trí thay cho chữ cũ */}
            <div className="w-full h-[2px] mt-1 gradient-to-r from-red-900 via-red-600 to-transparent opacity-60"></div>
          </div>
        </Link>

        {/* --- 2. MENU NAVIGATION --- */}
        <nav className="hidden md:flex items-center gap-1">
          {["Forums", "Gallery", "Members"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="relative px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group/nav"
            >
              <span className="relative z-10">{item}</span>

              {/* Hiệu ứng nền khi hover: Lửa cháy mờ từ dưới lên */}
              <div className="absolute inset-0 gradient-to-t from-red-900/40 to-transparent opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 rounded-lg"></div>

              {/* Hiệu ứng viền đáy sáng rực */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-red-500 group-hover/nav:w-3/4 transition-all duration-300 shadow-[0_0_10px_#ef4444]"></div>
            </Link>
          ))}
        </nav>

        {/* --- 3. RIGHT ACTIONS --- */}
        <div className="flex items-center gap-5">
          {/* SEARCH BOX: Đã sửa lại cho rõ nét */}
          <div className="hidden lg:block relative group w-64">
            {/* Viền ngoài input với hiệu ứng focus */}
            <div className="absolute -inset-0.5 gradient-to-r from-red-900 to-gray-800 rounded-md opacity-30 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500 blur-[1px]"></div>

            <div className="relative flex items-center bg-[#0f0f0f] rounded-md overflow-hidden border border-gray-800 group-focus-within:border-red-700 transition-colors">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 ml-3 mr-2" />
              <input
                type="text"
                placeholder="Search topic..."
                className="w-full bg-transparent text-gray-100 text-sm py-2 placeholder-gray-500 outline-none font-medium"
              />
            </div>
          </div>

          <div className="h-6 w-[1px] bg-gray-800 mx-1"></div>

          {/* User & Notification */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-red-500 transition-colors">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_5px_#dc2626]"></span>
            </button>

            <button className="flex items-center gap-2 group pl-1">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-900 p-[1px] group-hover:from-red-600 group-hover:to-orange-500 transition-all">
                <img
                  src="https://api.dicebear.com/9.x/avataaars/svg?seed=Messmer"
                  alt="User"
                  className="rounded-full bg-black object-cover h-full w-full"
                />
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors hidden sm:block" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-gray-300">
            <Bars3Icon className="w-7 h-7" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
