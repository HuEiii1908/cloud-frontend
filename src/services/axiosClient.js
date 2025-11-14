// src/services/axiosClient.js
import axios from "axios";
import storageService from "./storage.service";
import toast from "react-hot-toast";

const axiosClient = axios.create({
  baseURL: "http://192.168.0.102:8000/api",
  headers: { },
});

axiosClient.interceptors.request.use((config) => {
  const token = storageService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔁 Tự refresh token khi 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = storageService.getRefresh();
        if (!refresh) throw new Error("Missing refresh token");

        const res = await axios.post(
          "http://192.168.0.102:8000/api/auth/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        storageService.setToken(newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosClient(originalRequest);
      } catch (e) {
        storageService.removeToken();
        storageService.removeUser();
        toast.error("Phiên đăng nhập hết hạn!");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
