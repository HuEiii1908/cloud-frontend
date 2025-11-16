import { useState } from "react";
import { Trash2, RotateCcw, X } from "lucide-react";
import { useFile } from "../hooks/useFile";

export default function Trash() {
  const { trash, restoreFile, deleteForever } = useFile();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSelectFile = (fileKey) => {
    setSelectedFiles(prev =>
      prev.includes(fileKey)
        ? prev.filter(key => key !== fileKey)
        : [...prev, fileKey]
    );
  };

  const handleRestoreSelected = () => {
    selectedFiles.forEach(key => restoreFile(key));
    setSelectedFiles([]);
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Xóa vĩnh viễn ${selectedFiles.length} tệp đã chọn?`)) {
      selectedFiles.forEach(key => deleteForever(key));
      setSelectedFiles([]);
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm("Bạn có chắc muốn xóa vĩnh viễn tất cả tệp trong thùng rác?")) {
      trash.forEach(file => deleteForever(file.key));
    }
  };

  if (trash.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <Trash2 className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Thùng rác trống
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Các tệp đã xóa sẽ xuất hiện ở đây
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Trash2 /> Thùng rác
        </h1>

        <div className="flex gap-2">
          {selectedFiles.length > 0 && (
            <>
              <button
                onClick={handleRestoreSelected}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Khôi phục ({selectedFiles.length})
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
              >
                <X size={16} />
                Xóa vĩnh viễn ({selectedFiles.length})
              </button>
            </>
          )}

          <button
            onClick={handleEmptyTrash}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Xóa tất cả
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {trash.map((file) => (
          <div
            key={file.key}
            className={`group p-4 bg-white dark:bg-[#2b2b2b] border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer ${
              selectedFiles.includes(file.key)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600'
            }`}
            onClick={() => handleSelectFile(file.key)}
          >
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>

            <p className="text-center text-sm font-medium truncate text-gray-900 dark:text-gray-100 mb-1">
              {file.name || file.key}
            </p>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Đã xóa {file.deletedAt ? new Date(file.deletedAt).toLocaleDateString() : 'mới đây'}
            </p>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  restoreFile(file.key);
                }}
                className="p-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                title="Khôi phục"
              >
                ↺
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Xóa vĩnh viễn "${file.name || file.key}"?`)) {
                    deleteForever(file.key);
                  }
                }}
                className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                title="Xóa vĩnh viễn"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
