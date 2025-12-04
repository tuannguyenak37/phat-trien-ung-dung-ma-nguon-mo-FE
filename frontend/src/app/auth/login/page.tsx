"use client";
import React, { useState } from "react";
import Link from "next/link";
import TabNav from "../TabNav";
import banner from "../../../../public/login.jpg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form"; // ✨ Chuẩn hóa dùng Hook Form
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APILogin from "../../../lib/API/user";
import Loading from "../../../utils/loading/LoadingDots";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/tokenStore";
import { motion } from "framer-motion"; // ✨ Animation
import { toast } from "sonner"; // ✨ Toast
import { SocialButtons } from "../SocialButtons";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Setup React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => APILogin.APILogin(data),
    onSuccess: (res) => {
      const data = res.data;
      const userInfo = {
        user_id: data.user_id,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
     
        description:data.description,
         url_bg : data.url_bg,
        reputation_score: data.reputation_score
      };
      const token = data.access_token || data.accessToken;
      console.log(userInfo)
      setAuth(token, userInfo);
      queryClient.setQueryData(["user-profile"], data);
      
      toast.success(`Chào mừng trở lại, ${data.firstName}!`); // ✨ UX

      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/home");
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || "Đăng nhập thất bại. Kiểm tra lại thông tin.";
      toast.error(msg); // ✨ UX: Error Toast
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Banner - Animation Fade In */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#edfcff] to-white p-10 lg:flex relative"
      >
        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-square w-full rounded-2xl bg-cover bg-center shadow-2xl shadow-blue-900/10"
            style={{ backgroundImage: `url(${banner.src})` }}
          />
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Chào mừng trở lại!</h2>
            <p className="mt-2 text-gray-600">Hệ thống quản lý tối ưu cho công việc của bạn.</p>
          </div>
        </div>
      </motion.div>

      {/* Form - Animation Slide Up */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.2 }}
         className="flex w-full flex-col items-center justify-center bg-white p-6 lg:w-1/2"
      >
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Đăng nhập
            </h1>
            <p className="text-gray-500">Nhập email và mật khẩu của bạn để tiếp tục.</p>
          </div>

          <TabNav
            tabs={[
              { label: "Đăng nhập", href: "/auth/login" },
              { label: "Đăng ký", href: "/auth/resigner" },
            ]}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                {...register("email", { required: "Vui lòng nhập email" })}
                className={`w-full rounded-lg border px-4 py-3 outline-none transition-all focus:ring-2 ${
                    errors.email 
                      ? "border-red-500 focus:ring-red-200" 
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  }`}
                placeholder="name@example.com"
              />
               {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                 <label className="text-sm font-medium text-gray-900">Mật khẩu</label>
                 <a href="#" className="text-xs font-semibold text-primary hover:underline">Quên mật khẩu?</a>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Vui lòng nhập mật khẩu" })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loginMutation.isPending}
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-black shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-70 transition-all flex justify-center items-center gap-2"
            >
              {loginMutation.isPending ? <Loading /> : "Đăng nhập"}
            </motion.button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-500">Hoặc tiếp tục với</span></div>
          </div>

          <SocialButtons />

          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link href="/auth/resigner" className="font-semibold text-primary hover:underline hover:text-primary/80">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}