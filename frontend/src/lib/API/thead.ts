import axios from "./axiosConfig";
import { HomeList } from "@/types/home";

const APIhome = async (data: HomeList) => {
  return await axios.get("/threads", {
    params: data,
  });
};

const APIgetThreadById = async (id: string,data:HomeList) => {
  return await axios.get(`public/users/profile/${id}`,{params: data} );
}


const APICreate = async (formData: FormData) => {
  return await axios.post("/threads/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Quan trọng để gửi file
    },
  });
};
const api = {
  APIhome,
  APIgetThreadById,
  APICreate
};
export default api;
