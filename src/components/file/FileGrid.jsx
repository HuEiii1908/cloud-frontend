import { motion } from "framer-motion";
import {
  FileText,
  Folder,
  Trash2,
  Star,
  Eye,
  Edit,
  Download,
  CheckSquare,
  Square,
  MoreVertical
} from "lucide-react";
import { useState } from "react";

export default function FileGrid({
  files,
  selectedFiles = [],
  onFileSelect,
  onPreview,
  onDelete,
  onRename,
  onDownload,
}) {
  const [hoveredFile, setHoveredFile] = useState(null);

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Thư mục trống</p>
      </div>
    );
  }

  const isSelected = (file) => selectedFiles.some(f => f.key === file.key);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file, index) => {
        const selected = isSelected(file);
        const hovered = hoveredFile === file.key;

        return (
          <motion.div
            key={file.key || file.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`group relative bg-white dark:bg-[#202124] border rounded-lg hover:shadow-md transition-all cursor-pointer select-none ${
              selected
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            onMouseEnter={() => setHoveredFile(file.key)}
            onMouseLeave={() => setHoveredFile(null)}
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey) {
                onFileSelect(file, !selected);
              } else if (file.is_folder) {
                onPreview(file);
              } else {
                onFileSelect(file, !selected);
              }
            }}
          >
            {/* Checkbox */}
            <div className={`absolute top-2 left-2 z-10 ${selected || hovered ? "opacity-100" : "opacity-0"} transition-opacity`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(file, !selected);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2b2b2b] rounded"
              >
                {selected ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>

            {/* Action buttons */}
            <div className={`absolute top-2 right-2 flex gap-1 ${hovered && !selected ? "opacity-100" : "opacity-0"} transition-opacity`}>
              {!file.is_folder && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(file);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-[#2b2b2b] rounded"
                  title="Xem trước"
                >
                  <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(file);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2b2b2b] rounded"
                title="Đổi tên"
              >
                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(file);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2b2b2b] rounded"
                title="Tải xuống"
              >
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(file.key);
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            {/* File content */}
            <div className="flex flex-col items-center p-4 text-center">
              {file.is_folder ? (
                <Folder className="w-12 h-12 text-blue-500 mb-2 flex-shrink-0" />
              ) : (
                <FileText className="w-12 h-12 text-gray-500 mb-2 flex-shrink-0" />
              )}

              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate w-full leading-tight">
                {file.name || file.key}
              </p>

              {file.size && !file.is_folder && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round(file.size / 1024)} KB
                </p>
              )}
            </div>

            {/* Star button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement star functionality
              }}
              className={`absolute bottom-2 left-2 ${hovered ? "opacity-100" : "opacity-0"} transition-opacity`}
              title="Gắn dấu sao"
            >
              <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
