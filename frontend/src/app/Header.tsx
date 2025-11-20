"use client";
import { useUser } from "@/lib/hook/useUser";

export default function Header() {
  // 👇 Hook này tự động lấy data từ cache hoặc fetch mới
  const { data: user, isLoading } = useUser();
  //   console.log(">>>>", user);
  if (isLoading) return <p>Checking...</p>;

  if (!user) return <button>Login</button>;

  return <div>Xin chào, {user.firstName}</div>;
}
