"use client";
import React from "react";
import clsx from "clsx";

// Input chuẩn style Facebook/Modern
export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx(
      "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm transition-all outline-none",
      "focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      "placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-400",
      className
    )}
    {...props}
  />
);

// Button có Loading Spinner
export const Button = ({ 
  children, 
  isLoading, 
  onClick, 
  variant = "primary",
  disabled,
  type = "button"
}: { 
  children: React.ReactNode, 
  isLoading?: boolean, 
  onClick?: () => void,
  variant?: "primary" | "danger",
  disabled?: boolean,
  type?: "button" | "submit" | "reset"
}) => {
  const styles = variant === "primary" 
    ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300" 
    : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 disabled:opacity-50";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={clsx(
        "w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex justify-center items-center gap-2 active:scale-95",
        styles
      )}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};