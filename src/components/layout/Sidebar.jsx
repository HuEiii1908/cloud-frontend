import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Home,
  HardDrive,
  Monitor,
  Users,
  Clock,
  Star,
  Trash2,
  Database,
  Upload,
  FolderPlus,
  Folder
} from "lucide-react";

export default function Sidebar({ onUploadClick, onUploadFolder, onCreateFolder }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col h-screen">

      {/* NEW BUTTON */}
      <div className="relative p-4" ref={menuRef}>
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 w-full transition"
        >
          <Plus className="w-5 h-5" />
          Mới
        </button>

        {openMenu && (
          <div className="absolute mt-2 w-52 bg-white border rounded-xl shadow-lg py-2 z-50">

            {/* Upload file */}
            <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800">
              <Upload className="w-4 h-4" />
              Tải tệp lên
              <input type="file" className="hidden" onChange={onUploadClick} />
            </label>

            {/* Upload folder */}
            <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800">
              <Folder className="w-4 h-4" />
              Tải thư mục lên
              <input
                type="file"
                webkitdirectory="true"
                directory="true"
                className="hidden"
                onChange={onUploadFolder}
              />
            </label>

            {/* Create folder */}
            <button
              onClick={onCreateFolder}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left text-gray-800"
            >
              <FolderPlus className="w-4 h-4" />
              Thư mục mới
            </button>
          </div>
        )}
      </div>

      {/* MAIN SIDEBAR MENU */}
      <nav className="flex-1 px-4 text-gray-700">
        <MenuItem icon={<Home />} label="Trang chủ" />
        <MenuItem icon={<HardDrive />} label="Drive của tôi" active />
        <MenuItem icon={<Monitor />} label="Máy tính" />
        <MenuItem icon={<Users />} label="Được chia sẻ với tôi" />
        <MenuItem icon={<Clock />} label="Gần đây" />
        <MenuItem icon={<Star />} label="Có gắn dấu sao" />
        <MenuItem icon={<Trash2 />} label="Nội dung rác" />
        <MenuItem icon={<Trash2 />} label="Thùng rác" />

        <div className="mt-4">
          <MenuItem
            icon={<Database />}
            label="Bộ nhớ"
            onClick={() => (window.location.href = "/storage")}
          />
        </div>
      </nav>

      {/* STORAGE BAR */}
      <div className="p-4 border-t text-sm text-gray-700">
        <p className="text-gray-600 mb-1">
          Đã dùng: <span className="font-semibold">1.1 GB</span> / 15 GB
        </p>

        <div className="w-full h-2 bg-gray-200 rounded mt-1">
          <div className="h-full bg-blue-500 rounded" style={{ width: "10%" }}></div>
        </div>

        <button className="text-blue-600 hover:underline text-sm mt-2">
          Mua thêm bộ nhớ
        </button>
      </div>
    </aside>
  );
}

function MenuItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg mb-1 ${
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "hover:bg-gray-100 text-gray-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
