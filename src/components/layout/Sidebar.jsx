import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  HardDrive,
  Monitor,
  Users,
  Clock,
  Star,
  Trash2,
  Database,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [storageUsed, setStorageUsed] = useState(1.1);
  const [storageTotal, setStorageTotal] = useState(15);

  const menuItems = [
    { icon: <Home />, label: "Trang chủ", path: "/" },
    { icon: <HardDrive />, label: "Drive của tôi", path: "/dashboard" },
    { icon: <Monitor />, label: "Máy tính", path: "/computer" },
    { icon: <Users />, label: "Được chia sẻ với tôi", path: "/shared" },
    { icon: <Clock />, label: "Gần đây", path: "/recent" },
    { icon: <Star />, label: "Có gắn dấu sao", path: "/starred" },
    { icon: <Trash2 />, label: "Thùng rác", path: "/trash" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">

      {/* MAIN SIDEBAR MENU */}
      <nav className="flex-1 px-2 py-4">
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={location.pathname === item.path}
          />
        ))}

        <div className="mt-4">
          <MenuItem
            icon={<Database />}
            label="Bộ nhớ"
            path="/storage"
            active={location.pathname === "/storage"}
          />
        </div>
      </nav>

      {/* STORAGE BAR */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">
            {storageUsed} GB đã dùng
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {storageTotal} GB
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
          ></div>
        </div>

        <Link
          to="/storage"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm block"
        >
          Mua thêm bộ nhớ
        </Link>
      </div>
    </aside>
  );
}

function MenuItem({ icon, label, path, active }) {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg mb-1 transition-colors ${
        active
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
          : "hover:bg-gray-100 dark:hover:bg-[#2b2b2b] text-gray-700 dark:text-gray-300"
      }`}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
