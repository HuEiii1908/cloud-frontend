import React, { useState, useContext } from "react";
import { useFile } from "../hooks/useFile";
import { ThemeContext } from "../context/ThemeContext";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Breadcrumb from "../components/layout/Breadcrumb";
import FileGrid from "../components/file/FileGrid";
import FileList from "../components/file/FileList";
import PreviewModal from "../components/modal/PreviewModal";
import RenameModal from "../components/modal/RenameModal";
import UploadModal from "../components/modal/UploadModal";

import {
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Download,
  Trash2,
  Plus,
  Upload,
  Folder,
  ChevronDown,
  Filter,
  Image,
  FileText,
  Video,
  Moon,
  Sun
} from "lucide-react";

export default function Dashboard() {
  const {
    files,
    loading,
    error,
    currentPath,
    uploadFile,
    uploadFolder,
    deleteFile,
    renameFile,
    createFolder,
    navigateToFolder,
  } = useFile();

  const { theme, toggleTheme } = useContext(ThemeContext);

  // State management
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("name"); // "name", "modified", "size", "type"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [showSortMenu, setShowSortMenu] = useState(false);

  // Modal states
  const [previewFile, setPreviewFile] = useState(null);
  const [renameFileData, setRenameFileData] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [filterType, setFilterType] = useState("all"); // "all", "images", "documents", "videos", "folders"
  const [dateFilter, setDateFilter] = useState("all"); // "all", "today", "week", "month"
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter and sort files
  const filteredFiles = files
    .filter((item) => {
      // Search filter
      const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());

      // Type filter
      let matchesType = true;
      if (filterType !== "all") {
        if (filterType === "folders") {
          matchesType = item.is_folder;
        } else if (filterType === "images") {
          matchesType = !item.is_folder && (item.type?.startsWith("image/") || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.name));
        } else if (filterType === "documents") {
          matchesType = !item.is_folder && (item.type?.includes("document") || /\.(pdf|doc|docx|txt|rtf)$/i.test(item.name));
        } else if (filterType === "videos") {
          matchesType = !item.is_folder && (item.type?.startsWith("video/") || /\.(mp4|avi|mkv|mov|wmv)$/i.test(item.name));
        }
      }

      // Date filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const itemDate = new Date(item.lastModified || 0);
        const now = new Date();
        const diffTime = now - itemDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (dateFilter === "today") {
          matchesDate = diffDays < 1;
        } else if (dateFilter === "week") {
          matchesDate = diffDays < 7;
        } else if (dateFilter === "month") {
          matchesDate = diffDays < 30;
        }
      }

      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "modified":
          aValue = new Date(a.lastModified || 0);
          bValue = new Date(b.lastModified || 0);
          break;
        case "size":
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case "type":
          aValue = a.is_folder ? "folder" : (a.type || "file");
          bValue = b.is_folder ? "folder" : (b.type || "file");
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

  // File operations
  const handleFileSelect = (file, isSelected) => {
    if (isSelected) {
      setSelectedFiles(prev => [...prev, file]);
    } else {
      setSelectedFiles(prev => prev.filter(f => f.key !== file.key));
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles);
    }
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return;
    if (window.confirm(`Delete ${selectedFiles.length} selected items?`)) {
      selectedFiles.forEach(file => deleteFile(file.key));
      setSelectedFiles([]);
    }
  };

  const handleBulkDownload = () => {
    selectedFiles.forEach(file => handleDownload(file));
  };

  const handleDownload = (file) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name || file.key;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Download URL not available');
    }
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) createFolder(name);
    setShowNewMenu(false);
  };

  const handleUploadFile = (files) => {
    uploadFile(files);
    setUploadModalOpen(false);
  };

  const handleUploadFolder = (files) => {
    uploadFolder(files);
    setUploadModalOpen(false);
  };

  const handlePreview = (file) => {
    if (file.is_folder) {
      navigateToFolder(file.name || file.key);
    } else {
      setPreviewFile(file);
    }
  };

  // Sort handlers
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
    setShowSortMenu(false);
  };

  const getSortLabel = () => {
    const labels = {
      name: "Tên",
      modified: "Ngày sửa đổi",
      size: "Kích thước",
      type: "Loại"
    };
    return `${labels[sortBy]} ${sortOrder === "asc" ? "↑" : "↓"}`;
  };

  return (
    <div className="flex bg-white dark:bg-[#202124] min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header
          search={search}
          setSearch={setSearch}
          selectedCount={selectedFiles.length}
          onSelectAll={handleSelectAll}
          allSelected={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
        />

        {/* Toolbar */}
        <div className="h-14 bg-white dark:bg-[#202124] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">

          {/* Left side - Breadcrumb and New button */}
          <div className="flex items-center gap-4">
            <Breadcrumb currentPath={currentPath} />

            {/* New button */}
            <div className="relative">
              <button
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Mới
              </button>

              {showNewMenu && (
                <div className="absolute mt-2 w-48 bg-white dark:bg-[#2b2b2b] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200"
                  >
                    <Upload className="w-4 h-4" />
                    Tải tệp lên
                  </button>
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200"
                  >
                    <Folder className="w-4 h-4" />
                    Tải thư mục lên
                  </button>
                  <button
                    onClick={handleCreateFolder}
                    className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200"
                  >
                    <Folder className="w-4 h-4" />
                    Thư mục mới
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right side - View toggles and sort */}
          <div className="flex items-center gap-2">
            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2b2b2b] text-gray-700 dark:text-gray-300"
              >
                <Filter className="w-4 h-4" />
                Lọc
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#2b2b2b] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 z-50">
                  {/* Type filters */}
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Loại tệp</p>
                    <div className="space-y-1">
                      <button
                        onClick={() => setFilterType("all")}
                        className={`flex items-center gap-2 px-3 py-1 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${filterType === "all" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        Tất cả
                      </button>
                      <button
                        onClick={() => setFilterType("folders")}
                        className={`flex items-center gap-2 px-3 py-1 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${filterType === "folders" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        <Folder className="w-4 h-4" />
                        Thư mục
                      </button>
                      <button
                        onClick={() => setFilterType("images")}
                        className={`flex items-center gap-2 px-3 py-1 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${filterType === "images" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        <Image className="w-4 h-4" />
                        Hình ảnh
                      </button>
                      <button
                        onClick={() => setFilterType("documents")}
                        className={`flex items-center gap-2 px-3 py-1 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${filterType === "documents" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        <FileText className="w-4 h-4" />
                        Tài liệu
                      </button>
                      <button
                        onClick={() => setFilterType("videos")}
                        className={`flex items-center gap-2 px-3 py-1 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${filterType === "videos" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        <Video className="w-4 h-4" />
                        Video
                      </button>
                    </div>
                  </div>

                  {/* Date filters */}
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Thời gian</p>
                    <div className="space-y-1">
                      <button
                        onClick={() => setDateFilter("all")}
                        className={`flex items-center gap-2 px-3 py-1 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${dateFilter === "all" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        Tất cả
                      </button>
                      <button
                        onClick={() => setDateFilter("today")}
                        className={`flex items-center gap-2 px-3 py-1 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${dateFilter === "today" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        Hôm nay
                      </button>
                      <button
                        onClick={() => setDateFilter("week")}
                        className={`flex items-center gap-2 px-3 py-1 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${dateFilter === "week" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        Tuần này
                      </button>
                      <button
                        onClick={() => setDateFilter("month")}
                        className={`flex items-center gap-2 px-3 py-1 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${dateFilter === "month" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        Tháng này
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2b2b2b] text-gray-700 dark:text-gray-300"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                {getSortLabel()}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2b2b2b] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => handleSortChange("name")}
                    className={`flex items-center justify-between px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${sortBy === "name" ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    Tên
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortChange("modified")}
                    className={`flex items-center justify-between px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${sortBy === "modified" ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    Ngày sửa đổi
                    {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortChange("size")}
                    className={`flex items-center justify-between px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${sortBy === "size" ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    Kích thước
                    {sortBy === "size" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortChange("type")}
                    className={`flex items-center justify-between px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-800 dark:text-gray-200 ${sortBy === "type" ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    Loại
                    {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              )}
            </div>

            {/* View toggles */}
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-[#2b2b2b] text-gray-600 dark:text-gray-400"}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-[#2b2b2b] text-gray-600 dark:text-gray-400"}`}
            >
              <List className="w-5 h-5" />
            </button>

            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b2b2b] text-gray-600 dark:text-gray-400"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bulk actions bar */}
        {selectedFiles.length > 0 && (
          <div className="h-12 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between px-6">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedFiles.length} mục đã chọn
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDownload}
                className="flex items-center gap-2 px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded"
              >
                <Download className="w-4 h-4" />
                Tải xuống
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">

          {loading && (
            <div className="text-gray-500 dark:text-gray-400 text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Đang tải...
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center py-20">
              {error}
            </div>
          )}

          {!loading && filteredFiles.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-20">
              <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Không có tệp nào trong thư mục này</p>
            </div>
          )}

          {!loading && filteredFiles.length > 0 && (
            <>
              {viewMode === "grid" ? (
                <FileGrid
                  files={filteredFiles}
                  selectedFiles={selectedFiles}
                  onFileSelect={handleFileSelect}
                  onPreview={handlePreview}
                  onDelete={(key) => {
                    const file = files.find(f => f.key === key);
                    if (file && window.confirm(`Delete ${file.name}?`)) {
                      deleteFile(key);
                    }
                  }}
                  onRename={setRenameFileData}
                  onDownload={handleDownload}
                />
              ) : (
                <FileList
                  files={filteredFiles}
                  selectedFiles={selectedFiles}
                  onFileSelect={handleFileSelect}
                  onPreview={handlePreview}
                  onDelete={(key) => {
                    const file = files.find(f => f.key === key);
                    if (file && window.confirm(`Delete ${file.name}?`)) {
                      deleteFile(key);
                    }
                  }}
                  onRename={setRenameFileData}
                  onDownload={handleDownload}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <PreviewModal
        isOpen={!!previewFile}
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <RenameModal
        isOpen={!!renameFileData}
        file={renameFileData}
        onClose={() => setRenameFileData(null)}
        onRename={(newName) => {
          if (renameFileData) {
            renameFile(renameFileData.key, newName);
            setRenameFileData(null);
          }
        }}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadFile={handleUploadFile}
        onUploadFolder={handleUploadFolder}
      />
    </div>
  );
}
