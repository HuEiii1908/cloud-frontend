import fileAPI from "../api/file.api";
import useFile from "./useFile";

export default function useUpload() {
  const { currentPath, bucket, addFiles } = useFile();

  const upload = async (fileList) => {
    if (!bucket) {
      console.error("❌ Bucket is undefined — cannot upload");
      return;
    }

    const files = Array.from(fileList || []);

    const results = await Promise.all(
      files.map((f) => fileAPI.upload(bucket, f, currentPath))
    );

    // Thêm kết quả trả về từ API vào danh sách file
    addFiles(results.map((r) => r.data));

    return results;
  };

  return { upload };
}
