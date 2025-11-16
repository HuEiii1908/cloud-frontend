import React, { useState } from "react";
import fileAPI from "../../api/file.api";
import { useFile } from "../../hooks/useFile";

export default function UploadModal({ onClose }) {
  const { bucket, uploadFile, uploadFolder } = useFile();
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
  };

  const handleUpload = async () => {
    if (!files.length) return;

    // Kiểm tra nếu có webkitRelativePath → là upload folder
    const isFolderUpload = files.some((f) => f.webkitRelativePath && f.webkitRelativePath !== "");

    if (isFolderUpload) {
      // Upload folder
      await uploadFolder(files);
    } else {
      // Upload files
      await uploadFile(files);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-6 w-96 max-w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Tải lên tệp</h3>

        <input
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-gray-50 dark:bg-[#3c4043] dark:text-gray-100"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3c4043] rounded"
          >
            Hủy
          </button>
          <button
            onClick={handleUpload}
            disabled={!files.length}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tải lên
          </button>
        </div>
      </div>
    </div>
  );
}
