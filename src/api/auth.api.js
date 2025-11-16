import axiosClient from "../services/axiosClient";

const authAPI = {
  register: (data) =>
    axiosClient.post("/auth/register/", data),

  login: (data) =>
    axiosClient.post("/auth/login/", {
      email: data.email,
      password: data.password,
    }),

  getProfile: () => axiosClient.get("/auth/profile/"),
  logout: () => axiosClient.post("/auth/logout/"),
};

export default authAPI;
