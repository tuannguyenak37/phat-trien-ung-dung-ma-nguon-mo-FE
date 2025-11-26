"use client";
import { useUser } from "@/lib/hook/useUser";

export default function UserGlobalListener() {
  // 👇 Gọi hook này để nó tự động fetch API và sync vào Store
  useUser();

  return null; // Không hiện gì ra màn hình cả
}
