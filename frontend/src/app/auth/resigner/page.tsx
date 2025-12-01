"use client";
import React, { useState } from "react";
import TabNav from "../TabNav";
import Link from "next/link";
import banner from "../../../../public/login.jpg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import APIUser from "../../../lib/API/user";
import Loading from "../../../utils/loading/LoadingDots";
import { useRouter } from "next/navigation";

const GoogleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path
      d="M22.5714 12.2727C22.5714 11.4545 22.5 10.6364 22.3571 9.81818H12V14.4545H18.0714C17.8214 15.8182 17.0357 16.9773 15.8928 17.7727V20.3636H19.6428C21.5714 18.5795 22.5714 15.6818 22.5714 12.2727Z"
      fill="#4285F4"
    />
    <path
      d="M12 23C15.25 23 17.9643 21.9091 19.6428 20.3636L15.8928 17.7727C14.7857 18.5 13.4643 18.9545 12 18.9545C9.07142 18.9545 6.60714 17.0227 5.71428 14.4545H1.85714V17.0455C3.57142 20.5909 7.46428 23 12 23Z"
      fill="#34A853"
    />
    <path
      d="M5.71428 14.4545C5.46428 13.7273 5.32142 12.9545 5.32142 12.1818C5.32142 11.4091 5.46428 10.6364 5.71428 9.90909V7.31818H1.85714C1.32142 8.36364 1 9.54545 1 10.8182C1 12.0909 1.32142 13.2727 1.85714 14.3182L5.71428 14.4545Z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.40909C13.5714 5.40909 15.0357 5.95455 16.2143 7.04545L19.7143 3.63636C17.9643 1.95455 15.25 1 12 1C7.46428 1 3.57142 3.40909 1.85714 6.95455L5.71428 9.54545C6.60714 6.97727 9.07142 5.04545 12 5.04545H12V5.40909Z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path
      d="M22 12.062C22 6.497 17.502 2 11.938 2C6.374 2 1.875 6.497 1.875 12.062C1.875 17.086 5.56 21.233 10.125 21.96V14.968H7.234V12.062H10.125V9.835C10.125 6.955 11.821 5.438 14.411 5.438C15.658 5.438 16.922 5.648 16.922 5.648V8.12H15.541C14.16 8.12 13.734 9.03 13.734 10.16V12.063H16.79L16.353 14.968H13.733V21.96C18.299 21.233 22 17.086 22 12.062Z"
      fill="#1877F2"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      clipRule="evenodd"
      d="M15.333 9.437C15.333 7.96 16.537 6.43 18.254 6.43C19.957 6.43 21.163 7.915 21.163 9.437C21.163 10.946 20.01 12.446 18.298 12.446C16.586 12.446 15.333 10.976 15.333 9.437Z"
      fillRule="evenodd"
    />
  </svg>
);


