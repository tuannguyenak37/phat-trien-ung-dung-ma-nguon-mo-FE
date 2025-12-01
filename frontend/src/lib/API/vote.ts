// services/voteService.ts
import axiosClient from "./axiosConfig"; // File cấu hình axios của bạn (đã có base URL và Token)
import { votes } from "@/types/votes";
export interface VotePayload {
  thread_id?: string;
  comment_id?: string;
  value: 1 | -1; // 1 là Like, -1 là Dislike
}

export const voteApi = {
  submitVote: async (payload: VotePayload) => {
    return axiosClient.post("/votes", payload);
  },
  
  getThreadVotes: async (threadId: string) => {
    return axiosClient.get(`/votes/thread/${threadId}`);
  },
  checkVotes : async (data :votes)=>{
    return axiosClient.get("/votes/check",{
        params: {
            target_id : data.target_id ,
            target_type :data.target_type 
        }
    })
  }
};