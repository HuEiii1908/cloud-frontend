import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, UserPlus, User } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Kiểm tra định dạng email
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailPattern.test(form.email)) {
      toast.error("Vui lòng nhập email đúng định dạng @gmail.com");
      return;
    }

    if (form.password !== form.confirm) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    if (!form.full_name.trim()) {
      toast.error("Vui lòng nhập họ và tên của bạn!");
      return;
    }

    try {
      await register(form.email, form.password, form.full_name);
      toast.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#171717] transition-all">
      <div className="bg-white dark:bg-[#202124] rounded-xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <UserPlus className="w-10 h-10 text-blue-500 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Tạo tài khoản Drive
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="full_name"
              placeholder="Họ và tên của bạn"
              value={form.full_name}
              onChange={handleChange}
              className="w-full pl-9 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2b2b2b] dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-9 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2b2b2b] dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-9 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2b2b2b] dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              name="confirm"
              placeholder="Nhập lại mật khẩu"
              value={form.confirm}
              onChange={handleChange}
              className="w-full pl-9 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2b2b2b] dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-all"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
