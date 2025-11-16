import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: contextLogin, logout: contextLogout } = useContext(AuthContext);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      console.log("📤 Login request:", credentials);
      const response = await authAPI.login(credentials);
      console.log("✅ Login success:", response.data);

      const token = response.data.access || response.data.token;
      if (token) {
        contextLogin(token, response.data.user);
        navigate("/");
      } else {
        setError("Không nhận được token từ server!");
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      setError(
        "Đăng nhập thất bại: " +
          (error.response?.data?.detail ||
            error.response?.data?.error ||
            "Sai mật khẩu hoặc tài khoản")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.register(userData);
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Register error:", error.response?.data || error.message);
      setError(
        "Đăng ký thất bại: " +
          (error.response?.data?.detail ||
            error.response?.data?.error ||
            "Có lỗi xảy ra")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    contextLogout();
    navigate("/login");
  };

  return {
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}
