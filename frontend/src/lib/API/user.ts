import axios from "./axiosConfig";
type data = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
interface formData {
  email: string;
  password: string;
}
const APIResigner = async (data: data) => {
  console.log(">>>", data);
  return await axios.post("/users/create", data);
};
const APILogin = async (data: formData) => {
  return await axios.post("/users/login", data);
};
const UserAPI = { APIResigner, APILogin };
export default UserAPI;
