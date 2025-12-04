"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"
import { updateInfoAPI } from "@/lib/API/userProfile";

import { PencilIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "@/lib/store/tokenStore"; // Import Store để cập nhật tên ngay lập tức
import { Button, Input } from "./SharedComponents";
interface Props {
  // Nhận thêm firstName, lastName cũ để hiển thị
  defaultValues: {
    firstName: string;
    lastName: string;
    description: string;
  };
  userId: string;
}

export default function EditInfoForm({ defaultValues, userId }: Props) {
  const queryClient = useQueryClient();
  const { user: currentUser, setUser } = useAuthStore(); // Lấy hàm setUser

  // State quản lý cả 3 trường
  const [formData, setFormData] = useState({
    firstName: defaultValues.firstName || "",
    lastName: defaultValues.lastName || "",
    description: defaultValues.description || "",
  });

  const mutation = useMutation({
    mutationFn: updateInfoAPI,
    onSuccess: (resData) => {
      toast.success("Đã cập nhật thông tin!");
      
      // 1. Refresh lại data trang Profile
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });

      // 2. Cập nhật ngay vào Store (RAM) để Navbar/Header đổi tên ngay lập tức
      if (currentUser) {
        setUser({
          ...currentUser,
          firstName: resData.firstName,
          lastName: resData.lastName,
          description: resData.description,
        });
      }
    },
    onError: () => toast.error("Lỗi cập nhật thông tin"),
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      <h4 className="font-bold text-gray-800 text-lg">Thông tin cơ bản</h4>
      
      {/* Row: First Name & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Họ</label>
          <Input 
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Nguyễn"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Tên</label>
          <Input 
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Văn A"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Tiểu sử</label>
        <div className="relative">
          <textarea
            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[120px] resize-none bg-gray-50 focus:bg-white transition-all"
            placeholder="Mô tả ngắn về bạn..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <PencilIcon className="w-4 h-4 text-gray-400 absolute bottom-3 right-3 pointer-events-none" />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Thông tin này sẽ hiển thị công khai trên trang cá nhân của bạn.
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <Button 
          onClick={() => mutation.mutate(formData)} 
          isLoading={mutation.isPending}
          disabled={!formData.firstName || !formData.lastName} // Bắt buộc phải có tên
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}