# MỘ ĐÁ ĐẸP - WEBSITE GIỚI THIỆU & THI CÔNG LĂNG MỘ ĐÁ CAO CẤP
> **Tên miền:** [modadep.com.vn](https://modadep.com.vn)  
> **Hotline / Zalo:** 0988.226.951  
> **Email:** Modadep8386@gmail.com  
> **Xưởng chế tác:** Làng nghề đá mỹ nghệ Ninh Vân, Hoa Lư, Ninh Bình

---

## 🌟 Giới Thiệu Dự Án
Website được thiết kế dựa trên tiêu chuẩn bố cục của các trang doanh nghiệp sản xuất uy tín hàng đầu, chuyên biệt cho ngành **Đá Mỹ Nghệ & Lăng Mộ Đá Tâm Linh**.

### Các Tính Năng Nổi Bật:
1. **Giao diện đẳng cấp:** Tông màu vàng đồng hoàng gia và xanh đen trầm, mang lại cảm giác trang nghiêm, bền vững.
2. **Khung bố cục toàn diện:**
   - Hero banner giới thiệu làng nghề & các con số năng lực uy tín.
   - Giới thiệu xưởng chế tác truyền thống Ninh Vân 25+ năm kinh nghiệm.
   - Danh mục sản phẩm & Lưới mẫu lăng mộ có bộ lọc Tabs thông minh.
   - **Tiện ích Thước Lỗ Ban 38.8cm online**: Tra cứu cung tốt / xấu chuẩn âm trạch.
   - Thư viện hình ảnh công trình thực tế đã nghiệm thu tại các tỉnh thành.
   - Giấy chứng nhận làng nghề, nghệ nhân bàn tay vàng, OCOP 4 sao.
   - Cẩm nang phong thủy xây mộ chuẩn chỉ.
   - Form nhận dự toán báo giá & thiết kế 3D miễn phí.
   - Nút gọi Hotline rung lắc & Chat Zalo nổi gắn liền màn hình.
3. **Trang Quản Trị Admin (`/admin` hoặc `admin.html`):** Cho phép tự chỉnh sửa toàn bộ nội dung, giá bán, bài viết và tải ảnh từ máy tính lên.

---

## 🚀 Hướng Dẫn Chạy & Triển Khai Miễn Phí

### 1. Chạy Trực Tiếp Bằng Trình Duyệt
- Nhấp đúp vào file `index.html` để xem website.
- Nhấp đúp vào file `admin.html` để vào trang quản trị (Tài khoản: `admin` / `modadep8386`).

### 2. Triển Khai Miễn Phí Lên GitHub Pages
1. Vào repository trên GitHub của bạn.
2. Chọn **Settings** ➡️ **Pages** (ở menu bên trái).
3. Tại mục **Build and deployment** ➡️ **Branch**: Chọn `main` (hoặc `master`) và thư mục `/ (root)`, sau đó nhấn **Save**.
4. Chờ 1 phút, website sẽ hoạt động trực tiếp trên toàn cầu với đường link dạng:  
   `https://<tên-tài-khoản-github>.github.io/<tên-repo>/`

### 3. Gắn Tên Miền Riêng `modadep.com.vn`
- Bạn có thể trỏ bản ghi DNS của tên miền `modadep.com.vn` vào GitHub Pages hoặc liên kết qua Vercel / Cloudflare Pages hoàn toàn miễn phí.

---

## 📁 Cấu Trúc Thư Mục
```
website-lang-mo-da/
├── index.html          # Trang chủ website khách hàng xem
├── admin.html          # Trang quản trị chỉnh sửa nội dung
├── data/
│   └── content.json    # Cơ sở dữ liệu nội dung & danh sách khách gửi báo giá
├── uploads/            # Thư mục chứa hình ảnh tải lên
├── server.js           # Máy chủ backend Node.js (nếu chạy server)
├── Dockerfile          # Cấu hình container (tùy chọn)
├── docker-compose.yml  # Cấu hình docker compose (tùy chọn)
└── README.md           # Tài liệu hướng dẫn dự án
```
