<div align="center">

# 🌐 ĐỀ TÀI 11: COMMUNITY FORUM
### (Diễn đàn thảo luận và chia sẻ kiến thức trực tuyến)

**Môn học:** Phát triển ứng dụng mã nguồn mở  
**Giảng viên hướng dẫn:** GV. Lê Duy Hùng

</div>

## 👥 Thành Viên Nhóm

| STT | Họ và Tên | Mã Sinh Viên | Vai Trò | GitHub |
|:---:|:---|:---:|:---|:---:|
| 1 | **Nguyễn Văn Tuấn** | 23050150 | Trưởng nhóm (fullstack)
| 2 | **Nguyễn Thị Vân Khánh** | 23050183 | Thành viên (Frontend/UI-UX) | 

---

## 📖 1. Tổng Quan Đề Tài

**Community Forum** là một nền tảng mã nguồn mở hiện đại, nơi người dùng có thể đặt câu hỏi, chia sẻ kiến thức và thảo luận về các chủ đề khác nhau. Dự án tập trung vào trải nghiệm người dùng mượt mà (SPA) và khả năng tương tác thời gian thực.

## 🛠 2. Công Nghệ Sử Dụng

Dự án được xây dựng trên Next.js framework mạnh mẽ:

| Thành phần | Công nghệ |
| :--- | :--- |
| **Frontend** | Next.js Tailwind CSS |
| **Backend** | fastapi|
| **Database** | PostgreSQL  |
| **State Management** | React Context API / Zustand |
| **Deployment** | Vercel Platform |

---

## 🚀 3. Hướng Dẫn Cài Đặt (Local Development)

Để chạy dự án trên máy cá nhân, vui lòng thực hiện các bước sau:

### Bước 1: Clone dự án
```bash
git clone dự án
cd frontend
Bước 2: Cài đặt thư viện
Bash

npm install
# hoặc
yarn install
Bước 3: Cấu hình biến môi trường (.env)
Tạo file .env tại thư mục gốc và điền các thông số kết nối Database/Auth:

Đoạn mã

DATABASE_URL="mongodb+srv://..."
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
Bước 4: Chạy ứng dụng
Bash

npm run dev
Truy cập trình duyệt tại: http://localhost:3000

☁️ 4. Hướng Dẫn Triển Khai (Deploy) trên Vercel
Dự án này được tối ưu hóa để deploy trên Vercel - Nền tảng Cloud tốt nhất cho Next.js.

Quy trình Deploy chi tiết:
Chuẩn bị Source Code:

Đảm bảo code đã được commit và push lên GitHub (hoặc GitLab/Bitbucket).

Đăng nhập Vercel:

Truy cập vercel.com và đăng nhập bằng tài khoản GitHub.

Tạo Project mới:

Tại Dashboard, nhấn nút "Add New..." ➝ chọn "Project".

Tại mục Import Git Repository, tìm và chọn repo community-forum của nhóm.

Cấu hình Project (Configure Project):

Framework Preset: Vercel sẽ tự động nhận diện là Next.js.

Root Directory: ./ (để mặc định).

Environment Variables: Mở rộng phần này. Bạn cần copy toàn bộ nội dung trong file .env (ở máy local) và dán vào đây để Server trên Vercel có thể kết nối được Database.

Thực hiện Deploy:

Nhấn nút "Deploy".

Chờ khoảng 1-2 phút để Vercel tiến hành Build và khởi tạo Serverless Functions.

Hoàn tất:

Sau khi màn hình chúc mừng hiện ra, Vercel sẽ cung cấp một đường link (domain) chính thức cho dự án (ví dụ: https://community-forum-nhom11.vercel.app).

<div align="center">

📸 Demo Giao Diện
![alt text](image.png)

</div>

© 12/2025 - Nhóm 11: Community Forum Sản phẩm thuộc bài tập lớn môn Phát triển ứng dụng mã nguồn mở.