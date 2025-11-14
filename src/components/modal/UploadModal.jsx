import React, { useState } from "react";
import storage from "../../services/storage.service";
import useFile from "../../hooks/useFile";

export default function UploadModal({ onClose }) {
  const { currentBucket, currentPath, fetchFiles } = useFile();
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
  };

  const handleUpload = async () => {
    if (!files.length) return;

    // Kiểm tra nếu có webkitRelativePath → là upload folder
    const isFolderUpload = files.some((f) => f.webkitRelativePath && f.webkitRelativePath !== "");

    const formData = new FormData();

    if (isFolderUpload) {
      // -------------------------
      // ⭐ UPLOAD FOLDER
      // -------------------------
      files.forEach((file) => {
        formData.append("files", file);
        formData.append("paths", file.webkitRelativePath); // ví dụ: "MyFolder/sub/a.png"
      });

      await storage.uploadFolder(currentBucket, formData);
    } else {
      // -------------------------
      // ⭐ UPLOAD FILE
      // -------------------------
      for (let file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("key", currentPath + file.name);
        await storage.uploadFile(currentBucket, fd);
      }
    }

    fetchFiles();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <h3>Tải lên</h3>

        <input
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleFileChange}
        />

        <div className="actions">
          <button onClick={onClose}>Hủy</button>
          <button onClick={handleUpload} className="btn-primary">
            Tải lên
          </button>
        </div>
      </div>
    </div>
  );
}
