"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/API/category";
import DeleteTag from "./DeleteTag";
import { TagIcon } from "@heroicons/react/24/outline";

// 1. Định nghĩa Interface cho MỘT phần tử tag
// (Không cần định nghĩa object chứa list nữa)
export interface TagPopular {
  name: string;
  tag_id: string;
  count?: number; // Để optional để tránh lỗi nếu API chưa có field này
}

export default function TagManager() {
  // 2. Fetch API: Khai báo kiểu trả về là Mảng (TagPopular[])
  const { data: tags, isLoading, isError } = useQuery<TagPopular[]>({
    queryKey: ["tags-popular"],
    queryFn: async () => {
      const res = await categoryService.tagPopular(50);
      // Ép kiểu dữ liệu về dạng mảng giống cách bạn làm ở file kia để đảm bảo code chạy đúng
      return res as unknown as TagPopular[];
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex justify-center">
        <div className="text-gray-500 animate-pulse">Đang tải danh sách thẻ...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-red-500">
        Lỗi khi tải dữ liệu thẻ. Vui lòng thử lại sau.
      </div>
    );
  }

  // 3. Xử lý dữ liệu: tags chính là mảng rồi, chỉ cần fallback về [] nếu null
  const tagList = tags || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Bảng */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <TagIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Danh sách Thẻ (Tags)</h2>
            <p className="text-xs text-gray-500">Quản lý các từ khóa phổ biến</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          Tổng: {tagList.length}
        </span>
      </div>

      {/* Nội dung Bảng */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 w-16 text-center">#</th>
              <th className="px-6 py-4">Tên Thẻ (Tag Name)</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4 text-center">Sử dụng</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tagList.map((item, index) => (
              <tr
                key={item.tag_id}
                className="bg-white hover:bg-gray-50 transition-colors"
              >
                {/* Số thứ tự */}
                <td className="px-6 py-4 text-center font-medium text-gray-400">
                  {index + 1}
                </td>

                {/* Tên thẻ */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    #{item.name}
                  </span>
                </td>

                {/* ID thẻ */}
                <td className="px-6 py-4 font-mono text-xs text-gray-400">
                  {item.tag_id}
                </td>

                {/* Số lượng bài viết (Nếu API chưa có thì hiện 0) */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-600 bg-gray-100 rounded-full">
                    {item.count || 0} bài
                  </span>
                </td>

                {/* Nút xóa */}
                <td className="px-6 py-4 text-right">
                  <DeleteTag id={item.tag_id} />
                </td>
              </tr>
            ))}

            {/* Trạng thái trống */}
            {tagList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <TagIcon className="w-10 h-10 mb-2 opacity-20" />
                    <p>Chưa có thẻ nào được tạo.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}