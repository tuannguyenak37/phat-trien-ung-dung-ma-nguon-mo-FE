Chào bạn Cinis,

Lỗi bạn gặp phải thường do 2 nguyên nhân chính khi hiển thị trên GitHub (hoặc các trình render Markdown phổ biến):

Thuộc tính style="..." bị chặn: GitHub Flavored Markdown sẽ loại bỏ (strip) các thuộc tính style inline vì lý do bảo mật. Do đó style="margin-right: 10px;" sẽ không hoạt động.

Khoảng trắng (Spacing): Đôi khi viết thẻ HTML dính liền nhau hoặc dính liền với text mà không xuống dòng có thể gây lỗi hiển thị.

Dưới đây là phiên bản README.md đã được sửa lỗi hoàn chỉnh. Mình đã thay thế phần style bằng cách dùng khoảng trắng tự nhiên và chỉnh lại cấu trúc thẻ div ở cuối cho chuẩn.

Các thay đổi chính mình đã thực hiện:
Phần Ảnh demo: Bỏ style, dùng &nbsp; (khoảng trắng cứng) để tạo khoảng cách giữa 2 ảnh.

Phần Footer: Đảm bảo thẻ đóng </div> nằm riêng một dòng và nội dung bên trong được bao bọc thẻ <p> hoặc để trần nhưng có xuống dòng rõ ràng.

Clean code: Mình đã sửa lại format các block code (bash) ở phần hướng dẫn cài đặt bị lỗi dư link Markdown.

Bạn có thể copy toàn bộ nội dung dưới đây vào file README.md của bạn nhé:

Markdown

<div align="center">

# 🌐 ĐỀ TÀI 11: COMMUNITY FORUM
### Diễn đàn thảo luận và chia sẻ kiến thức trực tuyến

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

**Môn học:** Phát triển ứng dụng mã nguồn mở  
**Giảng viên hướng dẫn:** GV. Lê Duy Hùng  
**Học kỳ:** 1 - Năm học: 2025 - 2026

---

</div>

## 👥 Thành Viên Nhóm 11

| STT | Họ và Tên | Mã Sinh Viên | Vai Trò | GitHub |
|:---:|:---|:---:|:---|:---:|
| 1 | **Nguyễn Văn Tuấn** | 23050150 | Trưởng nhóm (Fullstack) | [@tuannguyenak37](https://github.com/tuannguyenak37) |
| 2 | **Nguyễn Thị Vân Khánh** | 23050183 | Thành viên (Frontend/UI-UX) | [@ChanhChanh-307](https://github.com/ChanhChanh-307) |

---

## 🔗 Repository Source Code

| Thành phần | Đường dẫn Repository | Mô tả ngắn |
| :--- | :--- | :--- |
| **Backend (Server)** | [![GitHub](https://img.shields.io/badge/GitHub-Backend-181717?logo=github)](https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-BE) | Chứa mã nguồn API (FastAPI), cấu hình Database (PostgreSQL), Migrations. |
| **Frontend (Client)** | [![GitHub](https://img.shields.io/badge/GitHub-Frontend-181717?logo=github)](https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-FE) | Chứa mã nguồn giao diện (Next.js), xử lý gọi API, và tài nguyên tĩnh. |

---

## 📖 1. Tổng Quan Đề Tài

**Community Forum** là một nền tảng mã nguồn mở hiện đại, nơi người dùng có thể đặt câu hỏi, chia sẻ kiến thức và thảo luận về các chủ đề khác nhau. Dự án tập trung vào trải nghiệm người dùng mượt mà (SPA), tối ưu hóa SEO và khả năng tương tác nhanh chóng.

## 🛠 2. Công Nghệ Sử Dụng

| Phân hệ | Công nghệ |
| :--- | :--- |
| **Frontend** | `Next.js 14+` `Tailwind CSS` `React Query` |
| **Backend** | `FastAPI (Python)` `SQLAlchemy` `Pydantic` |
| **Database** | `PostgreSQL` |
| **Authentication** | `JWT` / `NextAuth.js` |
| **Deployment** | `Vercel` (Frontend) & `Render/Railway` (Backend) |

---

## 🚀 3. Hướng Dẫn Cài Đặt (Local Development)

Để chạy toàn bộ dự án, bạn cần cài đặt cả Backend và Frontend.

### 🅰️ Phần Backend (API)

**Bước 1:** Clone và truy cập thư mục Backend
```bash
git clone [https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-BE.git](https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-BE.git)
cd phat-trien-ung-dung-ma-nguon-mo-BE
Bước 2: Tạo môi trường ảo và cài đặt thư viện

Bash

python -m venv venv

# Windows:
.\venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
Bước 3: Cấu hình biến môi trường (.env) Tạo file .env và điền thông tin Database PostgreSQL:

Đoạn mã

DATABASE_URL="postgresql://user:password@localhost:5432/community_db"
SECRET_KEY="your_secret_key_here"
Bước 4: Chạy Server

Bash

uvicorn main:app --reload
# API sẽ chạy tại: http://localhost:8000
🅱️ Phần Frontend (Client)
Bước 1: Clone và truy cập thư mục Frontend

Bash

git clone [https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-FE.git](https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-FE.git)
cd phat-trien-ung-dung-ma-nguon-mo-FE
Bước 2: Cài đặt thư viện

Bash

npm install
# hoặc
yarn install
Bước 3: Cấu hình biến môi trường (.env.local)

Đoạn mã

NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
Bước 4: Chạy ứng dụng

Bash

npm run dev
# Truy cập trình duyệt tại: http://localhost:3000
☁️ 4. Hướng Dẫn Triển Khai (Deploy) trên Vercel
Dự án Frontend được tối ưu hóa để deploy trên Vercel.

Chuẩn bị: Đảm bảo code Frontend đã được push lên GitHub.

Đăng nhập: Truy cập Vercel và đăng nhập bằng GitHub.

Tạo Project:

Chọn "Add New..." ➝ "Project".

Import repository phat-trien-ung-dung-ma-nguon-mo-FE.

Cấu hình (Configure):

Framework Preset: Next.js.

Environment Variables: Copy nội dung từ .env.local vào đây (Lưu ý: Thay đổi NEXT_PUBLIC_API_URL thành domain thật của Backend đã deploy).

Deploy: Nhấn nút "Deploy" và chờ khoảng 1-2 phút.

📸 Demo Giao Diện
<div align="center"> <img src="./image.png" alt="Giao diện trang chủ" width="45%"> &nbsp; &nbsp; &nbsp; <img src="./image-1.png" alt="Giao diện thảo luận" width="45%"> </div>

<div align="center"> <strong>© 12/2025 - Nhóm 11: Community Forum</strong>