# ☁️ Google Drive Clone (Frontend)

**Google Drive Clone** là ứng dụng web mô phỏng giao diện và tính năng của Google Drive, được xây dựng bằng **ReactJS + TailwindCSS**.  
Dự án hỗ trợ quản lý file/folder, upload, đổi tên, xóa, khôi phục, tìm kiếm, và hiển thị dạng lưới/danh sách — kết nối trực tiếp với backend API.

---

## 🚀 Demo (sẽ cập nhật sau khi deploy)
🔗 **Link Demo:** *đang cập nhật...*

---

## 🧱 Công nghệ sử dụng

| Công nghệ | Mục đích |
|------------|-----------|
| ⚛️ **ReactJS (Vite / CRA)** | Xây dựng giao diện người dùng |
| 💅 **TailwindCSS** | Thiết kế UI nhanh, responsive, dark/light mode |
| 🔄 **Axios** | Gọi API backend (upload / list / delete file) |
| 🧠 **Context API** | Quản lý trạng thái toàn cục (Auth, File) |
| 🧩 **React Router v6** | Điều hướng trang (Login, Dashboard, Trash, Shared) |
| 🗂️ **Lucide React** | Bộ icon hiện đại tương tự Google |
| ⚙️ **Vercel / Netlify** | Triển khai frontend |

---

## ⚙️ Cấu trúc thư mục

src/
├── api/ # Gọi API backend
│ ├── auth.api.js
│ ├── file.api.js
│ ├── folder.api.js
│ └── user.api.js
│
├── assets/ # Hình ảnh, icon, minh họa
│
├── components/ # Component tái sử dụng
│ ├── common/
│ ├── file/
│ ├── folder/
│ ├── layout/
│ └── modal/
│
├── context/ # Context API (AuthContext, FileContext)
├── hooks/ # Custom hooks (useAuth, useFile)
├── pages/ # Các trang chính (Dashboard, Login, Register, Trash, Shared)
├── routes/ # Cấu hình routing
├── services/ # axiosClient, storage.service
├── utils/ # formatDate, formatFileSize, mimeTypes
└── App.js # Root component


---

## 💡 Các tính năng nổi bật

- 🔐 **Xác thực người dùng**
  - Đăng nhập, đăng ký (form chuẩn @gmail.com)
  - Token lưu trong localStorage
  - Bảo vệ route (ProtectedRoute)

- 🗂️ **Quản lý file/folder**
  - Upload, xóa, đổi tên, tạo thư mục
  - Khôi phục file đã xóa
  - Duyệt file theo folder (path breadcrumb)
  - Tìm kiếm realtime

- 🖼️ **Giao diện người dùng**
  - Giao diện giống **Google Drive**
  - Dark/light theme (có thể mở rộng)
  - Hai chế độ hiển thị: **Lưới** / **Danh sách**
  - Modal rename / upload / preview cực mượt

- ⚡ **Hiệu năng**
  - Code tách modular
  - Gọi API qua `axiosClient` có interceptor
  - Xử lý async/await mượt mà

---

## 🔌 Cấu hình backend (yêu cầu)
Ứng dụng frontend kết nối tới API backend tại:
http://192.168.0.102:8000/api
Hoặc nếu bạn test cục bộ, đổi trong file:
src/services/axiosClient.js
```js
 baseURL: "http://localhost:8000/api"

