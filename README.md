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
**Học kỳ:** 1 – Năm học 2025–2026

</div>

---

## 👥 Thành viên Nhóm 11

| STT | Họ và Tên | Mã Sinh Viên | Vai Trò | GitHub |
|---|---|---|---|---|
| 1 | **Nguyễn Văn Tuấn** | 23050150 | Trưởng nhóm (Fullstack) | [@tuannguyenak37](https://github.com/tuannguyenak37) |
| 2 | **Nguyễn Thị Vân Khánh** | 23050183 | Thành viên (Frontend / UI-UX) | [@ChanhChanh-307](https://github.com/ChanhChanh-307) |

---

## 🔗 Repository Source Code

| Thành phần | Repository | Mô tả |
|---|---|---|
| Backend | [GitHub – Backend](https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-BE) | FastAPI, PostgreSQL, SQLAlchemy |
| Frontend | [GitHub – Frontend](https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-FE) | Next.js, React Query, NextAuth |

---

## 📖 1. Tổng quan

**Community Forum** là nền tảng mã nguồn mở cho phép người dùng đặt câu hỏi, thảo luận và chia sẻ kiến thức trực tuyến. Hệ thống được xây dựng theo mô hình SPA, tối ưu SEO và trải nghiệm người dùng.

---

## 🛠 2. Công nghệ sử dụng

- **Frontend:** Next.js 14, Tailwind CSS, React Query  
- **Backend:** FastAPI (Python), SQLAlchemy, Pydantic  
- **Database:** PostgreSQL  
- **Triển khai:** Vercel (Frontend), Render / Railway (Backend)

---

## 🚀 3. Hướng dẫn cài đặt (Local Development)

### 🅰️ Backend (API & Database)

```bash
git clone https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-BE.git
cd phat-trien-ung-dung-ma-nguon-mo-BE

# Tạo và kích hoạt môi trường ảo
python -m venv venv
# Windows: .\\venv\\Scripts\\activate
# Mac/Linux: source venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt

# Cấu hình biến môi trường (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/community_db
SECRET_KEY=your_secret_key_here

# Chạy server
uvicorn main:app --reload
```

---

### 🅱️ Frontend (Client)

```bash
git clone https://github.com/tuannguyenak37/phat-trien-ung-dung-ma-nguon-mo-FE.git
cd phat-trien-ung-dung-ma-nguon-mo-FE

# Cài đặt packages
npm install

# Cấu hình .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Chạy ứng dụng
npm run dev
```

---

## ☁️ 4. Hướng dẫn Deploy (Vercel)

1. Push mã nguồn Frontend lên GitHub  
2. Truy cập **Vercel → Add New Project → Import Repository**  
3. Cấu hình **Environment Variables** (theo `.env.local`)  
4. Tiến hành **Deploy**

---

## 📸 Demo giao diện

<p align="center">
  <img src="./image.png" alt="Trang chủ" width="45%" />
  <img src="./image-1.png" alt="Thảo luận" width="45%" />
</p>

---

<p align="center"><strong>© 12/2025 – Nhóm 11: Community Forum</strong></p>
<p align="center"><em>Bài tập lớn môn Phát triển ứng dụng mã nguồn mở</em></p>

