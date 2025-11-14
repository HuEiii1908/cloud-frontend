import { createContext, useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import fileAPI from "../api/file.api";

export const FileContext = createContext();

export default function FileProvider({ children }) {
  const [bucket, setBucket] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  const fetchFiles = async () => {
    if (!bucket) return;

    setLoading(true);
    try {
      const res = await fileAPI.list(bucket); // ✔ CHUẨN
      setFiles(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách tệp");
    }
    setLoading(false);
  };

  // ================== Upload file ==================
  const uploadFile = async (file) => {
    if (!bucket) return console.warn("Bucket chưa load – uploadFile bị bỏ qua");

    await fileAPI.uploadFile(bucket, file);   // ✔ SỬA ĐÚNG TÊN
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

  // ================== INIT ==================
  useEffect(() => {
    loadBucket();
  }, []);

  useEffect(() => {
    if (bucket) fetchFiles();
  }, [bucket]);

  return (
    <FileContext.Provider
      value={{
        bucket,
        files,
        loading,
        error,
        fetchFiles,
        uploadFile,
        uploadFolder,
        createFolder,
        deleteFile,
        renameFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}