type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};
type dataFeth = {
  email: string;
  password: string;

  firstName: string;
  lastName: string;
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 const router = useRouter()
  const fethResiger = useMutation({
    mutationFn: (data: dataFeth) => {
      return APIUser.APIResigner(data);
    },
    onSuccess: () => {router.push("/auth/login")},
    onError: (err) => console.log("loooix", err),
  });

  const {
    register,
    handleSubmit,
    control, // 👈 thêm dòng này

    formState: { errors },
  } = useForm<FormData>();

  const password = useWatch({ control, name: "password", defaultValue: "" });
 
  const onSubmit = (data: FormData) => {
    const data_f: dataFeth = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    fethResiger.mutate(data_f);
  };

  return (
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
      {/* Banner */}
      <div className="relative hidden flex-col items-center justify-center bg-primary/10 p-10 lg:flex bg-linear-to-r from-[#edfcff] to-[#ffffff]">
        <div className="w-full max-w-md space-y-8">
          <div
            className="aspect-square w-full rounded-xl bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${banner.src})` }}
          ></div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Chào bạn!</h2>
            <p className="mt-2 text-gray-600">
              Hãy tạo tài khoản mới để bắt đầu.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex w-full items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-[#111318] text-4xl font-black leading-tight tracking-[-0.033em]">
              Tạo tài khoản mới
            </p>
            <p className="text-[#616f89] text-base font-normal leading-normal">
              Nhập thông tin của bạn để đăng ký.
            </p>
          </div>

          <TabNav
            tabs={[
              { label: "Đăng nhập", href: "/auth/login" },
              { label: "Đăng ký", href: "/auth/resigner" },
            ]}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <label className="flex flex-col">
              <span className="text-[#111318] text-base font-medium pb-2">
                Email
              </span>
              <input
                type="email"
                placeholder="Nhập email"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ",
                  },
                })}
                className="form-input w-full rounded-lg border border-[#dbdfe6] p-4 text-base text-[#111318] placeholder:text-[#616f89] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </label>

            {/* Password */}
            <label className="flex flex-col">
              <span className="text-[#111318] text-base font-medium pb-2">
                Mật khẩu
              </span>
              <div className="flex w-full items-stretch">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength: { value: 6, message: "Mật khẩu >= 6 ký tự" },
                  })}
                  className="form-input flex w-full rounded-l-lg border border-r-0 border-[#dbdfe6] p-4 text-base text-[#111318] placeholder:text-[#616f89] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                />
                <div
                  className="flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-[#dbdfe6] bg-white px-4 text-[#616f89]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </label>

            {/* Confirm Password */}
            <label className="flex flex-col">
              <span className="text-[#111318] text-base font-medium pb-2">
                Xác nhận mật khẩu
              </span>
              <div className="flex w-full items-stretch">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  {...register("confirmPassword", {
                    required: "Xác nhận mật khẩu là bắt buộc",
                    validate: (value) =>
                      value === password || "Mật khẩu không khớp",
                  })}
                  className="form-input flex w-full rounded-l-lg border border-r-0 border-[#dbdfe6] p-4 text-base text-[#111318] placeholder:text-[#616f89] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                />
                <div
                  className="flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-[#dbdfe6] bg-white px-4 text-[#616f89]"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Last Name */}
              <label className="flex flex-col">
                <span className="text-[#111318] text-base font-medium pb-2">
                  Họ
                </span>
                <input
                  type="text"
                  placeholder="Nhập họ"
                  {...register("lastName", { required: "Họ là bắt buộc" })}
                  className="form-input w-full rounded-lg border border-[#dbdfe6] p-4 text-base text-[#111318] placeholder:text-[#616f89] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </label>

              {/* First Name */}
              <label className="flex flex-col">
                <span className="text-[#111318] text-base font-medium pb-2">
                  Tên
                </span>
                <input
                  type="text"
                  placeholder="Nhập tên"
                  {...register("firstName", { required: "Tên là bắt buộc" })}
                  className="form-input w-full rounded-lg border border-[#dbdfe6] p-4 text-base text-[#111318] placeholder:text-[#616f89] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </label>
              {/* 👇 HIỂN THỊ LỖI TRỰC TIẾP TẠI ĐÂY 👇 */}
              {fethResiger.isError && (
                <p className="text-red-500 mt-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(fethResiger.error as any)?.response?.data?.detail ||
                    "Lỗi rồi"}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex h-14 w-full items-center bg-gray-700 border-gray-200 justify-center gap-2 rounded-xl bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
            >
              Đăng ký {fethResiger.isPending ? <Loading /> : ""}
            </button>
          </form>

          {/* Social */}
          <div className="flex items-center gap-4">
            <hr className="w-full border-gray-200" />
            <span className="shrink-0 text-sm text-gray-500">
              Hoặc tiếp tục với
            </span>
            <hr className="w-full border-gray-200" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="flex h-12 items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <GoogleIcon /> Google
            </button>
            <button className="flex h-12 items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FacebookIcon /> Facebook
            </button>
            <button className="flex h-12 items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <AppleIcon /> Apple
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Đã có tài khoản?
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
