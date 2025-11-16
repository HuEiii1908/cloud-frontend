import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PreviewModal({ isOpen, file, onClose }) {
  if (!file) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white dark:bg-[#2b2b2b] rounded-lg shadow-xl w-11/12 max-w-4xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-gray-100 truncate">
                {file.name}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-[#3c4043]"
              >
                <X />
              </button>
            </div>
            <div className="h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-[#202124]">
              {file.url ? (
                file.content_type?.includes("image") ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="max-h-full max-w-full rounded"
                  />
                ) : file.content_type?.includes("video") ? (
                  <video src={file.url} controls className="max-h-full max-w-full" />
                ) : file.content_type?.includes("pdf") ? (
                  <iframe
                    src={file.url}
                    title={file.name}
                    className="w-full h-full border-none"
                  ></iframe>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500">
                    Không thể xem trước loại tệp này.
                  </p>
                )
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 dark:text-gray-500 mb-4">Tệp không có URL xem trước</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tên: {file.name || file.key}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Kích thước: {file.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : "Không xác định"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loại: {file.content_type || "Không xác định"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
