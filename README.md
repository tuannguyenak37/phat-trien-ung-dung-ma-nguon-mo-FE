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

</div>

---

## 👥 Thành Viên Nhóm 11

| STT | Họ và Tên | Mã Sinh Viên | Vai Trò | GitHub |
|:---:|:---|:---:|:---|:---:|
| 1 | **Nguyễn Văn Tuấn** | 23050150 | Trưởng nhóm (Fullstack) | [@tuannguyenak37](https://github.com/tuannguyenak37) |
| 2 | **Nguyễn Thị Vân Khánh** | 23050183 | Thành viên (Frontend/UI-UX) | [@ChanhChanh-307](https://github.com/ChanhChanh-307) |

---

## 🔗 Repository Source Code

| Thành phần | Đường dẫn Repository | Mô tả ngắn |
| :--- | :--- | :--- |
| **Backend** | [![GitHub](https://img.shields.io/badge/GitHub-Backend-181717?logo=github)](https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-BE) | API (FastAPI), Database (PostgreSQL), Migrations. |
| **Frontend** | [![GitHub](https://img.shields.io/badge/GitHub-Frontend-181717?logo=github)](https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-FE) | UI (Next.js), React Query, NextAuth. |

---

## 📖 1. Tổng Quan
**Community Forum** là nền tảng mã nguồn mở hiện đại cho phép người dùng đặt câu hỏi, chia sẻ kiến thức và thảo luận. Dự án tập trung vào trải nghiệm SPA mượt mà, tối ưu SEO và tương tác realtime.

## 🛠 2. Công Nghệ

| Phân hệ | Công nghệ sử dụng |
| :--- | :--- |
| **Frontend** | `Next.js 14` `Tailwind CSS` `React Query` |
| **Backend** | `FastAPI (Python)` `SQLAlchemy` `Pydantic` |
| **Database** | `PostgreSQL` |
| **Deploy** | `Vercel` (FE) & `Render/Railway` (BE) |

---

## 🚀 3. Hướng Dẫn Cài Đặt (Local Development)

<details>
<summary><strong>🅰️ Cài đặt Backend (API & Database) - Bấm để xem</strong></summary>

<br>

**Bước 1: Clone Repository**
```bash
git clone https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-BE.git
cd phat-trien-ung-dung-ma-nguon-mo-BE
Bước 2: Tạo môi trường ảo (Virtual Env)

Bash

python -m venv venv

# Windows:
.\venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate
Bước 3: Cài đặt thư viện

Bash

pip install -r requirements.txt
Bước 4: Cấu hình .env

Đoạn mã

DATABASE_URL="postgresql://user:password@localhost:5432/community_db"
SECRET_KEY="your_secret_key_here"
Bước 5: Chạy Server

Bash

uvicorn main:app --reload
# Server chạy tại: http://localhost:8000
</details>

<details> <summary><strong>🅱️ Cài đặt Frontend (Client) - Bấm để xem</strong></summary>

Bước 1: Clone Repository

Bash

git clone https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-FE.git
cd phat-trien-ung-dung-ma-nguon-mo-FE
Bước 2: Cài đặt Packages

Bash

npm install
# hoặc yarn install
Bước 3: Cấu hình .env.local

Đoạn mã

NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
Bước 4: Chạy ứng dụng

Bash

npm run dev
# Truy cập: http://localhost:3000
</details>

☁️ 4. Hướng Dẫn Deploy (Vercel)
<details> <summary><strong>👉 Xem hướng dẫn deploy Frontend lên Vercel</strong></summary>

Chuẩn bị: Push code Frontend lên GitHub.

Vercel Dashboard: Chọn Add New Project ➝ Import repo Frontend.

Cấu hình:

Framework Preset: Next.js

Environment Variables: Copy từ .env.local (Nhớ đổi API_URL thành link Backend thật).

Deploy: Nhấn nút Deploy và chờ hoàn tất.

</details>

📸 Demo Giao Diện
<div align="center"> <img src="./image.png" alt="Trang chủ" width="45%"> &nbsp;&nbsp; <img src="./image-1.png" alt="Thảo luận" width="45%"> </div>

<div align="center"> <strong>© 12/2025 - Nhóm 11: Community Forum</strong>


<i>Bài tập lớn môn Phát triển ứng dụng mã nguồn mở</i> </div>