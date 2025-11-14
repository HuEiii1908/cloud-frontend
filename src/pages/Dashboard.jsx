import React, { useState } from "react";
import { useFile } from "../hooks/useFile";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import { Folder, File } from "lucide-react";

export default function Dashboard() {
  const {
    files,
    loading,
    error,
    uploadFile,
    uploadFolder,
    deleteFile,
    renameFile,
    createFolder,
    fetchFiles,
  } = useFile();

  const [search, setSearch] = useState("");
  const [renameData, setRenameData] = useState({ key: "", newName: "" });

  const filteredFiles = files.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Upload file
  const handleUploadFile = (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    uploadFile(selectedFiles);
  };

  // Upload folder giữ nguyên cấu trúc
  const handleUploadFolder = (e) => {
    const folderFiles = e.target.files;
    if (!folderFiles || folderFiles.length === 0) return;

    uploadFolder(folderFiles);
  };

  // Tạo thư mục
  const handleCreateFolder = () => {
    const name = prompt("Nhập tên thư mục mới:");
    if (name) createFolder(name);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar
        onUploadFile={handleUploadFile}
        onUploadFolder={handleUploadFolder}
        onCreateFolder={handleCreateFolder}
      />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header search={search} setSearch={setSearch} />

        {/* MAIN CONTENT */}
        <main className="p-6">

          <h1 className="text-2xl font-semibold mb-4">Drive của tôi</h1>

          {loading && (
            <div className="text-gray-500 text-center py-10">Đang tải...</div>
          )}

          {error && (
            <div className="text-red-500 text-center py-10">
              {error}
            </div>
          )}

          {!loading && filteredFiles.length === 0 && (
            <div className="text-center text-gray-500 py-20">
              <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Không có tệp nào trong thư mục này</p>
            </div>
          )}

          {!loading && filteredFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

              {filteredFiles.map((item) => (
                <div
                  key={item.key}
                  className="group p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                >
                  {item.is_folder ? (
                    <Folder className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  ) : (
                    <File className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  )}

                  <p className="text-center text-sm font-medium truncate">
                    {item.name || item.key}
                  </p>
                </div>
              ))}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
