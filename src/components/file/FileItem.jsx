import { useState } from "react";
import { Download, Trash2, Edit3, Eye } from "lucide-react";
import { formatFileSize } from "../../utils/formatFileSize";

export default function FileItem({
  file,
  onPreview = () => {},
  onDelete = () => {},     // ✅ fallback an toàn
  onRename = () => {},
  onDownload = () => {},
}) {
  const [hover, setHover] = useState(false);

  const handleDelete = () => {
    if (typeof onDelete === "function") onDelete(file.key || file.id);
  };

  const handleRename = () => {
    if (typeof onRename === "function") onRename(file);
  };

  const handlePreview = () => {
    if (typeof onPreview === "function") onPreview(file);
  };

  const handleDownload = () => {
    if (typeof onDownload === "function") onDownload(file);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative group bg-white dark:bg-[#2b2b2b] border border-gray-200 dark:border-transparent hover:border-blue-400 dark:hover:border-gray-600 rounded-lg p-4 cursor-pointer transition-all duration-200"
    >
      <div className="truncate font-medium text-gray-800 dark:text-gray-100 mb-2">
        {file.name || file.key}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {formatFileSize(file.size || 0)}
      </div>

      {hover && (
        <div className="absolute top-2 right-2 flex gap-2 bg-white/80 dark:bg-[#3c4043]/70 rounded-lg p-1">
          <button onClick={handlePreview} title="Xem trước">
            <Eye size={16} className="text-blue-500 hover:scale-110 transition" />
          </button>
          <button onClick={handleDownload} title="Tải xuống">
            <Download size={16} className="text-green-500 hover:scale-110 transition" />
          </button>
          <button onClick={handleRename} title="Đổi tên">
            <Edit3 size={16} className="text-yellow-500 hover:scale-110 transition" />
          </button>
          <button onClick={handleDelete} title="Chuyển vào Thùng rác">
            <Trash2 size={16} className="text-red-500 hover:scale-110 transition" />
          </button>
        </div>
      )}
    </div>
  );
}
