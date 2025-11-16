import { motion } from "framer-motion";
import { FileText, Folder, Trash2, Edit, Eye, Download, CheckSquare, Square, Star } from "lucide-react";
import { useState } from "react";
import formatFileSize from "../../utils/formatFileSize";
import formatDate from "../../utils/formatDate";

export default function FileList({
  files,
  selectedFiles = [],
  onFileSelect,
  onPreview,
  onDelete,
  onRename,
  onDownload,
}) {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Không có tệp nào trong thư mục này</p>
      </div>
    );
  }

  const isSelected = (file) => selectedFiles.some(f => f.key === file.key);

  return (
    <div className="w-full bg-white dark:bg-[#202124] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-5 py-3 bg-gray-50 dark:bg-[#2b2b2b] border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400">
        <div className="w-8"></div>
        <div className="flex-1">Tên</div>
        <div className="hidden sm:block w-24 text-right">Kích thước</div>
        <div className="hidden md:block w-32">Sửa đổi lần cuối</div>
        <div className="w-24"></div>
      </div>

      {/* File rows */}
      {files.map((file, index) => {
        const selected = isSelected(file);
        const hovered = hoveredRow === file.key;

        return (
          <motion.div
            key={file.key || file.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`group flex items-center px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#2b2b2b] transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
              selected ? "bg-blue-50 dark:bg-blue-900/20" : ""
            }`}
            onMouseEnter={() => setHoveredRow(file.key)}
            onMouseLeave={() => setHoveredRow(null)}
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
            <div className="w-8 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(file, !selected);
                }}
                className={`p-1 rounded ${selected || hovered ? "opacity-100" : "opacity-0"} transition-opacity`}
              >
                {selected ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>

            {/* File info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {file.is_folder ? (
                <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
              <span className="truncate font-medium text-gray-800 dark:text-gray-100">
                {file.name || file.key}
              </span>
            </div>

            {/* Size */}
            <div className="hidden sm:block w-24 text-right text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
              {file.size && !file.is_folder ? formatFileSize(file.size) : "—"}
            </div>

            {/* Modified date */}
            <div className="hidden md:block w-32 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
              {file.lastModified ? formatDate(file.lastModified) : "—"}
            </div>

            {/* Actions */}
            <div className="w-24 flex items-center justify-end gap-1 flex-shrink-0">
              {/* Star button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement star functionality
                }}
                className={`p-1 rounded ${hovered ? "opacity-100" : "opacity-0"} transition-opacity`}
                title="Gắn dấu sao"
              >
                <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
              </button>

              {/* Action buttons */}
              <div className={`flex gap-1 ${hovered && !selected ? "opacity-100" : "opacity-0"} transition-opacity`}>
                {!file.is_folder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(file);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-[#3c4043] rounded"
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
                  className="p-1 hover:bg-gray-100 dark:hover:bg-[#3c4043] rounded"
                  title="Đổi tên"
                >
                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(file);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-[#3c4043] rounded"
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
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
