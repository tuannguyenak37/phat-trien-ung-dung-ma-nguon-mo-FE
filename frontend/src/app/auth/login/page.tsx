'use client'
import React from 'react';

const LoginPageContent: React.FC = () => {
  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-[#111318] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Chào mừng trở lại!</p>
          <p className="text-[#616f89] dark:text-gray-400 text-base font-normal leading-normal">Vui lòng nhập thông tin của bạn để đăng nhập.</p>
        </div>
      </div>

      {/* Segmented Buttons (Tabs) - ĐÃ SỬA CÚ PHÁP HAS-CHECKED */}
      <div className="flex py-3">
        <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#f0f2f4] dark:bg-gray-800 p-1">
          <label className="flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal text-[#616f89] has-checked:bg-white has-checked:text-[#111318] has-checked:shadow-[0_0_4px_rgba(0,0,0,0.1)] dark:text-gray-400 dark:has-checked:bg-gray-700 dark:has-checked:text-white">
            <span className="truncate">Đăng nhập</span>
            <input checked className="invisible w-0" name="auth-tab" type="radio" value="Login" />
          </label>
          <label className="flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal text-[#616f89] has-checked:bg-white has-checked:text-[#111318] has-checked:shadow-[0_0_4px_rgba(0,0,0,0.1)] dark:text-gray-400 dark:has-checked:bg-gray-700 dark:has-checked:text-white">
            <span className="truncate">Đăng ký</span>
            <input className="invisible w-0" name="auth-tab" type="radio" value="Sign Up" />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Email Field */}
        <label className="flex flex-col flex-1">
          <p className="text-[#111318] dark:text-white text-base font-medium leading-normal pb-2">Email</p>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#dbdfe6] bg-white p-[15px] text-base font-normal leading-normal text-[#111318] placeholder:text-[#616f89] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
            placeholder="Nhập email của bạn"
            type="email"
          />
        </label>

        {/* Password Field */}
        <label className="flex flex-col flex-1">
          <p className="text-[#111318] dark:text-white text-base font-medium leading-normal pb-2">Mật khẩu</p>
          <div className="flex w-full flex-1 items-stretch">
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg border border-r-0 border-[#dbdfe6] bg-white p-[15px] pr-2 text-base font-normal leading-normal text-[#111318] placeholder:text-[#616f89] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
              placeholder="Nhập mật khẩu của bạn"
              type="password"
            />
            <div className="flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-[#dbdfe6] bg-white pr-[15px] text-[#616f89] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <span className="material-symbols-outlined text-2xl">visibility</span>
            </div>
          </div>
        </label>

        <div className="flex items-center justify-end">
          <a className="text-sm font-medium text-primary hover:underline" href="#">Quên mật khẩu?</a>
        </div>
      </div>

      {/* Primary CTA Button */}
      <button
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark"
        type="submit"
      >
        <span>Đăng nhập</span>
      </button>

      {/* Separator */}
      <div className="flex items-center gap-4">
        <hr className="w-full border-gray-200 dark:border-gray-700"/>
        <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">Hoặc tiếp tục với</span>
        <hr className="w-full border-gray-200 dark:border-gray-700"/>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Google */}
        <button className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.5714 12.2727C22.5714 11.4545 22.5 10.6364 22.3571 9.81818H12V14.4545H18.0714C17.8214 15.8182 17.0357 16.9773 15.8928 17.7727V20.3636H19.6428C21.5714 18.5795 22.5714 15.6818 22.5714 12.2727Z" fill="#4285F4"></path><path d="M12 23C15.25 23 17.9643 21.9091 19.6428 20.3636L15.8928 17.7727C14.7857 18.5 13.4643 18.9545 12 18.9545C9.07142 18.9545 6.60714 17.0227 5.71428 14.4545H1.85714V17.0455C3.57142 20.5909 7.46428 23 12 23Z" fill="#34A853"></path><path d="M5.71428 14.4545C5.46428 13.7273 5.32142 12.9545 5.32142 12.1818C5.32142 11.4091 5.46428 10.6364 5.71428 9.90909V7.31818H1.85714C1.32142 8.36364 1 9.54545 1 10.8182C1 12.0909 1.32142 13.2727 1.85714 14.3182L5.71428 14.4545Z" fill="#FBBC05"></path><path d="M12 5.40909C13.5714 5.40909 15.0357 5.95455 16.2143 7.04545L19.7143 3.63636C17.9643 1.95455 15.25 1 12 1C7.46428 1 3.57142 3.40909 1.85714 6.95455L5.71428 9.54545C6.60714 6.97727 9.07142 5.04545 12 5.04545H12V5.40909Z" fill="#EA4335"></path></svg>
          <span>Google</span>
        </button>
        {/* Facebook */}
        <button className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 12.062C22 6.497 17.502 2 11.938 2C6.374 2 1.875 6.497 1.875 12.062C1.875 17.086 5.56 21.233 10.125 21.96V14.968H7.234V12.062H10.125V9.835C10.125 6.955 11.821 5.438 14.411 5.438C15.658 5.438 16.922 5.648 16.922 5.648V8.12H15.541C14.16 8.12 13.734 9.03 13.734 10.16V12.063H16.79L16.353 14.968H13.733V21.96C18.299 21.233 22 17.086 22 12.062Z" fill="#1877F2"></path></svg>
          <span>Facebook</span>
        </button>
        {/* Apple */}
        <button className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M15.333 9.437C15.333 7.96 16.537 6.43 18.254 6.43C19.957 6.43 21.163 7.915 21.163 9.437C21.163 10.946 20.01 12.446 18.298 12.446C16.586 12.446 15.333 10.976 15.333 9.437ZM14.07 15.918C14.475 15.918 14.808 16.23 14.808 16.635C14.808 17.038 14.475 17.35 14.07 17.35C13.666 17.35 13.333 17.038 13.333 16.635C13.333 16.23 13.666 15.918 14.07 15.918ZM11.166 14.446C11.166 11.23 13.636 9.423 16.572 9.423C16.824 9.423 16.96 9.423 17.028 9.423C17.028 7.542 15.869 6.012 14.07 6.012C12.02 6.012 10.51 7.218 9.478 8.934C9.478 8.934 9.478 14.446 9.478 14.446H11.166ZM14.07 15.918C14.475 15.918 14.808 16.23 14.808 16.635C14.808 17.038 14.475 17.35 14.07 17.35C13.666 17.35 13.333 17.038 13.333 16.635C13.333 16.23 13.666 15.918 14.07 15.918ZM14.07 2C10.74 2 7.5 3.393 7.5 6.75C7.5 9.423 9.88 10.74 10.284 10.74C10.148 9.675 10.418 7.93 11.83 6.9C12.775 6.225 13.808 6.012 14.07 6.012C14.138 6.012 14.206 6.012 14.274 6.012C11.564 6.012 9.184 8.062 9.184 11.23V16.77C9.184 17.022 9.252 17.202 9.388 17.35C8.842 17.485 8.364 17.8 7.96 18.2C7.014 19.146 6.878 20.5 7.772 21.61C8.25 22.213 8.924 22.5 9.722 22.5C11.602 22.5 12.876 21.028 13.333 21.028C13.79 21.028 15.132 22.5 16.954 22.432C18.296 22.364 19.454 21.566 20.058 20.62C20.662 19.674 20.526 18.468 19.632 17.522C19.096 16.986 18.358 16.635 17.754 16.5C17.822 16.365 17.89 16.23 17.89 16.082V11.23C19.468 11.082 21.163 10.082 21.163 8.268C21.163 6.552 19.942 5.012 18.224 5.012C16.508 5.012 15.333 6.552 15.333 8.268V9.437H14.07V2Z" fillRule="evenodd"></path></svg>
          <span>Apple</span>
        </button>
      </div>

      {/* Toggle Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Chưa có tài khoản?
        <a className="font-semibold text-primary hover:underline" href="#">Đăng ký ngay</a>
      </p>
    </>
  );
};

export default LoginPageContent;