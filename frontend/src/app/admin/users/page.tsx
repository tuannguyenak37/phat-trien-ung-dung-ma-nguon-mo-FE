"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { dashboardUser } from "@/lib/API/admin/user"; // Nhớ trỏ đúng file API
import{ sedEMail, User,StatsQueryParams } from "@/types/useremail"
import { StatsCards } from "./StatsCards";
import { UserCharts } from "./UserCharts";
import { UserTable } from "./UserTable";
import { BanModal } from "./BanModal";
import { DateRangeFilter } from "./DateRangeFilter"; // <--- Import mới
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner"

export default function UserDashboardPage() {
  const queryClient = useQueryClient();

  // --- 1. State ---
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State Filter Thời gian (Mới thêm)
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  // State Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalAction, setModalAction] = useState<"ban" | "unlock">("ban");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 2. Queries ---
  
  // Query User List (Giữ nguyên)
  const { data: userList, isLoading: isUserLoading } = useQuery({
    queryKey: ["users", page, searchTerm],
    queryFn: () => dashboardUser.listUser({ page, limit: 10, search: searchTerm || null }),
    placeholderData: keepPreviousData,
  });

  // Query Stats (ĐÃ CẬP NHẬT: Nhận thêm params dateFilter)
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["userStats", dateFilter], // Khi dateFilter đổi, query tự chạy lại
    queryFn: () => {
      // Cast kiểu dữ liệu params cho đúng với API backend yêu cầu
      const params: StatsQueryParams = {
        start_date: dateFilter.start || undefined,
        end_date: dateFilter.end || undefined
      };
      // Lưu ý: Sửa lại hàm dashboardStatus trong file API để nhận params này
      // @ts-ignore: Bỏ qua lỗi TS tạm thời nếu file API chưa sửa kịp
      return dashboardUser.dashboardStatus(params); 
    },
  });

  // --- 3. Mutations (Giữ nguyên logic cũ) ---
  const mutationConfig = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      closeModal();
      toast.success("Thao tác thành công!");
    },
    onError: (err: any) => toast.error("Lỗi: " + err.message),
  };

  const banMutation = useMutation({
    mutationFn: (data: sedEMail) => dashboardUser.ban(data),
    ...mutationConfig,
  });

  const unlockMutation = useMutation({
    mutationFn: (data: sedEMail) => dashboardUser.unlock(data),
    ...mutationConfig,
  });

  // Handlers
  const openModal = (user: User, action: "ban" | "unlock") => {
    setSelectedUser(user);
    setModalAction(action);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setSelectedUser(null); };
  const handleConfirmAction = (reason: string) => {
    if (!selectedUser) return;
    const payload = { email: selectedUser.email, status: modalAction === "ban" ? "banned" : "active", reason };
    if (modalAction === "ban") banMutation.mutate(payload);
    else unlockMutation.mutate(payload);
  };

  // Handler thay đổi ngày
  const handleDateChange = (start: string, end: string) => {
    setDateFilter({ start, end });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Quản Lý User</h1>
          <p className="text-gray-500">Thống kê và kiểm soát hệ thống.</p>
        </div>
      </div>

      {/* --- PHẦN BỘ LỌC THỜI GIAN (ĐÃ THÊM) --- */}
      <DateRangeFilter 
        startDate={dateFilter.start}
        endDate={dateFilter.end}
        onChange={handleDateChange}
      />

      {/* Stats Cards (Sẽ thay đổi số liệu theo ngày đã chọn) */}
      <StatsCards stats={stats} isLoading={isStatsLoading} />

      {/* Biểu đồ tương quan (Sẽ vẽ lại theo ngày đã chọn) */}
      <UserCharts stats={stats} />

      {/* Thanh Search User */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm user theo tên hoặc email..." 
            className="pl-10 w-full border-gray-300 rounded-md py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Bảng User */}
      <UserTable 
        users={userList?.data || []}
        isLoading={isUserLoading}
        total={userList?.total || 0}
        limit={10}
        page={page}
        onPageChange={setPage}
        onAction={openModal} 
      />

      {/* Modal */}
      <BanModal 
        isOpen={isModalOpen}
        user={selectedUser}
        action={modalAction}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        isLoading={banMutation.isPending || unlockMutation.isPending}
      />
    </div>
  );
}