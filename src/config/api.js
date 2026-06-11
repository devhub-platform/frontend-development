import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dev-hub.app/api/v1",
});

export default axiosInstance;
