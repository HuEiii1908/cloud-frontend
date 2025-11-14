
export default function Breadcrumb() {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
      <span className="hover:underline cursor-pointer">Drive của tôi</span>

      {/* Subfolder (tạm thời cố định – version sau sẽ dynamic) */}
      {/* <ChevronRight className="w-4 h-4" />
      <span className="hover:underline cursor-pointer">Thư mục A</span> */}
    </div>
  );
}
