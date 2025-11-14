import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";      // <- Dashboard bây giờ wrap GoogleDriveView
import Shared from "../pages/Shared";            // giữ nguyên
import Trash from "../pages/Trash"; 
import Storage from "../pages/Storage";
import AuthProvider, { AuthContext } from "../context/AuthContext";
import FileProvider from "../context/FileContext";
import ThemeProvider from "../context/ThemeContext";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";

function Protected({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FileProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Protected><Dashboard /></Protected>} />
              <Route path="/shared" element={<Protected><Shared /></Protected>} />
              <Route path="/trash" element={<Protected><Trash /></Protected>} />
              <Route path="/storage" element={<Protected><Storage /></Protected>} />

            </Routes>
            <Toaster position="top-right" />
          </FileProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
