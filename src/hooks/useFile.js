import { useContext } from "react";
import { FileContext } from "../context/FileContext";
import fileAPI from "../api/file.api";

export function useFile() {
  const ctx = useContext(FileContext);

  return {
    ...ctx,
    uploadFile: (file) => fileAPI.uploadFile(ctx.bucket, file),
    uploadFolder: (files) => fileAPI.uploadFolder(ctx.bucket, files),
    createFolder: (name) => fileAPI.createFolder(ctx.bucket, name),
  };
}
