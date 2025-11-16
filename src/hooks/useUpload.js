import { useFile } from "./useFile";

export default function useUpload() {
  const { bucket, uploadFile, uploadFolder } = useFile();

  const upload = async (fileList) => {
    if (!bucket) {
      console.error("❌ Bucket is undefined — cannot upload");
      return;
    }

    const files = Array.from(fileList || []);

    // Check if it's a folder upload
    const isFolderUpload = files.some((f) => f.webkitRelativePath && f.webkitRelativePath !== "");

    if (isFolderUpload) {
      await uploadFolder(files);
    } else {
      await uploadFile(files);
    }

    return { success: true };
  };

  return { upload };
}
