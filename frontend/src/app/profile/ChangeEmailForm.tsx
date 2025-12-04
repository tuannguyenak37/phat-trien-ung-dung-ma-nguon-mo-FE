"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"
import { changeEmailAPI } from "@/lib/API/userProfile";
import { Button, Input } from "./SharedComponents";

export default function ChangeEmailForm() {
  const [data, setData] = useState({ password: "", new_email: "" });

  const mutation = useMutation({
    mutationFn: changeEmailAPI,
    onSuccess: () => {
      toast.success("Email đã được thay đổi thành công!");
      setData({ password: "", new_email: "" });
    },
    onError: (err: any) => toast.error(err.response?.data?.detail || "Lỗi: Không thể đổi email"),
  });

  const isValid = data.password.length > 0 && data.new_email.includes("@");

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h4 className="font-bold text-gray-800 mb-2">Thay đổi Email liên hệ</h4>
      
      <div className="space-y-3">
        <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Xác nhận mật khẩu</label>
            <Input 
                type="password" 
                placeholder="Nhập mật khẩu để tiếp tục" 
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
            />
        </div>
        <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Email mới</label>
            <Input 
                type="email" 
                placeholder="example@gmail.com" 
                value={data.new_email}
                onChange={(e) => setData({ ...data, new_email: e.target.value })}
            />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
         <Button 
            onClick={() => mutation.mutate(data)}
            isLoading={mutation.isPending}
            variant="primary"
            disabled={!isValid}
         >
            Xác nhận đổi Email
         </Button>
      </div>
    </div>
  );
}