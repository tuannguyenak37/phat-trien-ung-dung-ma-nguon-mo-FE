"use client";
import { useQuery } from "@tanstack/react-query";
import { commentApi } from "@/lib/API/comment";
import CommentItem, { CommentData } from "./CommentItem"; 
import CommentInput from "./CommentInput";

interface CommentSectionProps {
  threadId: string;
  commentCount: number;
}

export default function CommentSection({ threadId, commentCount }: CommentSectionProps) {
  // Lấy danh sách comment gốc (cấp 1)
  const { data, isLoading } = useQuery({
    queryKey: ["comments", "root", threadId],
    queryFn: () => commentApi.getComments({ thread_id: threadId, page: 1, limit: 10 }),
  });

  return (
    <div className="mt-2 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            Bình luận <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-extrabold">{commentCount}</span>
          </h3>
          
          {/* Dropdown sắp xếp */}
          <select className="text-xs font-medium text-gray-500 bg-transparent border-none outline-none cursor-pointer hover:text-gray-800 focus:ring-0">
             <option value="newest">Mới nhất</option>
             <option value="top">Phổ biến nhất</option>
          </select>
      </div>

      {/* Form nhập comment chính */}
      <div className="mb-8">
        <CommentInput threadId={threadId} />
      </div>

      {/* Danh sách Comment */}
      {/* 👇 ĐÃ CẬP NHẬT: Thêm pb-24 để tránh bị che nội dung dưới cùng */}
      <div className="space-y-6 pb-24">
        {isLoading ? (
           // Skeleton Loading cho danh sách
           <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0"></div>
                      <div className="flex-1 space-y-2">
                          <div className="h-10 bg-gray-200 rounded-2xl w-3/4"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                      </div>
                  </div>
              ))}
           </div>
        ) : (
           data?.data.length === 0 ? (
               <div className="text-center py-8 text-gray-400 text-sm">
                   Chưa có bình luận nào. Hãy là người đầu tiên!
               </div>
           ) : (
               // Ép kiểu 'as CommentData' để sửa lỗi user_id missing
               data?.data.map((comment) => (
                 <CommentItem 
                    key={comment.comment_id} 
                    comment={comment as CommentData} 
                    threadId={threadId} 
                 />
               ))
           )
        )}
        
        {/* Nút Load more */}
        {(data?.total || 0) > (data?.data.length || 0) && (
            <button className="w-full py-2.5 mt-4 text-sm font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-dashed border-gray-200 hover:border-blue-200">
                Xem thêm bình luận cũ hơn
            </button>
        )}
      </div>
    </div>
  );
}