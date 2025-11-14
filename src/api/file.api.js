import axiosClient from "../services/axiosClient";

const fileAPI = {
  // List objects
  list: (bucket) => axiosClient.get(`/objects/${bucket}/list/`),

  // Upload 1 file
  uploadFile: (bucket, file, currentPath = "") => {
    const form = new FormData();
    form.append("file", file);
    form.append("key", currentPath + file.name);
    return axiosClient.post(`/objects/${bucket}/upload/`, form);
  },

  // Upload folder (giữ nguyên cấu trúc)
  uploadFolder: (bucket, fileList, currentPath = "") => {
    const form = new FormData();
    for (const f of fileList) {
      form.append("files", f);
      form.append("paths", currentPath + f.webkitRelativePath);
    }
    return axiosClient.post(`/objects/${bucket}/upload-folder/`, form);
  },

  // ⬅⬅ FIX QUAN TRỌNG — ĐÚNG ROUTE BACKEND
  createFolder: (bucket, name) => {
    return axiosClient.post(`/${bucket}/folders/create/`, {
      folder_path: name + "/",
    });
  },

  // Delete file
  delete: (bucket, key) => {
    return axiosClient.delete(`/objects/${bucket}/delete/`, {
      data: { key },
    });
  },

  // Rename file
  rename: (bucket, oldKey, newName) => {
    const newKey =
      oldKey.split("/").slice(0, -1).join("/") + "/" + newName;

    return axiosClient.post(`/objects/${bucket}/rename/`, {
      old_key: oldKey,
      new_key: newKey,
    });
  },
};

export default fileAPI;
