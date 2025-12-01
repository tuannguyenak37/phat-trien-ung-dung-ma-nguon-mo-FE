"use client";
import React, { useState } from "react";
// Import Framer Motion
import { motion, Variants } from "framer-motion";
import TabNav from "../TabNav";
import banner from "../../../../public/login.jpg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APILogin from "../../../lib/API/user";
import Loading from "../../../utils/loading/LoadingDots";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuthStore } from "@/lib/store/tokenStore";

// --- Icon Components (Giữ nguyên) ---
const GoogleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path
      d="M22.5714 12.2727C22.5714 11.4545 22.5 10.6364 22.3571 9.81818H12V14.4545H18.0714C17.8214 15.8182 17.0357 16.9773 15.8928 17.7727V20.3636H19.6428C21.5714 18.5795 22.5714 15.6818 22.5714 12.2727Z"
      fill="#4285F4"
    />{" "}
    <path
      d="M12 23C15.25 23 17.9643 21.9091 19.6428 20.3636L15.8928 17.7727C14.7857 18.5 13.4643 18.9545 12 18.9545C9.07142 18.9545 6.60714 17.0227 5.71428 14.4545H1.85714V17.0455C3.57142 20.5909 7.46428 23 12 23Z"
      fill="#34A853"
    />{" "}
    <path
      d="M5.71428 14.4545C5.46428 13.7273 5.32142 12.9545 5.32142 12.1818C5.32142 11.4091 5.46428 10.6364 5.71428 9.90909V7.31818H1.85714C1.32142 8.36364 1 9.54545 1 10.8182C1 12.0909 1.32142 13.2727 1.85714 14.3182L5.71428 14.4545Z"
      fill="#FBBC05"
    />{" "}
    <path
      d="M12 5.40909C13.5714 5.40909 15.0357 5.95455 16.2143 7.04545L19.7143 3.63636C17.9643 1.95455 15.25 1 12 1C7.46428 1 3.57142 3.40909 1.85714 6.95455L5.71428 9.54545C6.60714 6.97727 9.07142 5.04545 12 5.04545H12V5.40909Z"
      fill="#EA4335"
    />{" "}
  </svg>
);
const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path
      d="M22 12.062C22 6.497 17.502 2 11.938 2C6.374 2 1.875 6.497 1.875 12.062C1.875 17.086 5.56 21.233 10.125 21.96V14.968H7.234V12.062H10.125V9.835C10.125 6.955 11.821 5.438 14.411 5.438C15.658 5.438 16.922 5.648 16.922 5.648V8.12H15.541C14.16 8.12 13.734 9.03 13.734 10.16V12.063H16.79L16.353 14.968H13.733V21.96C18.299 21.233 22 17.086 22 12.062Z"
      fill="#1877F2"
    />{" "}
  </svg>
);
const AppleIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      clipRule="evenodd"
      d="M15.333 9.437C15.333 7.96 16.537 6.43 18.254 6.43C19.957 6.43 21.163 7.915 21.163 9.437C21.163 10.946 20.01 12.446 18.298 12.446C16.586 12.446 15.333 10.976 15.333 9.437ZM14.07 15.918C14.475 15.918 14.808 16.23 14.808 16.635C14.808 17.038 14.475 17.35 14.07 17.35C13.666 17.35 13.333 17.038 13.333 16.635C13.333 16.23 13.666 15.918 14.07 15.918Z"
      fillRule="evenodd"
    />{" "}
  </svg>
);
// --- Kết thúc Icon Components ---

// --- FRAMER MOTION VARIANTS (Đã sửa lỗi TypeScript) ---
const formContainerVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { // Transition cho component CHA
      // Dùng staggerChildren để tạo độ trễ giữa các component CON
      staggerChildren: 0.08, 
      when: "beforeChildren", // Tùy chọn: Animation cha kết thúc rồi mới đến con
      type: "spring", 
      stiffness: 100, 
      damping: 20,
      delay: 0.1, // Trễ nhẹ khi lần đầu load trang
    },
  },
  // Hiệu ứng rung nhẹ khi có lỗi
  wiggle: {
    x: [0, -10, 10, -8, 8, 0],
    transition: {
      type: "spring",
      stiffness: 1000,
      damping: 10,
      duration: 0.5,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
    }
  },
};
// --- KẾT THÚC VARIANTS ---

