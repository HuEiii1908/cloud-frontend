import { createContext, useState, useEffect } from "react";
import authAPI from "../api/auth.api";
import toast from "react-hot-toast";
import storageService from "../services/storage.service";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ===================== LOGIN =====================
  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });

      const access = res?.data?.access;
      const refresh = res?.data?.refresh;

      if (!access) {
        toast.error("Không nhận được access token từ server.");
        return false;
      }

      storageService.setToken(access, refresh);

      const profileRes = await authAPI.getProfile();
      const profile = profileRes?.data;

      if (profile) {
        storageService.setUser(profile);
        setUser(profile);
      }

      return true;
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Sai tài khoản hoặc mật khẩu!";
      toast.error(msg);
      return false;
    }
  };

  // ===================== REGISTER =====================
  const register = async (email, password, full_name) => {
  try {
    const res = await authAPI.register({ email, password, full_name });

    // Nếu backend thực sự trả success = true mới coi là thành công
    if (!res.data?.success) {
      throw new Error(res.data?.message || "Đăng ký thất bại");
    }

    return res.data;

  } catch (err) {
    // ----- XỬ LÝ LỖI TỪ DRF -----
    const data = err.response?.data;

    let msg = "Đăng ký thất bại";

    if (data?.email) {
      msg = data.email[0]; // 👉 'user with this email already exists.'
    }
    if (data?.password) {
      msg = data.password[0];
    }
    if (data?.full_name) {
      msg = data.full_name[0];
    }
    if (data?.message) {
      msg = data.message;
    }

    throw new Error(msg);
  }
};

  // ===================== LOGOUT =====================
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (_) {}

    storageService.removeToken();
    storageService.removeUser();
    setUser(null);
    toast.success("Đã đăng xuất!");
  };

  // ===================== LOAD SESSION =====================
  useEffect(() => {
    const token = storageService.getToken();
    const cachedUser = storageService.getUser();

    if (cachedUser) {
      setUser(cachedUser);
      return;
    }

    if (token) {
      authAPI
        .getProfile()
        .then((res) => {
          storageService.setUser(res.data);
          setUser(res.data);
        })
        .catch(() => {
          storageService.removeToken();
          storageService.removeUser();
          setUser(null);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
