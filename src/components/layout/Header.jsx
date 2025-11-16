import { Search, Settings, LogOut, Sun, Moon, CheckSquare, Square, Grid3X3 } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

export default function Header({
  search,
  setSearch,
  selectedCount = 0,
  onSelectAll,
  allSelected = false
}) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      logout();
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#1f1f1f] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-40">

      {/* LEFT SIDE - Search and Select All */}
      <div className="flex items-center gap-4">
        {/* Select All Checkbox */}
        {onSelectAll && (
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2b2b2b] px-2 py-1 rounded"
            title={allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          >
            {allSelected ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5" />
            )}
            {selectedCount > 0 && (
              <span className="text-sm font-medium">{selectedCount} đã chọn</span>
            )}
          </button>
        )}

        {/* SEARCH BAR */}
        <div className="flex items-center bg-gray-100 dark:bg-[#2b2b2b] rounded-lg px-4 py-2 w-96">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Tìm trong Drive"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 bg-transparent outline-none flex-1 text-sm text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] transition-colors"
          title={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-black dark:hover:text-white transition-colors" />
        <Grid3X3 className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-black dark:hover:text-white transition-colors" />

        <button
          onClick={handleLogout}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Avatar user */}
        <img
          src="https://i.pravatar.cc/40"
          className="w-9 h-9 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
          alt="avatar"
        />
      </div>
    </header>
  );
}
