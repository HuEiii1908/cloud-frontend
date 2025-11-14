import { useEffect, useState } from "react";
import { Database } from "lucide-react";
import { useFile } from "../hooks/useFile";

export default function Storage() {
  const { files, fetchFiles } = useFile();
  const [sortBy, setSortBy] = useState("size");

  useEffect(() => {
    fetchFiles();
  }, []);

  const total = 15 * 1024 * 1024 * 1024; // 15GB
  const used = files.reduce((s, f) => s + (f.size || 0), 0);
  const percent = (used / total) * 100;

  // Convert StorageObject -> data hiển thị
  const normalized = files.map((f) => ({
    ...f,
    name: f.key.split("/").pop(),
    modified: f.last_modified,
    type: f.content_type?.split("/")[0] || "file",
  }));

  const sorted = [...normalized].sort((a, b) => {
    if (sortBy === "size") return (b.size || 0) - (a.size || 0);
    if (sortBy === "recent") return new Date(b.modified) - new Date(a.modified);
    return 0;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Database /> Bộ nhớ
      </h1>

      {/* STORAGE BAR */}
      <div className="mb-6">
        <div className="text-lg font-medium">
          Đã dùng: {(used / 1024 / 1024 / 1024).toFixed(2)} GB / 15 GB
        </div>

        <div className="w-full h-3 bg-gray-200 rounded mt-2">
          <div
            className="h-3 bg-blue-600 rounded"
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Mua thêm bộ nhớ
        </button>
      </div>

      {/* SORT BAR */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setSortBy("size")}
          className={`px-3 py-2 rounded border ${
            sortBy === "size" ? "bg-blue-100 border-blue-400" : ""
          }`}
        >
          Dung lượng
        </button>

        <button
          onClick={() => setSortBy("recent")}
          className={`px-3 py-2 rounded border ${
            sortBy === "recent" ? "bg-blue-100 border-blue-400" : ""
          }`}
        >
          Lần sửa đổi gần nhất
        </button>
      </div>

      {/* FILE LIST */}
      <div className="bg-white border rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Tên</th>
              <th className="px-4 py-3 text-left">Loại</th>
              <th className="px-4 py-3 text-right">Dung lượng</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((file) => (
              <tr key={file.key} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{file.name}</td>
                <td className="px-4 py-3">{file.type}</td>
                <td className="px-4 py-3 text-right">
                  {file.size
                    ? (file.size / 1024 / 1024).toFixed(2) + " MB"
                    : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
