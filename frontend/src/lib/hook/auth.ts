import axios from "../API/axiosConfig";

// api/auth.ts
const fetchUserProfile = async () => {
  const res = await axios.post("/");

  // Axios trả về status code
  if (res.status !== 200) throw new Error("Unauthorized");

  // Axios luôn trả về dữ liệu trong res.data
  return res.data;
};

export default fetchUserProfile;
