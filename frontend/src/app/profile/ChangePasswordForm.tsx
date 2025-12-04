"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"
import { changePasswordAPI } from "@/lib/API/userProfile";
import { Button, Input } from "./SharedComponents";

export default function ChangePasswordForm() {
  const [data, setData] = useState({ old_password: "", new_password: "" });

  const mutation = useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      setData({ old_password: "", new_password: "" }); // Reset form
    },
    onError: (err: any) => toast.error(err.response?.data?.detail || "Mật khẩu cũ không chính xác"),
  });

  const isValid = data.old_password.length > 0 && data.new_password.length >= 6;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h4 className="font-bold text-gray-800 mb-2">Đổi mật khẩu</h4>
      
      <div className="space-y-3">
        <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Mật khẩu hiện tại</label>
            <Input 
                type="password" 
                placeholder="••••••" 
                value={data.old_password}
                onChange={(e) => setData({ ...data, old_password: e.target.value })}
            />
        </div>
        <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Mật khẩu mới</label>
            <Input 
                type="password" 
                placeholder="•••••• (Tối thiểu 6 ký tự)" 
                value={data.new_password}
                onChange={(e) => setData({ ...data, new_password: e.target.value })}
            />
        </div>
      </div>
      
      <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-700 leading-relaxed">
         <strong>Lưu ý:</strong> Để bảo mật, hãy sử dụng mật khẩu mạnh bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
         <Button 
            onClick={() => mutation.mutate(data)}
            isLoading={mutation.isPending}
            variant="danger"
            disabled={!isValid}
         >
            Cập nhật mật khẩu
         </Button>
      </div>
    </div>
  );
}