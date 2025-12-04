
import axiosInstance from "../axiosConfig";
import{sedEMail,UserListReq, UserListResponse,UsersByDate,StatsResponse} from "@/types/useremail"
export const dashboardUser = {
    ban: async (data:sedEMail) => {
    const response = await axiosInstance.post("/admin/ban-account",data)
    return response.data;
  },
  unlock: async (data:sedEMail) => {
    const response = await axiosInstance.post("admin/unlock-account",data)
    return response.data;
  },
  listUser : async(data:UserListReq)=>{
    const res = await axiosInstance.get<UserListResponse>("/admin/users",{params:data})
    return res.data
  },
  dashboardStatus: async (data :UsersByDate)=>{
    const res = await axiosInstance.get<StatsResponse>("/admin/dashboard/stats",{params:data})
    return res.data
  }

};