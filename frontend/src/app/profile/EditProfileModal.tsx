"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import clsx from "clsx";

// Sub-components
import EditInfoForm from "./EditInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";

// Icons
import { XMarkIcon, UserCircleIcon, KeyIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Nhận nguyên object data để truyền xuống form sửa thông tin
  userData: {
    firstName: string;
    lastName: string;
    description: string;
  };
  userId: string;
}

const TABS = [
  { id: "info", label: "Giới thiệu", icon: UserCircleIcon },
  { id: "password", label: "Bảo mật", icon: KeyIcon },
  { id: "email", label: "Email", icon: EnvelopeIcon },
];

export default function EditProfileModal({ isOpen, onClose, userData, userId }: Props) {
  const [activeTab, setActiveTab] = useState<"info" | "password" | "email">("info");

  // Reset về tab đầu tiên khi mở modal
  useEffect(() => {
    if (isOpen) setActiveTab("info");
  }, [isOpen]);

  // --- Animation Variants (Có Type rõ ràng để tránh lỗi TS) ---
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 25 } 
    },
    exit: { opacity: 0, scale: 0.95, y: 10 },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as={motion.div}
          initial="hidden" animate="visible" exit="hidden"
          variants={overlayVariants}
          open={isOpen} onClose={onClose}
          className="relative z-50"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              variants={modalVariants}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="relative border-b px-4 py-4 flex items-center justify-center bg-white shrink-0">
                <h3 className="text-lg font-bold text-gray-900">Cài đặt tài khoản</h3>
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Body: Sidebar + Content */}
              <div className="flex h-[450px]">
                {/* Sidebar (Left) */}
                <div className="w-1/3 bg-gray-50 border-r p-2 space-y-1 overflow-y-auto">
                  {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={clsx(
                          "flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-lg transition-all relative",
                          isActive ? "text-blue-600 bg-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <tab.icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-gray-500")} />
                        {tab.label}
                        {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />}
                      </button>
                    );
                  })}
                </div>

                {/* Content (Right) */}
                <div className="w-2/3 p-6 overflow-y-auto relative bg-white">
                  <motion.div
                    key={activeTab}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {/* Render Form tương ứng */}
                    {activeTab === "info" && (
                      <EditInfoForm defaultValues={userData} userId={userId} />
                    )}
                    {activeTab === "password" && (
                      <ChangePasswordForm />
                    )}
                    {activeTab === "email" && (
                      <ChangeEmailForm />
                    )}
                  </motion.div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}