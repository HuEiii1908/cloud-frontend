import { createContext, useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import fileAPI from "../api/file.api";

export const FileContext = createContext();

export default function FileProvider({ children }) {
  const [bucket, setBucket] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPath, setCurrentPath] = useState("");

  // ================== Load bucket ==================
  const loadBucket = async () => {
    try {
      const res = await axiosClient.get("/buckets/");
      if (res.data.length > 0) {
        setBucket(res.data[0].name);
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải bucket");
    }
  };

  // ================== Fetch files ==================
  const fetchFiles = async (path = "") => {
    if (!bucket) return;

    setLoading(true);
    try {
      const res = await fileAPI.list(bucket, path); // Pass path parameter
      setFiles(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách tệp");
    }
    setLoading(false);
  };

  // ================== Upload file ==================
  const uploadFile = async (files) => {
    if (!bucket) return console.warn("Bucket chưa load – uploadFile bị bỏ qua");

    if (Array.isArray(files)) {
      // Handle multiple files
      for (const file of files) {
        await fileAPI.uploadFile(bucket, file);
      }
    } else {
      // Handle single file
      await fileAPI.uploadFile(bucket, files);
    }
    await fetchFiles();
  };

  // ================== Upload folder ==================
  const uploadFolder = async (fileList) => {
    if (!bucket) return console.warn("Bucket chưa load – uploadFolder bị bỏ qua");

    await fileAPI.uploadFolder(bucket, fileList); // ✔ API CHUẨN
    await fetchFiles();
  };

  // ================== Create folder ==================
  const createFolder = async (name) => {
    if (!bucket) return;

    await fileAPI.createFolder(bucket, name); // ✔ API CHUẨN
    await fetchFiles();
  };

  // ================== Delete file ==================
  const deleteFile = async (key) => {
    if (!bucket) return;
    await fileAPI.delete(bucket, key);
    await fetchFiles();
  };

  // ================== Rename file ==================
  const renameFile = async (key, newName) => {
    if (!bucket) return;
    await fileAPI.rename(bucket, key, newName);
    await fetchFiles();
  };

  // ================== Navigation functions ==================
  const navigateToFolder = async (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
    await fetchFiles(newPath);
  };

  const navigateToPath = async (path) => {
    setCurrentPath(path);
    await fetchFiles(path);
  };

  const goBack = async () => {
    const pathSegments = currentPath.split('/').filter(Boolean);
    pathSegments.pop();
    const newPath = pathSegments.join('/');
    setCurrentPath(newPath);
    await fetchFiles(newPath);
  };

  const goToRoot = async () => {
    setCurrentPath("");
    await fetchFiles("");
  };

  // ================== INIT ==================
  useEffect(() => {
    loadBucket();
  }, []);

  useEffect(() => {
    if (bucket) fetchFiles(currentPath);
  }, [bucket, currentPath]);

  // ================== Trash functions ==================
  const [trash, setTrash] = useState([]);

  const moveToTrash = async (key) => {
    if (!bucket) return;
    // In a real implementation, this would call an API to move to trash
    // For now, we'll just remove from files and add to trash
    const fileToTrash = files.find(f => f.key === key);
    if (fileToTrash) {
      setFiles(prev => prev.filter(f => f.key !== key));
      setTrash(prev => [...prev, { ...fileToTrash, deletedAt: new Date() }]);
    }
  };

  const restoreFile = async (key) => {
    const fileToRestore = trash.find(f => f.key === key);
    if (fileToRestore) {
      setTrash(prev => prev.filter(f => f.key !== key));
      setFiles(prev => [...prev, fileToRestore]);
    }
  };

  const deleteForever = async (key) => {
    if (!bucket) return;
    await fileAPI.delete(bucket, key);
    setTrash(prev => prev.filter(f => f.key !== key));
  };

  return (
    <FileContext.Provider
      value={{
        bucket,
        files,
        loading,
        error,
        trash,
        currentPath,
        fetchFiles,
        uploadFile,
        uploadFolder,
        createFolder,
        deleteFile: moveToTrash, // Override deleteFile to use trash
        renameFile,
        restoreFile,
        deleteForever,
        navigateToFolder,
        navigateToPath,
        goBack,
        goToRoot,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}
