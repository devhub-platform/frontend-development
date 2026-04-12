import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dev-hubs.tech/api/v1/",
});

export default axiosInstance;
