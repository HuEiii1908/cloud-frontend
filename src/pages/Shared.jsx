import { useState, useEffect } from "react";
import { Share2, User } from "lucide-react";

export default function Shared() {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch shared files from API
    // For now, we'll simulate loading
    const timer = setTimeout(() => {
      setSharedFiles([
        {
          id: 1,
          name: "Shared Document.pdf",
          sharedBy: "John Doe",
          sharedAt: new Date().toISOString(),
          size: 2048000,
          type: "application/pdf"
        },
        {
          id: 2,
          name: "Project Files",
          sharedBy: "Jane Smith",
          sharedAt: new Date().toISOString(),
          size: 0,
          type: "folder"
        }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Đang tải...</div>
      </div>
    );
  }

  if (sharedFiles.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <Share2 className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Chưa có tệp được chia sẻ
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Các tệp được chia sẻ với bạn sẽ xuất hiện ở đây
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Share2 /> Được chia sẻ với tôi
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sharedFiles.map((file) => (
          <div
            key={file.id}
            className="group p-4 bg-white dark:bg-[#2b2b2b] border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
          >
            {file.type === "folder" ? (
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded mb-2 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            )}

            <p className="text-center text-sm font-medium truncate text-gray-900 dark:text-gray-100 mb-1">
              {file.name}
            </p>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Chia sẻ bởi {file.sharedBy}
            </p>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-1">
              {new Date(file.sharedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