export default function LoginPage() {
  const router = useRouter();
  
  interface formData {
    email: string;
    password: string;
  }
  interface LoginErr {
    detail: string;
  }
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  // --- LOGIC MANTATION (Giữ nguyên) ---
  const fethLogin = useMutation({
    mutationFn: (data: formData) => APILogin.APILogin(data),
    onSuccess: (res) => {
      console.log(res);
      const data = res.data;

      const userInfo = {
        user_id: data.user_id,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      const token = data.access_token || data.accessToken;
      setAuth(token, userInfo);

      queryClient.setQueryData(["user-profile"], data);

      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/home");
      }
    },
  });

  const handelSumit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fethLogin.mutate(formData);
  };
  // --- Kết thúc LOGIC MANTATION ---

  return (
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
      {/* Banner */}
      <div className="relative hidden flex-col items-center justify-center bg-primary/10 p-10 lg:flex bg-linear-to-r from-[#edfcff] to-[#ffffff]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md space-y-8"
        >
          <div
            className="aspect-square w-full rounded-xl bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${banner.src})` }} 
          ></div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Xin chào!</h2>
            <p className="mt-2 text-gray-600">Hãy đăng nhập để tiếp tục.</p>
          </div>
        </motion.div>
      </div>

      {/* Form Đăng nhập */}
      <div className="flex w-full items-center justify-center bg-white p-6 sm:p-12">
        <motion.div
          className="w-full max-w-md space-y-6"
          variants={formContainerVariants}
          initial="hidden"
          // Kích hoạt animation 'wiggle' khi có lỗi, nếu không thì dùng 'visible'
          animate={fethLogin.isError ? "wiggle" : "visible"} 
          key={fethLogin.isError ? "error" : "no-error"}
        >
          {/* Tiêu đề */}
          <motion.div className="flex flex-col gap-2" variants={itemVariants}>
            <p className="text-[#111318] text-4xl font-black leading-tight tracking-[-0.033em]">
              Chào mừng trở lại!
            </p>
            <p className="text-[#616f89] text-base font-normal leading-normal">
              Vui lòng nhập thông tin để đăng nhập.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <TabNav
              tabs={[
                { label: "Đăng nhập", href: "/auth/login" },
                { label: "Đăng ký", href: "/auth/resigner" },
              ]}
            />
          </motion.div>

          {/* Form Fields Container */}
          <motion.div className="space-y-4" variants={itemVariants}>
            {/* Input Email */}
            <label className="flex flex-col flex-1">
              <p className="text-[#111318] text-base font-medium pb-2">Email</p>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={(value) =>
                  setFormdata({ ...formData, email: value.target.value })
                }
                className="form-input w-full rounded-lg border border-[#dbdfe6] p-4 text-base text-[#111318] placeholder:text-[#616f89] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              />
            </label>

            {/* Input Mật khẩu */}
            <label className="flex flex-col flex-1">
              <p className="text-[#111318] text-base font-medium pb-2">
                Mật khẩu
              </p>
              <div className="flex w-full items-stretch">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) =>
                    setFormdata({ ...formData, password: e.target.value })
                  }
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
            </label>

            {/* Quên mật khẩu */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Hiển thị lỗi (Animation Fade In/Out) */}
            {fethLogin.isError && (
              <motion.p 
                className="text-red-500 mt-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(fethLogin.error as AxiosError<LoginErr>)?.response?.data
                  ?.detail || "Lỗi, vui lòng thử lại sau."}
              </motion.p>
            )}
          </motion.div>

          {/* Nút Đăng nhập (Thêm hiệu ứng tương tác) */}
          <motion.button
            onClick={(e) => handelSumit(e)}
            className="flex h-14 w-full items-center justify-center bg-gray-500 gap-2 rounded-xl bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/20"
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} 
            whileTap={{ scale: 0.98 }} 
            disabled={fethLogin.isPending}
          >
            {fethLogin.isPending ? (
              <span className="flex items-center gap-2">
                Đang xử lý <Loading />
              </span>
            ) : (
              "Đăng nhập"
            )}
          </motion.button>

          {/* Social Divider */}
          <motion.div className="flex items-center gap-4" variants={itemVariants}>
            <hr className="w-full border-gray-200" />
            <span className="shrink-0 text-sm text-gray-500">
              Hoặc tiếp tục với
            </span>
            <hr className="w-full border-gray-200" />
          </motion.div>

          {/* Nút Social (Thêm hiệu ứng tương tác) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[GoogleIcon, FacebookIcon, AppleIcon].map((Icon, index) => (
              <motion.button
                key={index}
                className="flex h-12 items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
              >
                <Icon /> {Icon.name.replace('Icon', '')}
              </motion.button>
            ))}
          </div>

          {/* Đăng ký */}
          <motion.p className="text-center text-sm text-gray-600" variants={itemVariants}>
            Chưa có tài khoản?
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline ml-1"
            >
              Đăng ký ngay
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}