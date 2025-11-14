import axiosClient from "../services/axiosClient";

const folderAPI = {
  create: (bucket, name) =>
    axiosClient.post(`/objects/${bucket}/create_folder/`, { name }),

  delete: (bucket, key) =>
    axiosClient.delete(`/objects/${bucket}/delete/`, { data: { key } }),

  rename: (bucket, oldKey, newKey) =>
    axiosClient.post(`/objects/${bucket}/rename_folder/`, {
      old_key: oldKey,
      new_key: newKey,
    }),
};

export default folderAPI;
