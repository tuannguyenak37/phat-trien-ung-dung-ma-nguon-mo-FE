"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { voteApi } from "@/lib/API/vote";
import toast from "react-hot-toast";
import { HeartIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, HandThumbDownIcon as HandThumbDownSolid } from "@heroicons/react/24/solid";
// import { votes } from "@/types/votes"; // (Nếu file này chỉ export type thì giữ, nếu không cần thiết thì bỏ qua)

interface VoteControlProps {
  threadId?: string;
  commentId?: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote: number; 
  isHorizontal?: boolean;
}

export default function VoteControl({
  threadId,
  commentId,
  initialUpvotes,
  initialDownvotes,
  initialUserVote,
  isHorizontal = true,
}: VoteControlProps) {
  
  // State hiển thị
  const [viewState, setViewState] = useState({
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
    userVote: initialUserVote,
  });

  const targetId = threadId || commentId || "";
  const targetType = threadId ? "thread" : "comment";

  // 1. QUERY CHECK VOTE
  const { data: response } = useQuery({
    queryKey: ["votes", targetType, targetId],
    queryFn: () => voteApi.checkVotes({ target_id: targetId, target_type: targetType }),
    enabled: !!targetId, 
    staleTime: 0, 
  });

  // 2. ĐỒNG BỘ DATA TỪ SERVER (ĐÃ SỬA LỖI AXIOS RESPONSE)
  useEffect(() => {
    // 👇 SỬA LỖI TẠI ĐÂY: Phải truy cập vào response.data
    const voteData = response?.data; 

    if (voteData && typeof voteData.is_voted !== "undefined") {
        setViewState(prev => ({
            ...prev,
            userVote: voteData.is_voted
        }));
    }
  }, [response]);

  // Đồng bộ props ban đầu
  useEffect(() => {
    setViewState(prev => ({
      ...prev,
      upvotes: initialUpvotes,
      downvotes: initialDownvotes,
      // Ưu tiên data từ API checkVotes nếu có, nếu không thì dùng props
      userVote: response?.data ? prev.userVote : initialUserVote,
    }));
  }, [initialUpvotes, initialDownvotes, initialUserVote, response]);


  // 3. MUTATION
  const mutation = useMutation({
    mutationFn: async (val: 1 | -1) => {
      return await voteApi.submitVote({
        thread_id: threadId,
        comment_id: commentId,
        value: val,
      });
    },
    onError: (err, variables, context: any) => {
      console.error("Vote error:", err);
      toast.error("Lỗi kết nối!");
      if (context?.previousState) {
        setViewState(context.previousState);
      }
    },
  });

  const handleVote = (value: 1 | -1) => {
    if (mutation.isPending) return;

    const { userVote, upvotes, downvotes } = viewState;
    const previousState = { ...viewState };

    // --- TÍNH TOÁN LOGIC OPTIMISTIC ---
    let newUp = upvotes;
    let newDown = downvotes;
    let newUserVote = value;

    if (userVote === value) {
      // Toggle OFF
      newUserVote = 0;
      if (value === 1) newUp = Math.max(0, newUp - 1);
      else newDown = Math.max(0, newDown - 1);
    } else {
      // Vote mới hoặc Đảo chiều
      if (userVote === 0) {
        if (value === 1) newUp++;
        else newDown++;
      } else {
        if (value === 1) { newUp++; newDown = Math.max(0, newDown - 1); }
        else { newDown++; newUp = Math.max(0, newUp - 1); }
      }
    }

    setViewState({ upvotes: newUp, downvotes: newDown, userVote: newUserVote });

    mutation.mutate(value, {
       // @ts-ignore
       context: { previousState } 
    });
  };

  const { upvotes, downvotes, userVote } = viewState;

  return (
    <div className={clsx("flex items-center gap-3", isHorizontal ? "flex-row" : "flex-col")}>
      
      {/* TIM */}
      <div className="flex items-center gap-1">
        <button 
            onClick={() => handleVote(1)} 
            disabled={mutation.isPending} 
            className="group relative transition-transform active:scale-90 p-1 rounded-full hover:bg-white/5 disabled:opacity-50"
        >
            {userVote === 1 ? (
                <HeartSolid className="w-6 h-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse-once" />
            ) : (
                <HeartIcon className="w-6 h-6 text-zinc-500 group-hover:text-red-400 transition-colors" />
            )}
        </button>
        <span className={clsx("text-sm font-bold tabular-nums min-w-[20px]", userVote === 1 ? "text-red-500" : "text-zinc-500")}>
            {upvotes}
        </span>
      </div>

      {/* DISLIKE */}
      <div className="flex items-center gap-1">
        <button 
            onClick={() => handleVote(-1)} 
            disabled={mutation.isPending}
            className="group transition-transform active:scale-90 p-1 rounded-full hover:bg-white/5 disabled:opacity-50"
        >
            {userVote === -1 ? (
                <HandThumbDownSolid className="w-5 h-5 text-indigo-500" />
            ) : (
                <HandThumbDownIcon className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            )}
        </button>
        {downvotes > 0 && (
            <span className={clsx("text-xs font-medium tabular-nums text-zinc-500", userVote === -1 && "text-indigo-500")}>
                {downvotes}
            </span>
        )}
      </div>
    </div>
  );
}