"use client";
import React, { useState } from "react";
import Link from "next/link";
import TabNav from "../TabNav";
import banner from "../../../../public/login.jpg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import APIUser from "../../../lib/API/user";
import Loading from "../../../utils/loading/LoadingDots";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // ✨ Animation
import { toast } from "sonner"; // ✨ Toast
import { SocialButtons } from "../SocialButtons";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const password = useWatch({ control, name: "password", defaultValue: "" });

  const registerMutation = useMutation({
    mutationFn: (data: any) => APIUser.APIResigner(data),
    onSuccess: () => {
      toast.success("Đăng ký thành công! Đang chuyển hướng..."); // ✨ UX: Feedback rõ ràng
      setTimeout(() => router.push("/auth/login"), 1500);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.detail || "Đăng ký thất bại, vui lòng thử lại.";
      toast.error(message);
    },
  });

  const onSubmit = (data: FormData) => {
    const { confirmPassword, ...dataFetch } = data;
    registerMutation.mutate(dataFetch);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Banner Section - Animation fade in */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#edfcff] to-white p-10 lg:flex relative overflow-hidden"
      >
         <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="w-full max-w-md space-y-8 z-10">
          <div
            className="aspect-square w-full rounded-2xl bg-cover bg-center shadow-2xl shadow-blue-900/10"
            style={{ backgroundImage: `url(${banner.src})` }}
          />
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Chào mừng bạn!</h2>
            <p className="mt-2 text-gray-600">Bắt đầu hành trình của bạn ngay hôm nay.</p>
          </div>
        </div>
      </motion.div>

      {/* Form Section - Animation slide up */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex w-full flex-col items-center justify-center bg-white p-6 lg:w-1/2"
      >
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
             {/* SEO: H1 cho tiêu đề chính */}
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Tạo tài khoản mới
            </h1>
            <p className="text-gray-500">Nhập thông tin chi tiết bên dưới.</p>
          </div>

          <TabNav
            tabs={[
              { label: "Đăng nhập", href: "/auth/login" },
              { label: "Đăng ký", href: "/auth/resigner" },
            ]}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Email</label>
              <input
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" },
                })}
                className={`w-full rounded-lg border px-4 py-3 outline-none transition-all focus:ring-2 ${
                  errors.email 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-200 focus:border-primary focus:ring-primary/20"
                }`}
                placeholder="name@example.com"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Nhập mật khẩu", minLength: { value: 6, message: "Tối thiểu 6 ký tự" } })}
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

             {/* Confirm Password Field */}
             <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword", {
                     required: "Xác nhận mật khẩu",
                     validate: (val) => val === password || "Mật khẩu không khớp"
                  })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-900">Họ</label>
                <input
                   {...register("lastName", { required: "Nhập họ" })}
                   className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                   placeholder="Nguyễn"
                />
                 {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-900">Tên</label>
                <input
                   {...register("firstName", { required: "Nhập tên" })}
                   className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                   placeholder="Văn A"
                />
                 {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={registerMutation.isPending}
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-black shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-70 transition-all flex justify-center items-center gap-2"
            >
              {registerMutation.isPending ? <Loading /> : "Đăng ký tài khoản"}
            </motion.button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-500">Hoặc đăng ký với</span></div>
          </div>

          <SocialButtons />

          <p className="text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline hover:text-primary/80">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}